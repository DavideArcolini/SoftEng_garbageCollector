"use strict";
const dao = require("../Database/mockDAO");
const user = require("../../../db/userDAO");

user.setDAO(dao)
// THROW ERRORS DUE TO DB

let to_test = {
  username: "ciccio1@ezwh.com",
  name: "ciccio", 
  surname: "pasticcio",
  password: "testpassword",
  type: "clerk"
}

describe("create user", () =>{
    beforeAll(async () => {
        dao.run.mockReset();
        dao.run.mockImplementationOnce(() =>{
          return new Promise((resolve, reject) => {resolve(undefined)})
        })
        .mockImplementationOnce(async () => {
          return new Promise((resolve, reject) => {reject({message: "Error"})})
        });
      });

      testNewUser("user ok", to_test, undefined)
      testNewUser("throw error", to_test, Error)
})

describe("get user", () => {
  beforeAll(() => {
    dao.get.mockReset();
    dao.get.mockImplementationOnce(() => {
      return new Promise((res, rej) => {res({id:1, username: to_test.username, name: to_test.name})})
    })
    .mockImplementationOnce(() => {
      return new Promise((res, rej) => {res({id:1, username: to_test.username, name: to_test.name})})
    })
    .mockImplementation(() => {
      return new Promise((res, rej) => {rej({message: "Error"})})
    })
  })

  testGetUser("get user by: username", {username: to_test.username}, {id:1, username: to_test.username, name: to_test.name})
  testGetUser("get user by: username, type", {username: to_test.username, type: to_test.type}, {id:1, username: to_test.username, name: to_test.name})
  testGetUser("throw error", {username: to_test.username}, Error )
  testGetUser("throw error", {username: to_test.username, type: to_test.type}, Error )
})

describe("get users", () => {
  beforeAll(() => {
    dao.all.mockReset();
    dao.all.mockImplementationOnce(() => {
      return new Promise((res, rej) => {res([
        {
          id:1, 
          username: to_test.username,
          name: to_test.name,
          surname: to_test.surname,
          password: to_test.password,
          type: to_test.type
        }])})
    })
    .mockImplementationOnce(() => {
      return new Promise((res, rej) => {res([
        {
          id:1, 
          username: to_test.username,
          name: to_test.name,
          surname: to_test.surname,
          password: to_test.password,
          type: "supplier"
        }])})
    })
    .mockImplementationOnce(() => {
      return new Promise((res, rej) => {rej({message: "Error"})})
    })
  })

  testGetUsers("get: users", [
    {
      id: 1, 
      email: "ciccio1@clerk.ezwh.com",
      name: to_test.name,
      surname: to_test.surname,
      type: "clerk"
    }]);
  testGetUsers("get: suppliers", [
    {
      id: 1,
      name: to_test.name,
      surname: to_test.surname,
      email: "ciccio1@supplier.ezwh.com",
      type: "supplier"
    }], true);
    testGetUsers("error", Error)

})

describe("modify permissions", () => {
  beforeAll(() => {
    dao.run.mockReset();
    dao.run.mockImplementationOnce(() => {
      return new Promise((res, rej) => {res()})
    })
    .mockImplementationOnce(() => {
      return new Promise((res, rej) => {rej({message: "Error"})})
    })
  })

  testModifyPermissions("modified ok", {
    username: to_test.username,
    oldType: to_test.type,
    newType: "supplier"
  })
  testModifyPermissions("error", {
    username: to_test.username,
    oldType: to_test.type,
    newType: "supplier"
  }, Error)

})

describe("remove user", () => {
  beforeAll(() => {
    dao.run.mockReset();
    dao.run.mockImplementationOnce(() => {
      return new Promise((res, rej) => {res()})})
    .mockImplementationOnce(() =>{
        return new Promise((res, rej) => {rej({message: "Error"})})
    })
  })

  testRemoveUser("remove ok", {
    username: to_test.username,
    type: to_test.type
  })

  testRemoveUser("error", {
    username: to_test.username,
    type: to_test.type
  }, Error)
})

function testNewUser(name, req, expected) {
  test(name, async() => {
    try {
      let res = await user.createUser(req.username, req.name, req.surname, req.password, req.type);
      expect(res).toEqual(expected)
    } catch (error) {
      expect(error).toBeInstanceOf(expected);
    }
  })
}

function testGetUser(name, req, expected) {
  test(name, async() => {
    try {
      let res = '';
      if (req.type != undefined) res = await user.getUser(req.username, req.type)
      else res = await user.getUser(req.username)

      expect(res).toEqual(expected)
    } catch (error) {
      expect(error).toBeInstanceOf(expected)
    }
  })
}

function testGetUsers(name, expected, supplier=undefined) {
  test(name, async() => {
    try{
      let res = '';

      if(supplier)
        res = await user.getUsers(supplier)
      else
        res = await user.getUsers()
      expect(res).toEqual(expected)
    } catch(error) {
      expect(error).toBeInstanceOf(expected)
    }
  })
}

function testModifyPermissions(name, req, expected=undefined) {
  test(name, async() => {
    try {
      await user.modifyPermissions(req.username, req.oldType, req.newType)
    } catch (error) {
      expect(error).toBeInstanceOf(expected)
    }
  })
}

function testRemoveUser(name, req, expected) {
  test(name, async() => {
    try {
      await user.removeUser(req.username, req.type)
    } catch (error) {
      expect(error).toBeInstanceOf(expected)
    }
  })
}