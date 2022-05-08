"use strict";
const express = require('express');
const router = express.Router();
const IOController = require('../controller/InternalOrderController');
const DAOIO = require("../db/IO")
const daoio = new DAOIO();
const ioc = new IOController(daoio);

router.post("/internalOrders", ioc.createInternalOrder);
router.get("/internalOrders/:id", ioc.getInternalOrderById);
router.get("/internalOrders", ioc.getInternalOrders);
router.put("/internalOrders/:id", ioc.modifyInternalOrderState);
router.get("/internalOrdersIssued", ioc.getInternalOrdersIssued);
router.get("/internalOrdersAccepted", ioc.getInternalOrdersAccepted);
router.delete("/internalOrders/:id",ioc.deleteInternalOrder);
module.exports = router;