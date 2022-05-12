"use strict";

/* IMPORT MODULES */
const express               = require("express");
const PositionController    = require('../controller/PositionController');
const DAO                   = require("../db/DAO");

/* INITIALIZATION */
const router                = express.Router();
const dao                   = new DAO();
const positionController    = new PositionController(dao);

/**
 * API:
 *          GET /api/positions
 */
router.get("/positions", positionController.getPositions);

/**
 * API:
 *          POST /api/position
 */
router.post("/position", positionController.newPosition);

/**
 * API:
 *          PUT /api/position/:positionID
 */
router.put("/position/:positionID", positionController.editPosition);

/**
 * API:
 *          PUT /api/position/:positionID/changeID
 */
router.put("/position/:positionID/changeID", positionController.editPositionID);

/**
 * API:
 *          DELETE /api/position/:positionID
 */
router.delete("/position/:positionID", positionController.deletePosition);


module.exports = router;