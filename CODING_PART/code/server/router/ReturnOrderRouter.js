"use strict";
const express = require('express');
const router = express.Router();
const RTOController = require('../controller/ReturnOrderController');
const DAO = require("../db/DAO")
const dao = new DAO();
const rtoc = new RTOController(dao);

router.post("/returnOrder", rtoc.createReturnOrder);
router.get("/returnOrders/:id",rtoc.getReturnOrderById);
router.get("/returnOrders",rtoc.getReturnOrders);
router.delete("/returnOrder/:id",rtoc.deleteReturnOrder);


module.exports = router;