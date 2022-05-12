"use strict";

/* IMPORT MODULES */
const express           = require("express");
const SKUController     = require('../controller/SKUController');
const DAO               = require("../db/DAO");

/* INITIALIZATION */
const router            = express.Router();
const dao               = new DAO();
const skuController     = new SKUController(dao);

/**
 * API:
 *          GET /api/skus
 */
router.get("/skus", skuController.getStoredSKUs);

/**
 * API:
 *          GET /api/skus/:id
 */
router.get("/skus/:id", skuController.getStoredSKUById);

/**
 * API:
 *          POST /api/sku
 */
router.post("/sku", skuController.newSKU);

/**
 * API:
 *          PUT /api/sku/:id
 */
router.put("/sku/:id", skuController.editSKU);


/**
 * API:
 *          PUT /api/sku/:id/position
 */
router.put("/sku/:id/position", skuController.addOrEditPositionSKU);


/**
 * API:
 *          DELETE /api/skus/:id/
 */
 router.delete("/skus/:id", skuController.deleteSKU);


module.exports = router;