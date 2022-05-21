const dao = require("./mockDB/mock_dao");
const UserController = require("../controller/UserController");
const user = new UserController(dao);
const bcrypt        = require('bcrypt');

/*
    Actual Testing
    =================================================
*/

/**
 * API:
 *            POST /api/newUser
 *  =================================================
 */
//  201
newUser({
    username:"supplier1@ezwh.com",
    name : "Voldemort",
    surname: "You-Know-Who",
    type: "supplier",
    password :"testpassword"
}, undefined, 201);

//  422 
//  inserting manager
newUser({
    username:"supplier1@ezwh.com",
    name : "Voldemort",
    surname: "You-Know-Who",
    type: "manager",
    password :"testpassword"
}, undefined, 422);

//  inserting administrator
newUser({
    username:"supplier1@ezwh.com",
    name : "Voldemort",
    surname: "You-Know-Who",
    type: "administrator",
    password :"testpassword"
}, undefined, 422);

//  inserting password.length < 8
newUser({
    username:"supplier1@ezwh.com",
    name : "Voldemort",
    surname: "You-Know-Who",
    type: "supplier",
    password :"test"
}, undefined, 422);

//  inserting wrong username
newUser({
    username:"supplier1",
    name : "Voldemort",
    surname: "You-Know-Who",
    type: "supplier",
    password :"testpassword"
}, undefined, 422);

//  inserting empty body
newUser({}, undefined, 422);

//  409
newUser({
    username:"supplier1@ezwh.com",
    name : "Voldemort",
    surname: "You-Know-Who",
    type: "supplier",
    password :"testpassword"
},
{username:"supplier1@ezwh.com"}
, 409);

//  503
newUser(undefined, undefined, 503);

/**
 * API:
 *            GET /api/users
 *  =================================================
 */
getStoredUsers([{
    id: 2,
    name: "Pippo",
    surname: "Franco",
    email: "user1@customer.ezwh.com",
    type: "customer"
}])

/**
 * API:
 *            GET /api/suppliers
 *  =================================================
 */
getSuppliers([{
    id: 2,
    name: "Pippo",
    surname: "Franco",
    email: "user1@supplier.ezwh.com",
    type: "supplier"
}]);

/**
 * API:
 *            GET sessions
 *  =================================================
 */
//  ok
getUser({username: "manager1@ezwh.com", password: "testpassword"}, {
    id: 1,
    username: "manager1@ezwh.com",
    name: "Dave",
    surname: "Grohl",
    type: "manager",
    password: "testpassword"
},
{
    id: 1,
    username: "manager1@ezwh.com",
    name: "Dave"
});

//  401
//  wrong password
getUser({username: "manager1@ezwh.com", password: "pippopluto"}, 
{
    id: 1,
    username: "manager1@ezwh.com",
    name: "Dave",
    surname: "Grohl",
    type: "manager",
    password: "testpassword"
}, 401);
//  wrong username
getUser({username: "customer1@ezwh.com", password: "testpassword"}, 
    undefined, 401);

//  500
getUser(undefined, 
{
    id: 1,
    username: "manager1@ezwh.com",
    name: "Dave",
    surname: "Grohl",
    type: "manager",
    password: "testpassword"
}, 500);
/**
 * API:
 *            PUT /api/users/:username
 *  =================================================
 */
//  200
editUser({
    "oldType" : "clerk",
    "newType" : "qualityEmployee"
    },
    "user1@ezwh.com",
    {username: "user1@ezwh.com"},
    200
)

//  422
//  empty body
editUser({},
    "user1@ezwh.com",
    {username: "user1@ezwh.com"},
    422
)
//  modify a manager
editUser({
    "oldType" : "manager",
    "newType" : "qualityEmployee"
    },
    "user1@ezwh.com",
    {username: "user1@ezwh.com"},
    422
)

//  upgrade to manager
editUser({
    "oldType" : "clerk",
    "newType" : "manager"
    },
    "user1@ezwh.com",
    {username: "user1@ezwh.com"},
    422
)

//  wrong username format
editUser({
    "oldType" : "clerk",
    "newType" : "qualityEmployee"
    },
    "user1",
    {username: "user1@ezwh.com"},
    422
)

