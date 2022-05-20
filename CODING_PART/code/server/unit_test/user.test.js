const dao = require("./mockDB/mock_user_dao");
const UserController = require("../controller/UserController");
const user = new UserController(dao);

const chai = require('chai');
const { expect } = require("chai");

describe('get user', () => {
    beforeEach(() => {
        dao.getUser.mockReset();
        dao.getUser.mockReturnValue({
            id:1,
            username: "manager1@ezwh.com",
            name: "Dave",
            surname: "Grohl",
            type: "manager",
            password: "testpassword"
        })
    })
})

test('get user', async () => {
    const username = "manager1@ezwh.com";

    let res = await user.getUser(username);

    expect(res).toEqual({
        id: 1,
        username: username,
        name: "Dave"
    })
});