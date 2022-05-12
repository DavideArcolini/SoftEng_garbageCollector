"use strict";

/* IMPORT MODULES */
const express               = require("express");
const SKUItemController     = require('../controller/SKUitemController');
const DAO                   = require("../db/DAO");

/* INITIALIZATION */
const router                = express.Router();
const dao                   = new DAO();
const SKUitemController     = new SKUItemController(dao);

/**
 * API:
 *          GET /api/skuitems
 */
router.get("/skuitems", SKUitemController.getSKUitems);

/**
 * API:
 *          GET /api/skuitems/sku/:id
 */
router.get("/skuitems/sku/:id", SKUitemController.getSKUitemsBySKUId);

/**
 * API:
 *          GET /api/skuitems/:rfid
 */
router.get("/skuitems/:rfid", SKUitemController.getSKUitemsByRFID);

/**
 * API:
 *          POST /api/skuitem
 */
router.post("/skuitem", SKUitemController.newSKUitem);

/**
 * API:
 *          PUT /api/skuitems/:rfid
 */
router.put("/skuitems/:rfid", SKUitemController.editSKUitem);

/**
 * API:
 *          DELETE /api/skuitems/:rfid
 */
router.delete("/skuitems/:rfid", SKUitemController.deleteSKUitem);


module.exports = router;