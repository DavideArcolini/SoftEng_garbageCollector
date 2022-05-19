"use strict";
const express = require('express'); //inseriamo express
const router = express.Router(); //funzione di express come app
const TDController = require('../controller/ItemController');//richiama il modulo e lo inserisce in variabile
const DAO = require("../db/DAO")//richiama database
const dao = new DAO();//nuovo database
const i = new TDController(dao);//chiama il controller


const { validationHandler } = require("../validator/validationHandler");
const { param }             = require('express-validator');
const { header }            = require('express-validator');
const { body }              = require('express-validator');

/**
 * API:
 *                GET /api/items
 * =================================================
 */
router.get(
    "/items",
    [
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    i.getItems);

/**
 * API:
 *                GET /api/items/:id
 * =================================================
 */
router.get(
    "/items/:id",
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
    i.getItemById
);

/**
 * API:
 *                POST /api/item
 * =================================================
 */
router.post(
    "/item", 
    [
        header('Content-Type').equals('application/json'),                      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.id === undefined ||
                value.description === undefined ||
                value.price === undefined ||
                value.SKUId === undefined ||
                value.supplierId === undefined) {
                    throw new Error('Missing parameters');
                }
            return true;
        }),
        body('id').isNumeric(),                                                 /* [FROM API.md]: id is a numeric value                                                 */
        body('description').isAscii(),                                          /* [FROM API.md]: description is a string reasonably of ASCII chars                     */
        body('price').isFloat({gt: 0}),                                         /* [FROM API.md]: price is a float value reasonably greater than zero                   */
        body('SKUId').isNumeric(),                                              /* [FROM API.md]: SKUid is a numeric value                                              */
        body('supplierId').isNumeric()                                          /* [FROM API.md]: supplierID is a numeric value                                         */
    ],
    validationHandler,
    i.createItem
);

/**
 * API:
 *                PUT /api/item/:id
 * =================================================
 */
router.put(
    "/item/:id",
    [
        param('id').isNumeric(),                                                /* [FROM API.md]: id is a numeric value                                                 */
        header('Content-Type').equals('application/json'),                      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.newDescription === undefined ||
                value.newPrice === undefined) {
                    throw new Error('Missing parameters');
                }
            return true;
        }),
        body('newDescription').isAscii(),                                          /* [FROM API.md]: description is a string reasonably of ASCII chars                     */
        body('newPrice').isFloat({gt: 0})                                          /* [FROM API.md]: price is a float value reasonably greater than zero                   */
    ],
    validationHandler,
    i.modifyItem
);

/**
 * API:
 *                DELETE /api/items/:id
 * =================================================
 */
router.delete(
    "/items/:id",
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
    i.deleteItem
);

module.exports = router;