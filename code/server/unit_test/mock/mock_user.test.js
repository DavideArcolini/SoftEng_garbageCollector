const dao = require("../test_DB/mock_userDAO");
const UserController = require("../../controller/UserController");
const user = new UserController(dao);
const bcrypt        = require('bcrypt');

/*
    Actual Testing
    =================================================
*/

/**
 * API:
 *            POST /api/newUser_TEST_mock
 *  =================================================
 */
//  201
newUser_TEST_mock("insert ok", {
    username:"supplier1@ezwh.com",
    name : "Voldemort",
    surname: "You-Know-Who",
    type: "supplier",
    password :"testpassword"
}, undefined, 201);

//  409
newUser_TEST_mock("user already exists", {
    username:"supplier1@ezwh.com",
    name : "Voldemort",
    surname: "You-Know-Who",
    type: "supplier",
    password :"testpassword"
},
{username:"supplier1@ezwh.com"}
, 409);

//  503
newUser_TEST_mock("bad request", undefined, undefined, 503);

/**
 * API:
 *            GET /api/users
 *  =================================================
 */
getStoredUsers_TEST_mock([{
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
getSuppliers_TEST_mock([{
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
getUser_TEST_mock("return ok", {username: "manager1@ezwh.com", password: "testpassword"}, {
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
getUser_TEST_mock("wrong password", {username: "manager1@ezwh.com", password: "pippopluto"}, 
{
    id: 1,
    username: "manager1@ezwh.com",
    name: "Dave",
    surname: "Grohl",
    type: "manager",
    password: "testpassword"
}, 401);
//  wrong username
getUser_TEST_mock("wrong username",{username: "customer1@ezwh.com", password: "testpassword"}, 
    undefined, 401);

//  500
getUser_TEST_mock("bad request", undefined, 
{
    id: 1,
    username: "manager1@ezwh.com",
    name: "Dave",
    surname: "Grohl",
    type: "manager",
    password: "testpassword"
}, undefined);
/**
 * API:
 *            PUT /api/users/:username
 *  =================================================
 */
//  200
editUser_TEST_mock("edited ok",{
    "oldType" : "clerk",
    "newType" : "qualityEmployee"
    },
    "user1@ezwh.com",
    {username: "user1@ezwh.com"},
    200
)
//  404
//  user not found
editUser_TEST_mock("user not found",{
    "oldType" : "clerk",
    "newType" : "qualityEmployee"
    },
    "user1@ezwh.com",
    undefined,
    404
)

//  503
editUser_TEST_mock("bad request", undefined,
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
deleteUser_TEST_mock(
    "deleted ok",
    {type: "customer", username : "customer1@ezwh.com"},
    {type: "customer", username : "customer1@ezwh.com"},
    204
)

//  503
deleteUser_TEST_mock(
    "bad request",
    undefined,
    {type: "customer", username : "customer1@ezwh.com"},
    503
)

/*
    Definitions of testing functions
    =================================================
*/
function newUser_TEST_mock(name, req, to_test, expected) {
    describe('new user', () => {
        beforeEach( () => {
            dao.getUser.mockReset();
            dao.createUser.mockReset();
            dao.getUser.mockReturnValue(to_test)
        })
        
        test(name, async() => {
            let res = await user.newUser(req);
            expect(res).toEqual(expected);
        })
    }) 
}

function getStoredUsers_TEST_mock(expected){
    describe('get users', () => {
        beforeEach( () => {
            dao.getUsers.mockReset();
            dao.getUsers.mockReturnValue([{
                id: 2,
                name: "Pippo",
                surname: "Franco",
                email: "user1@customer.ezwh.com",
                type: "customer"
            }])
        })
        
        test('get users', async() => {
            let res = await user.getStoredUsers();
            expect(res).toEqual(expected)
        })
    })
}

function getSuppliers_TEST_mock(expected){
    describe('get suppliers', () => {
        beforeEach( () => {
            dao.getUsers.mockReset();
            dao.getUsers.mockReturnValue([{
                id: 2,
                name: "Pippo",
                surname: "Franco",
                email: "user1@supplier.ezwh.com",
                type: "supplier"
            }])
        })
        
        test('get users', async() => {
            let res = await user.getSuppliers();
            expect(res).toEqual(expected);
        })
    })
}

function getUser_TEST_mock(name, req, to_test, expected){
    describe('login', ()=> {
        beforeEach(async () => {
            dao.getUser.mockReset();
            if (to_test){
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(to_test.password, salt);
                dao.getUser.mockReset();
                dao.getUser.mockReturnValue({
                    id: 1,
                    username: to_test.username,
                    name: to_test.name,
                    surname: to_test.surname,
                    type: to_test.type,
                    password: hash
                })
            }
            else {
                dao.getUser.mockReturnValue(to_test)
            }
        })

        test(name, async () => {
            let res = await user.login(req);
            expect(res).toEqual(expected)
        })
    })
}

function editUser_TEST_mock(name, req, username, to_test, expected) {
    describe('edit user',() => {
        beforeEach(async () => {
            dao.getUser.mockReset();
            dao.modifyPermissions.mockReset();
            dao.getUser.mockReturnValue(to_test)
        })

        test(name, async ()=> {
            let res = await user.editUser(req, username);
            expect(res).toEqual(expected);
        })
    })
}

function deleteUser_TEST_mock(name, req, to_test, expected) {
    describe('delete user',() => {
        beforeEach( async () => {
            dao.getUser.mockReset();
            dao.removeUser.mockReset();
            dao.getUser.mockReturnValue(to_test)
        })

        test(name, async ()=> {
            let res = await user.deleteUser(req);
            expect(res).toEqual(expected);
        })
    })
}