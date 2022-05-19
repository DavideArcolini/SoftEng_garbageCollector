"use strict";
const express = require('express');
const router = express.Router();
const RTOController = require('../controller/ReturnOrderController');
const DAO = require("../db/DAO")
const dao = new DAO();
const rtoc = new RTOController(dao);

const { validationHandler } = require("../validator/validationHandler");
const { param }             = require('express-validator');
const { header }            = require('express-validator');
const { body }              = require('express-validator');

/**
 * API:
 *                GET /api/returnOrders
 * =================================================
 */
router.get(
    "/returnOrders",
    [
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    rtoc.getReturnOrders
);


/**
 * API:
 *              GET /api/returnOrders/:id
 * =================================================
 */
router.get(
    "/returnOrders/:id",
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
    rtoc.getReturnOrderById
);

/**
 * API:
 *              POST /api/returnOrder
 * =================================================
 */
router.post(
    "/returnOrder", 
    [
        header('Content-Type').equals('application/json'),                              /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                                        /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.returnDate === undefined ||
                value.products === undefined ||
                value.restockOrderId === undefined) {
                    throw new Error('Missing parameters');
                }
            return true;
        }),
        body('returnDate').custom((value) => {                                           /* [FROM API.md]: returnDate is in the format "YYYY/MM/DD HH:MM"     */
            if (/^\d{4}\/\d{2}\/\d{2} \d{2}\:\d{2}$/.test(value) !== true) {
                throw new Error('Invalid DateOfStock format');
            }
            return true;
        }),
        body('products').custom((value) => {                                            /* [FROM API.md]: products is an array of objects to be validated   */
            console.log(value);
            /* TODO: IMPLEMENT HERE VALIDATION OF PRODUCTS */
        }),
        body('restockOrderId').isNumeric()                                               /* [FROM API.md]: restockOrderId is a numeric value                     */
    ],
    validationHandler,
    rtoc.createReturnOrder
);

/**
 * API:
 *              DELETE /api/returnOrder/:id
 * =================================================
 */
router.delete(
    "/returnOrder/:id",
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
    rtoc.deleteReturnOrder
);


module.exports = router;