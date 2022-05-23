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

    afterAll(async() => {
        const sql = `
            DELETE from USERS
            WHERE username = (?) AND type = (?)
            `;
        await dao.run(sql, ["ciccio1@ezwh.com", "customer"])
        await dao.run(sql, ["joe@ezwh.com", "clerk"])
    })
}) 

/**
 * API:
 *            GET /api/suppliers
 *  =================================================
 */
describe('get suppliers', () => {
    beforeAll( async () => {
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
    ]);

    afterAll(async() => {
        const sql = `
            DELETE from USERS
            WHERE username = (?) AND type = (?)
            `;
        await dao.run(sql, ["mj@ezwh.com", "supplier"])
        await dao.run(sql, ["peter@ezwh.com", "supplier"])
    })
})

/**
 * API:
 *            POST /api/newUser
 *  =================================================
 */

 describe("new user", () => {
    newUser("user ok", {
        username : "clerk1@ezwh.com",
        name: "Donald",
        surname: "Trump",
        type: "clerk",
        password: "testpassword"
    },
    201);
    
    newUser("user already exists", {
        username : "clerk1@ezwh.com",
        name: "Donald",
        surname: "Trump",
        type: "clerk",
        password: "testpassword",
    }, 409);
    
    newUser("bad request", undefined, 503)

    afterAll(async() => {
        const sql = `
            DELETE from USERS
            WHERE username = (?) AND type = (?)
            `;
        await dao.run(sql, ["clerk1@ezwh.com", "clerk"])
    })
    
})

/**
 * API:
 *            GET sessions
 *  =================================================
 */

describe('get user', () => {
    beforeAll(async() => {
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

    getUser("ok",
    {username: "mj@ezwh.com", password: "testpassword"},
    {id:1, username: "mj@ezwh.com", name: "Mary"})

    getUser("wrong password", {id:1, username: "mj@ezwh.com", password: "ciaociao"}, 401);

    getUser("wrong username", {id:1, username: "customer1@ezwh.com", password: "testpassword"}, 401);

    getUser("bad request", undefined, undefined);

    afterAll(async() => {
        const sql = `
            DELETE from USERS
            WHERE username = (?) AND type = (?)
            `;
        await dao.run(sql, ["mj@ezwh.com", "supplier"])
    })
})

/**
 * API:
 *            PUT /api/users/:username
 *  =================================================
 */
describe('edit user', () => {
    beforeAll(async() => {
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
    editUser("edited ok",
    {
        "oldType" : "clerk",
        "newType" : "qualityEmployee"
    },
    "mj@ezwh.com",200)

    editUser("user not found",{
    "oldType" : "clerk",
    "newType" : "qualityEmployee"
    },
    "user2@ezwh.com",404)

    editUser("bad request", undefined,
    "mj@ezwh.com", 503)

    afterAll(async() => {
        const sql = `
            DELETE from USERS
            WHERE username = (?) AND type = (?)
            `;
        await dao.run(sql, ["mj@ezwh.com", "qualityEmployee"])
    })
})

/**
 * API:
 *            DELETE /users/:username/:type
 *  =================================================
 */
describe('delete user', () => {
    beforeAll(async() => {
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

    deleteUser("bad request", undefined, 503)
    deleteUser("deleted ok", {type: "supplier", username : "mj@ezwh.com"}, 204)
})

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

function newUser(name, usr, expected) {
    test(name, async() => {
        let res = await user.newUser(usr);
        expect(res).toEqual(expected);
    })
}

function getSuppliers(name, expected){
    test(name, async() => {
        let res = await user.getStoredUsers();
        expect(res).toEqual(expected);
    })
}

function getUser(name, req, expected){
    test(name, async () => {
        let res = await user.getUser(req);
        expect(res).toEqual(expected)
    })
}

function editUser(name, req, username, expected) {
    test(name, async ()=> {
        let res = await user.editUser(req, username);
        expect(res).toEqual(expected);
    })
}

function deleteUser(name, req, expected) {
    test(name, async ()=> {
        let res = await user.deleteUser(req);
        expect(res).toEqual(expected);
    })
}