//  404
//  user not found
editUser({
    "oldType" : "clerk",
    "newType" : "qualityEmployee"
    },
    "user1@ezwh.com",
    undefined,
    404
)

//  503
//  user not found
editUser(undefined,
    "user1@ezwh.com",
    {username: "user1@ezwh.com"},
    503
)

/**
 * API:
 *            DELETE /users/:username/:type
 *  =================================================
 */

//  204
deleteUser(
    {type: "customer", username : "customer1@ezwh.com"},
    {type: "customer", username : "customer1@ezwh.com"},
    204
)

//  422
//  can't delete manager
deleteUser(
    {type: "manager", username : "manager1@ezwh.com"},
    {type: "manager", username : "manager1@ezwh.com"},
    422
)
//  wrong username
deleteUser(
    {type: "customer", username : "customer1"},
    {type: "customer", username : "customer1"},
    422
)
//  user don't exists
deleteUser(
    {type: "customer", username : "customer1@ezwh.com"},
    undefined,
    422
)

//  503
deleteUser(
    undefined,
    {type: "customer", username : "customer1@ezwh.com"},
    503
)

/**
 * API:
 *            POST /logout
 *  =================================================
 */
//  200
logout({}, 200);

//  500
logout(undefined, 500)

/*
    Definitions of testing functions
    =================================================
*/
function newUser(req, to_test, expected) {
    describe('new user', () => {
        beforeEach( () => {
            dao.get.mockReset();
            dao.run.mockReset();
            dao.get.mockReturnValue(to_test)
        })
        
        test('new user', async() => {
            let res = await user.newUser(req);
            expect(res).toEqual(expected);
        })
    }) 
}

function getStoredUsers(expected){
    describe('get users', () => {
        beforeEach( () => {
            dao.all.mockReset();
            dao.all.mockReturnValue([{
                id: 2,
                name: "Pippo",
                surname: "Franco",
                username: "user1@ezwh.com",
                type: "customer"
            }])
        })
        
        test('get users', async() => {
            let res = await user.getStoredUsers();
            expect(res).toEqual(expected)
        })
    })
}

function getSuppliers(expected){
    describe('get suppliers', () => {
        beforeEach( () => {
            dao.all.mockReset();
            dao.all.mockReturnValue([{
                id: 2,
                name: "Pippo",
                surname: "Franco",
                username: "user1@supplier.ezwh.com",
                type: "supplier"
            }])
        })
        
        test('get users', async() => {
            let res = await user.getSuppliers();
            expect(res).toEqual(expected);
        })
    })
}

function getUser(req, to_test, expected){
    describe('login', ()=> {
        beforeEach(async () => {
            dao.get.mockReset();
            if (to_test){
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(to_test.password, salt);
                dao.get.mockReset();
                dao.get.mockReturnValue({
                    id: 1,
                    username: to_test.username,
                    name: to_test.name,
                    surname: to_test.surname,
                    type: to_test.type,
                    password: hash
                })
            }
            else {
                dao.get.mockReturnValue(to_test)
            }
        })

        test('get user', async () => {
            let res = await user.getUser(req);
            expect(res).toEqual(expected)
        })
    })
}

function editUser(req, username, to_test, expected) {
    describe('edit user',() => {
        beforeEach(async () => {
            dao.get.mockReset();
            dao.run.mockReset();
            dao.get.mockReturnValue(to_test)
        })

        test('edit user', async ()=> {
            let res = await user.editUser(req, username);
            expect(res).toEqual(expected);
        })
    })
}

function deleteUser(req, to_test, expected) {
    describe('delete user',() => {
        beforeEach( async () => {
            dao.get.mockReset();
            dao.run.mockReset();
            dao.get.mockReturnValue(to_test)
        })

        test('delete user', async ()=> {
            let res = await user.deleteUser(req);
            expect(res).toEqual(expected);
        })
    })
}

function logout(req, expected) {
    describe('logout', () => {
        
        test('logout', async() => {
            let res = await user.logout(req);
            expect(res).toEqual(expected);
        })
    })
}