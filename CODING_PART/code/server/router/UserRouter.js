"use strict";
const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const DAO = require("../db/DAO")
const dao = new DAO();
const uc = new UserController(dao);

router.get("/newUser", uc.newUser);
router.get("/managerSessions", uc.getStoredUsers);

module.exports = router;