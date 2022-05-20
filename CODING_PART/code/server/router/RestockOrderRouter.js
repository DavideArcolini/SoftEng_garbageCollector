"use strict";
const express = require('express');
const router = express.Router();
const ROController = require('../controller/RestockOrderController');
const DAO = require("../db/DAO")
const dao = new DAO();
const roc = new ROController(dao);

const { validationHandler } = require("../validator/validationHandler");
const { param }             = require('express-validator');
const { header }            = require('express-validator');
const { body }              = require('express-validator');
const { ValidationHalt } = require('express-validator/src/base');

/**
 * API:
 *              GET /api/restockOrders
 * =================================================
 */
router.get(
    "/restockOrders",
    [
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    roc.getRestockOrders
);

/**
 * API:
 *         GET /api/restockOrdersIssued
 * =================================================
 */
 router.get(
    "/restockOrdersIssued",
    [
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    roc.getRestockOrdersIssued
);

/**
 * API:
 *         GET /api/restockOrders/:id
 * =================================================
 */
 router.get(
    "/restockOrders/:id",
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
    roc.getRestockOrderById
);

/**
 * API:
 *          GET /api/restockOrders/:id/returnItems
 * ==========================================================
 */
router.get(
    "/restockOrders/:id/returnItems",
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
    roc.getReturnItems
);


/**
 * API:
 *          POST /api/restockOrder
 * ==========================================================
 */
router.post(
    "/restockOrder", 
    [
        header('Content-Type').equals('application/json'),                              /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                                        /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.issueDate === undefined ||
                value.products === undefined ||
                value.supplierId === undefined) {
                    throw new Error('Missing parameters');
                }
            return true;
        }),
        body('issueDate').custom((value) => {                                           /* [FROM API.md]: issueDate is in the format "YYYY/MM/DD HH:MM"     */
            if (/^\d{4}\/\d{2}\/\d{2} \d{2}\:\d{2}$/.test(value) !== true) {
                throw new Error('Invalid DateOfStock format');
            }
            return true;
        }),
        body('products').custom((value) => {                                            /* [FROM API.md]: products is an array of objects to be validated   */
            value.forEach((product) => {
                if (isNaN(product.SKUId)) {
                    throw new Error('Invalid product value');
                } else if (/^[\u0000-\u007f]*$/.test(product.description) === false || product.description instanceof String) {
                    throw new Error('Invalid product value');
                } else if (isNaN(product.price) || product.price < 0) {
                    throw new Error('Invalid product value');
                } else if (isNaN(product.qty) || product.qty < 0) {
                    throw new Error('Invalid product value');
                }
            });
            return true;
        }),
        body('supplierId').isNumeric()                                                  /* [FROM API.md]: supplierId is a numeric value                     */
    ],
    validationHandler,
    roc.createRestockOrder
);

/**
 * API:
 *          PUT /api/restockOrder/:id
 * ==========================================================
 */
router.put(
    "/restockOrder/:id", 
    [
        param('id').isNumeric(),                                                        /* [FROM API.md]: id is a numeric value                                                 */
        header('Content-Type').equals('application/json'),                              /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                                        /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.newState === undefined) {
                throw new Error('Missing parameters');
            }
            return true;
        }),
        body().custom(value => {                                                        /* [FROM API.md]: newState should be a valid value                                      */
            const STATES = ['ISSUED', 'DELIVERY', 'DELIVERED', 'TESTED', 'COMPLETEDRETURN', 'COMPLETED'];
            for (let s of STATES) {
                if (s === value.newState) {
                    return true;
                }
            }
            throw new Error('Invalid newState value');
        }),
        body('newState').isAscii().isUppercase()                                        /* [FROM API.md]: newState is an ASCII string in uppercase                              */
    ],
    validationHandler,
    roc.modifyRestockOrderState
);

/**
 * API:
 *          PUT /api/restockOrder/:id/skuItems
 * ==========================================================
 */
router.put(
    "/restockOrder/:id/skuItems", 
    [
        param('id').isNumeric(),                                                        /* [FROM API.md]: id is a numeric value                                                 */
        header('Content-Type').equals('application/json'),                              /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                                        /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.skuItems === undefined) {
                throw new Error('Missing parameters');
            }
            return true;
        }),
        body().custom(value => {                                                        /* [FROM API.md]: skuItems is an array of objects to be validated                       */
            value.skuItems.forEach((skuItem) => {
                console.log(skuItem);
                if (isNaN(skuItem.SKUId)) {
                    throw new Error('Invalid skuItem value');
                } else if (skuItem.rfid.length != 32 || /^[0-9]+$/.test(skuItem.rfid) === false) {
                    throw new Error('Invalid skuItem value');
                }
            });
            return true;
        })
    ],
    validationHandler,
    roc.setSkuItems
);

/**
 * API:
 *          PUT /api/restockOrder/:id/transportNote
 * ==========================================================
 */
router.put(
    "/restockOrder/:id/transportNote",
    [
        param('id').isNumeric(),                                                        /* [FROM API.md]: id is a numeric value                                                 */
        header('Content-Type').equals('application/json'),                              /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                                        /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.transportNote === undefined) {
                throw new Error('Missing parameters');
            }
            return true;
        }),
        body().custom(value => {                                                        /* [FROM API.md]: transportNote is a object to be validated                             */
            if (/^\d{4}\/\d{2}\/\d{2}$/.test(value.transportNote.deliveryDate) === false) {
                throw new Error("Invalid date format");
            }
            return true;
        })
    ], 
    validationHandler,
    roc.addTransportNote
);

/**
 * API:
 *          DELETE /api/restockOrder/:id
 * ==========================================================
 */
router.delete(
    "/restockOrder/:id",
    [
        param('id').isNumeric(),                                                        /* [FROM API.md]: id is a numeric value                                                 */
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    roc.deleteRestockOrder
);


module.exports = router;