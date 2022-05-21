const dao = require("./mockDB/mock_dao");
const UserController = require("../controller/UserController");
const user = new UserController(dao);
const bcrypt        = require('bcrypt');

/*
    Actual Testing
    =================================================
*/
newUser({
    username:"supplier1@ezwh.com",
    name : "Voldemort",
    surname: "You-Know-Who",
    type: "supplier",
    password :"testpassword"
}, 201);


/*
    Definitions of testing functions
    =================================================
*/
function newUser(req, expected) {
    describe('new user', () => {
        beforeEach( () => {
            dao.get.mockReset();
            dao.run.mockReset();
            dao.get.mockReturnValue(undefined)
        })
        
        test('new user', async() => {
            let res = await user.newUser(req);
            expect(res).toEqual(expected);
        })
    }) 
}
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
        expect(res).toEqual([{
            id: 2,
            name: "Pippo",
            surname: "Franco",
            email: "user1@customer.ezwh.com",
            type: "customer"
        }])
    })
})

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
        expect(res).toEqual([{
            id: 2,
            name: "Pippo",
            surname: "Franco",
            email: "user1@supplier.ezwh.com",
            type: "supplier"
        }])
    })
})

describe('login', ()=> {
    beforeEach(async () => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash("testpassword", salt);
        dao.get.mockReset();
        dao.get.mockReturnValue({
            id: 1,
            username: "manager1@ezwh.com",
            name: "Dave",
            surname: "Grohl",
            type: "manager",
            password: hash
        })
    })

    test('get user', async () => {
        let res = await user.getUser("manager1@ezwh.com", "testpassword");
        expect(res).toEqual({
            id: 1,
            username: "manager1@ezwh.com",
            name: "Dave"
        })
    })
})