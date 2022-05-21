const dao = require("./mockDB/mock_dao");
const UserController = require("../controller/UserController");
const user = new UserController(dao);
const bcrypt        = require('bcrypt');


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
        console.log(res)
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
        console.log(res)
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
        console.log(res);
        expect(res).toEqual({
            id: 1,
            username: "manager1@ezwh.com",
            name: "Dave"
        })
    })
})