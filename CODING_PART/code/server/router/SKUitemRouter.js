"use strict";

/* IMPORT MODULES */
const express               = require("express");
const SKUItemController     = require('../controller/SKUitemController');
const DAO                   = require("../db/DAO");
const { validationHandler } = require("../validator/validationHandler");
const { param }             = require('express-validator');
const { header }            = require('express-validator');
const { body }              = require('express-validator');

/* INITIALIZATION */
const router                = express.Router();
const dao                   = new DAO();
const SKUitemController     = new SKUItemController(dao);

/**
 * API:
 *          GET /api/skuitems
 * =================================================
 */
router.get(
    "/skuitems", 
    [
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    SKUitemController.getSKUitems);

/**
 * API:
 *          GET /api/skuitems/sku/:id
 * =================================================
 */
router.get(
    "/skuitems/sku/:id", 
    [
        param('id').isNumeric(),                                                /* [FROM API.md]: id is a numeric value                                                 */
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    SKUitemController.getSKUitemsBySKUId);

/**
 * API:
 *          GET /api/skuitems/:rfid
 * =================================================
 */
router.get(
    "/skuitems/:rfid", 
    [
        param('rfid').isLength({min: 32, max: 32}).isNumeric(),                 /* [FROM API.md]: rfid is a 32 digits string                                            */
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ], 
    validationHandler,
    SKUitemController.getSKUitemsByRFID);

/**
 * API:
 *          POST /api/skuitem
 * =================================================
 */
router.post(
    "/skuitem", 
    [
        header('Content-Type').equals('application/json'),                      /* [FROM API.md]: Request header has a line: Content-Type: application/json.                            */
        body().custom((value) => {
            if (value.RFID === undefined || value.SKUid === undefined) {
                throw new Error('Missing parameters');
            }
            return true;
        }),
        body('RFID').isLength({min: 32, max: 32}).isNumeric(),                  /* [FROM API.md]: rfid is a 32 digits string                                                            */
        body('SKUid').isNumeric(),                                              /* [FROM API.md]: skuid is a numeric value                                                              */
        body().custom((value) => {                                              /* [FROM API.md]: DateOfStock can be null, in the format "YYYY/MM/DD" or in format "YYYY/MM/DD HH:MM"   */
            if (value.DateOfStock !== undefined) {
                if (/^\d{4}\/\d{2}\/\d{2}$/.test(data.newDateOfStock) !== true && /^\d{4}\/\d{2}\/\d{2} \d{2}\:\d{2}$/.test(data.newDateOfStock) !== true) {
                    throw new Error('Invalid DateOfStock format');
                }
            }
            return true;
        })
    ], 
    validationHandler,
    SKUitemController.newSKUitem);

/**
 * API:
 *          PUT /api/skuitems/:rfid
 * =================================================
 */
router.put(
    "/skuitems/:rfid", 
    [
        param('rfid').isLength({min: 32, max: 32}).isNumeric(),                 /* [FROM API.md]: rfid is a 32 digits string                                                            */
        header('Content-Type').equals('application/json'),                      /* [FROM API.md]: Request header has a line: Content-Type: application/json.                            */
        body().custom((value) => {                                              /* [FROM API.md]: all parameters (except DateOfStock) must be defined (non optional parameters)         */
            if (value.newRFID === undefined || value.newAvailable === undefined) {
                throw new Error('Missing parameters');
            }
            return true;
        }),
        body('newRFID').isLength({min: 32, max: 32}).isNumeric(),               /* [FROM API.md]: rfid is a 32 digits string                                                            */
        body('newAvailable').isNumeric().isInt({gt: -1}),                       /* [FROM API.md]: available is a numeric value reasonably greater than or euqal to zero                 */
        body().custom((value) => {                                              /* [FROM API.md]: DateOfStock can be null, in the format "YYYY/MM/DD" or in format "YYYY/MM/DD HH:MM"   */
            if (value.newDateOfStock !== undefined) {
                if (/^\d{4}\/\d{2}\/\d{2}$/.test(data.newDateOfStock) !== true && /^\d{4}\/\d{2}\/\d{2} \d{2}\:\d{2}$/.test(data.newDateOfStock) !== true) {
                    throw new Error('Invalid DateOfStock format');
                }
            }
            return true;
        })

    ],
    validationHandler,
    SKUitemController.editSKUitem);

/**
 * API:
 *          DELETE /api/skuitems/:rfid
 * =================================================
 */
router.delete(
    "/skuitems/:rfid", 
    [
        param('rfid').isLength({min: 32, max: 32}).isNumeric(),                 /* [FROM API.md]: rfid is a 32 digits string                                            */
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    SKUitemController.deleteSKUitem);


module.exports = router;