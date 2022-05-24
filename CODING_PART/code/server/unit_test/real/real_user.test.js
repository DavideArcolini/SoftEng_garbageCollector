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
    beforeAll( async () => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash("testpassword", salt)
        await dao.run("INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)",
        [
            "ciccio1@ezwh.com", 
            "Ciccio",
            "Pasticcio",
            hash,
            "customer"
        ] ),
        await dao.run("INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)",
        [
            "joe@ezwh.com", 
            "Joe",
            "Biden",
            hash,
            "clerk"
        ] )
    })
    
    getStoredUsers_TEST("Get user ok", [
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

    afterAll(async() => {
        /* const sql = `
            DELETE from USERS
            WHERE username = (?) AND type = (?)
            `;
        await dao.run(sql, ["ciccio1@ezwh.com", "customer"])
        await dao.run(sql, ["joe@ezwh.com", "clerk"]) */
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
        await dao.run("INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)",
        [
            "mj@ezwh.com", 
            "Mary",
            "Jane",
            await bcrypt.hash("testpassword", salt),
            "supplier"
        ] ),
        await dao.run("INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)",
        [
            "peter@ezwh.com", 
            "Peter",
            "Parker",
            await bcrypt.hash("testpassword", salt),
            "supplier"
        ] )
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
        /* const sql = `
            DELETE from USERS
            WHERE username = (?) AND type = (?)
            `;
        await dao.run(sql, ["mj@ezwh.com", "supplier"])
        await dao.run(sql, ["peter@ezwh.com", "supplier"]) */
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
        /* const sql = `
            DELETE from USERS
            WHERE username = (?) AND type = (?)
            `;
        await dao.run(sql, ["clerk1@ezwh.com", "clerk"]) */
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
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(to_test.password, salt);
        await dao.run("INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)", [to_test.username, to_test.name, to_test.surname, hash, to_test.type])
    })

    getUser_TEST("ok",
    {username: "mj@ezwh.com", password: "testpassword"},
    {id:1, username: "mj@ezwh.com", name: "Mary"})

    getUser_TEST("wrong password", {id:1, username: "mj@ezwh.com", password: "ciaociao"}, 401);

    getUser_TEST("wrong username", {id:1, username: "customer1@ezwh.com", password: "testpassword"}, 401);

    getUser_TEST("bad request", undefined, undefined);

    afterAll(async() => {
        /* const sql = `
            DELETE from USERS
            WHERE username = (?) AND type = (?)
            `;
        await dao.run(sql, ["mj@ezwh.com", "supplier"]) */
        await dao.deleteAllUsers()
    })
})

/**
 * API:
 *            PUT /api/users/:username
 *  =================================================
 */
describe('edit user', () => {
    beforeAll(async() => {
        await dao.deleteAllUsers()
        let to_test = { 
            username: "mj@ezwh.com", 
            name: "Mary",
            surname: "Jane",
            password: "testpassword",
            type: "supplier"
        };
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(to_test.password, salt);
        await dao.run("INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)", [to_test.username, to_test.name, to_test.surname, hash, to_test.type])
    })

    //  200
    editUser_TEST("edited ok",
    {
        "oldType" : "clerk",
        "newType" : "qualityEmployee"
    },
    "mj@ezwh.com",200)

    editUser_TEST("user not found",{
    "oldType" : "clerk",
    "newType" : "qualityEmployee"
    },
    "user2@ezwh.com",404)

    editUser_TEST("bad request", undefined, "mj@ezwh.com", 503)

    editUser_TEST("bad request", {
        "oldType" : "clerk",
        "newType" : "qualityEmployee"
        },
    undefined, 503)

    afterAll(async() => {
        /* const sql = `
            DELETE from USERS
            WHERE username = (?) AND type = (?)
            `;
        await dao.run(sql, ["mj@ezwh.com", "qualityEmployee"]) */
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
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(to_test.password, salt);
        await dao.run("INSERT OR IGNORE INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)", [to_test.username, to_test.name, to_test.surname, hash, to_test.type])
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
        let res = await user.getUser(req);
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