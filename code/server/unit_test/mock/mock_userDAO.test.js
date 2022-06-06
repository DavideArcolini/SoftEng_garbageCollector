"use strict";
const dao = require("../test_DB/mock_dao");
const user = require("../../db/userDAO");

// THROW ERRORS DUE TO DB

describe("create user: throw error", () =>{
    test('triggering error', async () => {
        dao.run.mockReset();
        dao.run.mockImplementation(async () => {
          throw new TypeError();
        });
  
        try {
          let res = await user.createUser("ciccio1@ezwh.com", "ciccio", "pasticcio", "testpassword", "clerk");
        } catch (error) {
          expect(error).toBeInstanceOf(TypeError);
        }
      });
})