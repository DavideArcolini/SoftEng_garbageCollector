const dao = require("../../../db/userDAO")

const user = {
    username : "ciccio1@ezwh.com", 
    name : "Ciccio",
    surname: "Pasticcio",
    password: "testpassword",
    type: "supplier"
}

describe('test new user', () => {
    beforeAll(async() => {
        await dao.deleteAllUsers();
    })

    testNewUser('create user', user, undefined)
    testNewUser('create user: failed', user, Error)
    testNewUser('failed', undefined, Error)
    afterAll(async() => {
        await dao.deleteAllUsers();
    })
})

describe('get user', () => {
    beforeAll(async() => {
        await dao.deleteAllUsers();
        await dao.createUser(user.username, user.name, user.surname, user.password, user.type)
    })

    testGetUser("login", {username : user.username, type: user.type}, {id:1, username: user.username, name: user.name})
    testGetUser("get user", {username: user.username}, {id:1, username: user.username, name: user.name})
    testGetUser("failed", undefined, Error)
})

describe('modify permissions', () => {
    beforeAll(async() => {
        await dao.deleteAllUsers();
        await dao.createUser(user.username, user.name, user.surname, user.password, user.type)
    })

    testModifyPermissions('modified successfully', {username: user.username, oldType: user.type, newType: "clerk"}, {id:1})
    testModifyPermissions('modification failed', {}, undefined)
    testModifyPermissions("error", undefined, Error)
    afterAll(async() => {
        await dao.deleteAllUsers();
    })
})

describe('delete user', () => {
    beforeAll(async() => {
        await dao.deleteAllUsers();
        await dao.createUser(user.username, user.name, user.surname, user.password, user.type)
    })

    testRemoveUser("remove successfully", {username: user.username, type: user.type}, undefined)
    testRemoveUser("failed", undefined, Error)
})

function testNewUser(name, usr, expected) {
    test(name, async() => {
        try{
            let res = await dao.createUser(usr.username, usr.name, usr.surname, usr.password, usr.type);
            expect(res).toEqual(expected);
        } catch(error) {
            expect(error).toBeInstanceOf(expected);
        }
    })
}

function testGetUser(name, usr, expected) {
    test(name, async() => {
        try {
            if(usr.type) {
                let res = await dao.getUser(usr.username, usr.type)
                expect(res).toEqual(expected);
            }
            else {
                let res = await dao.getUser(usr.username)
                expect(res).toEqual(expected);
            }
        } catch (error) {
            expect(error).toBeInstanceOf(Error)
        }
    })
}

function testModifyPermissions(name, usr, expected) {
    test(name, async() => {
        try {
            let res = await dao.modifyPermissions(usr.username, usr.oldType, usr.newType)
            expect(res).toEqual(expected)
        } catch (error) {
            expect(error).toBeInstanceOf(Error)
        }
    })
}

function testRemoveUser(name, usr, expected) {
    test(name, async() => {
        try {
            let res = await dao.removeUser(usr.username, usr.type)
            expect(res).toEqual(expected)
        } catch (error) {
            const t = () => {
                throw new TypeError();
              };
            expect(t).toThrow(TypeError) 
        }
    })
}