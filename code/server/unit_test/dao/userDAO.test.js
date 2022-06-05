const dao = require("../../db/userDAO")

const user = {
    username : "ciccio1@ezwh.com", 
    name : "Ciccio",
    surname: "Pasticcio",
    password: "testpassword",
    type: "customer"
}

describe('test new user', () => {
    beforeAll(async() => {
        await dao.deleteAllUsers();
    })

    testNewUser('create user', user, undefined)
    testNewUser('creation failed', undefined, undefined)
})

function testNewUser(name, usr, expected) {
    test(name, async() => {
        try{
            let res = await user.createUser(usr.username, usr.name, usr.surname, usr.password, usr.type);
            expect(res).toEqual(expected);
        } catch(error) {
            expect(error).toBeInstanceOf(Error)
        }
    })
}