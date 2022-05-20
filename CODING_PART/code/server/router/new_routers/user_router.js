"use strict";
const express = require('express');
const { ValidationHalt } = require('express-validator/src/base');
const router = express.Router();
const UserService = require('../../service/users');
const usr_dao = require("../../models/user_dao")
const uc = new UserService(usr_dao);

const { validationHandler } = require("../../validator/validationHandler");
const { param }             = require('express-validator');
const { header }            = require('express-validator');
const { body }              = require('express-validator');

/**
 * API:
 *            GET /api/users
 *  =================================================
 */
 router.get(
    "/users", 
    [
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    uc.getUsers
);
router.post("/managerSessions", uc.login);
module.exports = router;