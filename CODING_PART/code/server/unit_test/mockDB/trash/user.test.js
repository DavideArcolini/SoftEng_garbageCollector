const dao = require("./mockDB/mock_user_dao");
const UserService = require("../../../service/users");
const user = new UserService(dao);
const bcrypt        = require('bcrypt');

describe('get users', () => {
    beforeEach( () => {
        dao.getAllUsers.mockReset();
        dao.getAllUsers.mockReturnValue([{
            id: 2,
            name: "Pippo",
            surname: "Franco",
            email: "user1@customer.ezwh.com",
            type: "customer"
        }])
    })
    
    test('get users', async() => {
        let res = await user.getUsers();

        expect(res.body).toEqual([{
            id: 2,
            name: "Pippo",
            surname: "Franco",
            email: "user1@customer.ezwh.com",
            type: "customer"
        }])
    })
})
/*
let genPSW = async (psw) =>{
    let saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash("testpassword", salt);
}
describe('get user', () => {
    beforeEach(async () => {
        dao.getUser.mockReset();
        let psw = await genPSW("testpassword")
        dao.getUser.mockReturnValue({
            id:1,
            username: "manager1@ezwh.com",
            name: "Dave",
            surname: "Grohl",
            type: "manager",
            password: psw
        })
    })
    test('get user', async () => {
        const username = "manager1@ezwh.com";
        console.log("ciao")
        ciao = { username: 'manager1@ezwh.com', password: 'testpassword' }
        let res = await user.getUser(ciao);
    
        console.log("ciao")
        expect(res).toEqual({
            id: 1,
            username: username,
            name: "Dave"
        })
    })
})*/