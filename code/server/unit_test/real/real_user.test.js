"use strict";

const UserController = require("../../controller/UserController");
const dao = require("../../db/userDAO")
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
    beforeAll( async () => {
        await dao.getUsers()
        await dao.deleteAllUsers();
        await dao.createUser(
            "ciccio1@ezwh.com", 
            "Ciccio",
            "Pasticcio",
            "testpassword",
            "customer" );
    })
    
    getStoredUsers_TEST("Get users ok", [
        {
            id: 1,
            email: "ciccio1@customer.ezwh.com", 
            name: "Ciccio",
            surname: "Pasticcio",
            type: "customer"
        }
    ])

    afterAll(async() => {
        await dao.deleteAllUsers()
    })
}) 

/**
 * API:
 *            GET /api/suppliers
 *  =================================================
 */
describe('get suppliers', () => {
    beforeAll( async () => {
        await dao.deleteAllUsers()
        const salt = await bcrypt.genSalt(10);
        await dao.createUser(
            "mj@ezwh.com", 
            "Mary",
            "Jane",
            "testpassword",
            "supplier"
        ),
        await dao.createUser(        
            "peter@ezwh.com", 
            "Peter",
            "Parker",
            "testpassword",
            "supplier"
        )
    })

    getSuppliers_TEST("Get user ok", [
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
    ]);

    afterAll(async() => {
        await dao.deleteAllUsers()
    })
})

/**
 * API:
 *            POST /api/newUser_TEST
 *  =================================================
 */

 describe("new user", () => {
    newUser_TEST("user ok", {
        username : "clerk1@ezwh.com",
        name: "Donald",
        surname: "Trump",
        type: "clerk",
        password: "testpassword"
    },
    201);
    
    newUser_TEST("user already exists", {
        username : "clerk1@ezwh.com",
        name: "Donald",
        surname: "Trump",
        type: "clerk",
        password: "testpassword",
    }, 409);
    
    newUser_TEST("bad request", undefined, 503)

    afterAll(async() => {
        await dao.deleteAllUsers()
    })
    
})

/**
 * API:
 *            GET sessions
 *  =================================================
 */

describe('get user', () => {
    beforeAll(async() => {
        await dao.deleteAllUsers()
        let to_test = { 
            username: "mj@ezwh.com", 
            name: "Mary",
            surname: "Jane",
            password: "testpassword",
            type: "supplier"
        };
        await dao.createUser(to_test.username, to_test.name, to_test.surname, to_test.password, to_test.type)
    })

    getUser_TEST("ok",
    {username: "mj@ezwh.com", password: "testpassword"},
    {id:1, username: "mj@ezwh.com", name: "Mary"})

    getUser_TEST("wrong password", {id:1, username: "mj@ezwh.com", password: "ciaociao"}, 401);

    getUser_TEST("wrong username", {id:1, username: "customer1@ezwh.com", password: "testpassword"}, 401);

    getUser_TEST("bad request", undefined, undefined);

    afterAll(async() => {
        await dao.deleteAllUsers()
    })
})

/**
 * API:
 *            PUT /api/users/:username
 *  =================================================
 */
describe('edit user', () => {
    let to_test = { 
        username: "mj@ezwh.com", 
        name: "Mary",
        surname: "Jane",
        password: "testpassword",
        type: "supplier"
    };
    beforeAll(async() => {
        await dao.deleteAllUsers()
        await dao.createUser(to_test.username, to_test.name, to_test.surname, to_test.password, to_test.type)
    })

    //  200
    editUser_TEST("edited ok",
    {
        "oldType" : "supplier",
        "newType" : "qualityEmployee"
    },
    to_test.username,200)

    editUser_TEST("user not found",{
    "oldType" : "clerk",
    "newType" : "qualityEmployee"
    },
    to_test.username,404)

    editUser_TEST("bad request", undefined, "mj@ezwh.com", 503)

    editUser_TEST("bad request", {
        "oldType" : "clerk",
        "newType" : "qualityEmployee"
        },
    undefined, 503)

    afterAll(async() => {
        await dao.deleteAllUsers()
    })
})

/**
 * API:
 *            DELETE /users/:username/:type
 *  =================================================
 */
describe('delete user', () => {
    beforeAll(async() => {
        await dao.deleteAllUsers()
        let to_test = { 
            username: "mj@ezwh.com", 
            name: "Mary",
            surname: "Jane",
            password: "testpassword",
            type: "supplier"
        };
        await dao.createUser(to_test.username, to_test.name, to_test.surname, to_test.password, to_test.type)
    })

    deleteUser_TEST("bad request", undefined, 503)
    deleteUser_TEST("username not found", {type: "supplier", username : "pippo@ezwh.com"}, 503)
    deleteUser_TEST("type didn't match with user", {type: "clerk", username : "mj@ezwh.com"}, 503)
    deleteUser_TEST("deleted ok", {type: "supplier", username : "mj@ezwh.com"}, 204)
})

/*
    Definitions of testing functions
    =================================================
*/

function getStoredUsers_TEST(name, expected) {
    test(name, async() => {
        let res = await user.getStoredUsers();
        expect(res).toEqual(expected);
    })
}

function newUser_TEST(name, usr, expected) {
    test(name, async() => {
        let res = await user.newUser(usr);
        expect(res).toEqual(expected);
    })
}

function getSuppliers_TEST(name, expected){
    test(name, async() => {
        let res = await user.getSuppliers();
        expect(res).toEqual(expected);
    })
}

function getUser_TEST(name, req, expected){
    test(name, async () => {
        let res = await user.login(req);
        expect(res).toEqual(expected)
    })
}

function editUser_TEST(name, req, username, expected) {
    test(name, async ()=> {
        let res = await user.editUser(req, username);
        expect(res).toEqual(expected);
    })
}

function deleteUser_TEST(name, req, expected) {
    test(name, async ()=> {
        let res = await user.deleteUser(req);
        expect(res).toEqual(expected);
    })
}