"use strict";

const TestDAO = require("../test_DB/TestDAO");
const UserController = require("../../controller/UserController");
const dao = new TestDAO();
const user = new UserController(dao);
const bcrypt        = require('bcrypt');

/*
    Actual Testing
    =================================================
*/

/**
 * API:
 *            GET /api/users
 *  =================================================
 */
describe('get users', () => {
    beforeEach( async () => {
        await dao.dropTableUsers();
        await dao.newTableUsers();
        await dao.run("INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)",
        [
            "ciccio1@ezwh.com", 
            "Ciccio",
            "Pasticcio",
            "testpassword",
            "customer"
        ] ),
        await dao.run("INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)",
        [
            "joe@ezwh.com", 
            "Joe",
            "Biden",
            "testpassword",
            "clerk"
        ] )
    })
    
    getStoredUsers("Get user ok", [
        {
            id: 1,
            email: "ciccio1@customer.ezwh.com", 
            name: "Ciccio",
            surname: "Pasticcio",
            type: "customer"
        },
        {
        id: 2,
        email: "joe@clerk.ezwh.com", 
        name: "Joe",
        surname: "Biden",
        type: "clerk"
        }
    ])
}) 

/**
 * API:
 *            GET /api/suppliers
 *  =================================================
 */
describe('get suppliers', () => {
    beforeEach( async () => {
        await dao.dropTableUsers();
        await dao.newTableUsers();
        await dao.run("INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)",
        [
            "mj@ezwh.com", 
            "Mary",
            "Jane",
            "testpassword",
            "supplier"
        ] ),
        await dao.run("INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)",
        [
            "peter@ezwh.com", 
            "Peter",
            "Parker",
            "testpassword",
            "supplier"
        ] )
    })

    getSuppliers("Get user ok", [
        {
            id: 1,
            email: "mj@supplier.ezwh.com", 
            name: "Mary",
            surname: "Jane",
            type: "supplier"
        },
        {
        id: 2,
        email: "peter@supplier.ezwh.com", 
        name: "Peter",
        surname: "Parker",
        type: "supplier"
        }
    ])
})

/**
 * API:
 *            POST /api/newUser
 *  =================================================
 */

newUser("user ok", false, {
    username : "clerk1@ezwh.com",
    name: "Donald",
    surname: "Trump",
    type: "clerk",
    password: "testpassword"
},
201);

newUser("user already exists", true, {
    username : "clerk1@ezwh.com",
    name: "Donald",
    surname: "Trump",
    type: "clerk",
    password: "testpassword",
}, 409);

newUser("bad request", true, undefined, 503)

/**
 * API:
 *            GET sessions
 *  =================================================
 */
 getUser("ok",
 {username: "mj@ezwh.com", password: "testpassword"},
 { 
    username: "mj@ezwh.com", 
    name: "Mary",
    surname: "Jane",
    password: "testpassword",
    type: "supplier"
},
{id:1, username: "mj@ezwh.com", name: "Mary"})

getUser("wrong password", {username: "manager1@ezwh.com", password: "pippopluto"}, 
{
    id: 1,
    username: "manager1@ezwh.com",
    name: "Dave",
    surname: "Grohl",
    type: "manager",
    password: "testpassword"
}, 401);

getUser("wrong username",{username: "customer1@ezwh.com", password: "testpassword"}, undefined, 401);

getUser("bad request", undefined, 
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
editUser("edited ok",
    {
        "oldType" : "clerk",
        "newType" : "qualityEmployee"
    },
    "user1@ezwh.com",
    {
        username:"user1@ezwh.com",
        name: "Giovanni",
        surname: "Muciaccia",
        password: "testpassword",
        type: "clerk"
    },
    200
)

editUser("user not found",{
    "oldType" : "clerk",
    "newType" : "qualityEmployee"
    },
    "user2@ezwh.com",
    {
        username:"user1@ezwh.com",
        name: "Giovanni",
        surname: "Muciaccia",
        password: "testpassword",
        type: "clerk"
    },
    404
)

editUser("bad request", undefined,
    "user1@ezwh.com",
    {
        username:"user1@ezwh.com",
        name: "Giovanni",
        surname: "Muciaccia",
        password: "testpassword",
        type: "clerk"
    },
    503
)

/**
 * API:
 *            DELETE /users/:username/:type
 *  =================================================
 */

deleteUser(
    "deleted ok",
    {type: "customer", username : "customer1@ezwh.com"},
    {
        username : "customer1@ezwh.com",
        name: "Johnny",
        surname: "Stecchino",
        password: "testpassword",
        type: "customer"
    },
    204
)

deleteUser(
    "bad request",
    undefined,
    {
        username : "customer1@ezwh.com",
        name: "Johnny",
        surname: "Stecchino",
        password: "testpassword",
        type: "customer"
    },
    503
)

/*
    Definitions of testing functions
    =================================================
*/

function getStoredUsers(name, expected) {
    test(name, async() => {
        let res = await user.getStoredUsers();
        expect(res).toEqual(expected);
    })
}

function newUser(name, exists, usr, expected) {
    describe("new user", () => {
        if(!exists) {
            beforeEach(async() => {
                await dao.dropTableUsers();
                await dao.newTableUsers();
            })
        }

        test(name, async() => {
            let res = await user.newUser(usr);
            expect(res).toEqual(expected);
        })
    })
}

function getSuppliers(name, expected){
    test(name, async() => {
        let res = await user.getStoredUsers();
        expect(res).toEqual(expected);
    })
}

function getUser(name, req, to_test, expected){
    describe('login', () =>{
        if(to_test){
            beforeEach(async () => {
                await dao.dropTableUsers();
                await dao.newTableUsers();
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(to_test.password, salt);
                await dao.run("INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)", [to_test.username, to_test.name, to_test.surname, hash, to_test.type])
            })
        }
        test(name, async () => {
            let res = await user.getUser(req);
            expect(res).toEqual(expected)
        })
    })
}

function editUser(name, req, username, to_test, expected) {
    describe('edit user',() => {
        beforeEach(async () => {
            if(to_test) {
                await dao.dropTableUsers();
                await dao.newTableUsers();
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(to_test.password, salt);
                await dao.run("INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)", [to_test.username, to_test.name, to_test.surname, hash, to_test.type])
            }
        })

        test(name, async ()=> {
            let res = await user.editUser(req, username);
            expect(res).toEqual(expected);
        })
    })
}

function deleteUser(name, req, to_test, expected) {
    describe('delete user',() => {
        beforeEach( async () => {
            if(to_test) {
                await dao.dropTableUsers();
                await dao.newTableUsers();
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(to_test.password, salt);
                await dao.run("INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)", [to_test.username, to_test.name, to_test.surname, hash, to_test.type])
            }
        })

        test(name, async ()=> {
            let res = await user.deleteUser(req);
            expect(res).toEqual(expected);
        })
    })
}