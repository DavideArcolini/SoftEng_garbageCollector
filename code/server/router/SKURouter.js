"use strict";

/* IMPORT MODULES */
const express               = require("express");
const SKUController         = require('../controller/SKUController');
const DAO                   = require("../db/DAO");
const { validationHandler } = require("../validator/validationHandler");
const { param }             = require('express-validator');
const { header }            = require('express-validator');
const { body }              = require('express-validator');
const SKUDAO                = require("../db/skuDAO");
const TestDescriptorsDAO    = require("../db/testDescriptorsDAO");
const PositionDAO           = require("../db/positionDAO");
const SKUitemDAO            = require("../db/skuItemDAO");

/* INITIALIZATION */
const router                = express.Router();
const dao                   = new DAO();
const skuDAO                = new SKUDAO(dao);
const testDescriptorsDAO    = new TestDescriptorsDAO(dao);
const positionDAO           = new PositionDAO(dao);
const skuItemDAO            = new SKUitemDAO(dao);
const skuController         = new SKUController(skuDAO, testDescriptorsDAO, positionDAO, skuItemDAO);

/* --------- ERROR MESSAGES --------- */
const ERROR_404 = {error: '404 Not Found'};
const ERROR_500 = {error: 'Internal Server Error'};
const ERROR_503 = {error: 'Service Unavailable'};


/**
 * API:
 *               GET /api/skus
 * =================================================
 */
router.get(
    "/skus", 
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
            const result = await skuController.getStoredSKUs();
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return response.status(500).json(ERROR_500);
        }
    }
);

/**
 * API:
 *                GET /api/skus/:id
 * =================================================
 */
router.get(
    "/skus/:id", 
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
            const result = await skuController.getStoredSKUById(request.params);
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return response.status(500).json(ERROR_500);
        }
    }
);

/**
 * API:
 *                POST /api/sku
 * =================================================
 */
router.post(
    "/sku", 
    [
        header('Content-Type').equals('application/json'),      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.description === undefined ||
                value.weight === undefined ||
                value.volume === undefined ||
                value.notes === undefined ||
                value.price === undefined ||
                value.availableQuantity === undefined) {
                    throw new Error('Missing parameters');
                }
            return true;
        }),
        body('description').isAscii(),                          /* [FROM API.md]: description is a string reasonably of ascii characters                     */
        body('weight').isFloat({gt: 0}),                        /* [FROM API.md]: weight is a float value reasonably greater than 0                          */
        body('volume').isFloat({gt: 0}),                        /* [FROM API.md]: volume is a float value reasonably greater than 0                          */
        body('notes').isString().isAscii(),                     /* [FROM API.md]: notes is a string reasonably of ascii characters                           */
        body('price').isFloat({gt: 0}),                         /* [FROM API.md]: price is a float value reasonably greater than 0                           */
        body('availableQuantity').isInt({gt: -1}),              /* [FROM API.md]: availableQuantity is a float value reasonably greater than or equal to 0   */
    ], 
    validationHandler,
    async (request, response) => {
        try {
            const result = await skuController.newSKU(request.body);
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
    }
);

/**
 * API:
 *               PUT /api/sku/:id
 * =================================================
 */
router.put(
    "/sku/:id", 
    [
        param('id').isNumeric(),                                /* [FROM API.md]: id is a numeric value                                                 */
        header('Content-Type').equals('application/json'),      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.newDescription === undefined ||
                value.newWeight === undefined ||
                value.newVolume === undefined ||
                value.newNotes === undefined ||
                value.newPrice === undefined ||
                value.newAvailableQuantity === undefined) {
                    throw new Error('Missing parameters');
                }
            return true;
        }),
        body('newDescription').isAscii(),                          /* [FROM API.md]: description is a string reasonably of ascii characters                     */
        body('newWeight').isFloat({gt: 0}),                        /* [FROM API.md]: weight is a float value reasonably greater than 0                          */
        body('newVolume').isFloat({gt: 0}),                        /* [FROM API.md]: volume is a float value reasonably greater than 0                          */
        body('newNotes').isAscii(),                                /* [FROM API.md]: notes is a string reasonably of ascii characters                           */
        body('newPrice').isFloat({gt: 0}),                         /* [FROM API.md]: price is a float value reasonably greater than 0                           */
        body('newAvailableQuantity').isInt({gt: -1}),              /* [FROM API.md]: availableQuantity is a float value reasonably greater than or equal to 0   */
    ],
    validationHandler,
    async (request, response) => {
        try {
            const result = await skuController.editSKU(request.params, request.body);
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
    }
);


/**
 * API:
 *          PUT /api/sku/:id/position
 * =================================================
 */
router.put(
    "/sku/:id/position", 
    [
        param('id').isNumeric(),                                /* [FROM API.md]: id is a numeric value                                                 */
        header('Content-Type').equals('application/json'),      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.position === undefined) {
                throw new Error('Missing parameter');
            }
            return true;
        }),
        body('position').isLength({min: 12, max: 12}).isNumeric()        /* [FROM API.md]: description is a string reasonably of ascii characters                     */
    ],
    validationHandler,
    async (request, response) => {
        try {
            const result = await skuController.addOrEditPositionSKU(request.params, request.body);
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
    }
);


/**
 * API:
 *          DELETE /api/skus/:id/
 * =================================================
 */
 router.delete(
    "/skus/:id", 
    [
        param('id').isNumeric(),                                /* [FROM API.md]: id is a numeric value                                                 */
        body().custom(value => {                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    async (request, response) => {
        try {
            const result = await skuController.deleteSKU(request.params);
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
    }
);


module.exports = router;