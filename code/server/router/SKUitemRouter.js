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

/* --------- ERROR MESSAGES --------- */
const ERROR_404 = {error: '404 Not Found'};
const ERROR_500 = {error: 'Internal Server Error'};
const ERROR_503 = {error: 'Service Unavailable'};

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
    async (request, response) => {
        try {
            const result = await SKUitemController.getSKUitems();
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return response.status(500).json(ERROR_500);
        }
    }
);

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
    async (request, response) => {
        try {
            const result = await SKUitemController.getSKUitemsBySKUId(request.params);
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return response.status(500).json(ERROR_500);
        }
    }
);

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
    async (request, response) => {
        try {
            const result = await SKUitemController.getSKUitemsByRFID(request.params);
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return response.status(500).json(ERROR_500);
        }
    }
);

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
            if (value.RFID === undefined || value.SKUId === undefined) {
                throw new Error('Missing parameters');
            }
            return true;
        }),
        body('RFID').isLength({min: 32, max: 32}).isNumeric(),                  /* [FROM API.md]: rfid is a 32 digits string                                                            */
        body('SKUId').isNumeric(),                                              /* [FROM API.md]: skuid is a numeric value                                                              */
        body().custom((value) => {                                              /* [FROM API.md]: DateOfStock can be null, in the format "YYYY/MM/DD" or in format "YYYY/MM/DD HH:MM"   */
            if (value.DateOfStock !== undefined) {
                if (/^\d{4}\/\d{2}\/\d{2}$/.test(value.DateOfStock) !== true && /^\d{4}\/\d{2}\/\d{2} \d{2}\:\d{2}$/.test(value.DateOfStock) !== true) {
                    throw new Error('Invalid DateOfStock format');
                }
            }
            return true;
        })
    ], 
    validationHandler,
    async (request, response) => {
        try {
            const result = await SKUitemController.newSKUitem(request.body);
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
    }
);

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
                if (/^\d{4}\/\d{2}\/\d{2}$/.test(value.newDateOfStock) !== true && /^\d{4}\/\d{2}\/\d{2} \d{2}\:\d{2}$/.test(value.newDateOfStock) !== true) {
                    throw new Error('Invalid DateOfStock format');
                }
            }
            return true;
        })

    ],
    validationHandler,
    async (request, response) => {
        try {
            const result = await SKUitemController.editSKUitem(request.params, request.body);
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
    }
);

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
    async (request, response) => {
        try {
            const result = await SKUitemController.deleteSKUitem(request.params);
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
    }
);


module.exports = router;