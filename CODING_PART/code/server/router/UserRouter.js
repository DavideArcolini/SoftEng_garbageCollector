"use strict";
const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const DAO = require("../db/DAO")
const dao = new DAO();
const uc = new UserController(dao);

router.post("/newUser", uc.newUser);
router.get("/users", uc.getStoredUsers);
router.put("/users/:username", uc.editUser);

/* MANAGER  */
router.get("/managerSessions", uc.getStoredUsers);
router.post("/managerSessions", uc.getUser);

/* CUSTOMER */
router.post("/customerSessions", uc.getUser)

/* SUPPLIER */
router.post("/supplierSessions", uc.getUser)

/* CLERK */
router.post("/clerkSessions", uc.getUser)

/* QUALITY EMPLOYEE */
router.post("/qualityEmployeeSessions", uc.getUser)

/* DELIVERY EMPLOYEE */
router.post("/deliveryEmployeeSessions", uc.getUser)


module.exports = router;