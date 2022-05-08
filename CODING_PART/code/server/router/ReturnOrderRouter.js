"use strict";
const express = require('express');
const router = express.Router();
const RTOController = require('../controller/ReturnOrderController');
const DAORTO = require("../db/RTO")
const daorto = new DAORTO();
const rtoc = new RTOController(daorto);

router.post("/returnOrder", rtoc.createReturnOrder);
router.get("/returnOrders/:id",rtoc.getReturnOrderById);
router.get("/returnOrders",rtoc.getReturnOrders);
router.delete("/returnOrder/:id",rtoc.deleteReturnOrder);


module.exports = router;