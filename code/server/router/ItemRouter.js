"use strict";

/* IMPORT MODULES */
const IController = require('../controller/ItemController');
const DAO = require("../db/DAO");
const express = require('express'); 
const { validationHandler } = require("../validator/validationHandler");
const { param }             = require('express-validator');
const { header }            = require('express-validator');
const { body }              = require('express-validator');

/* INITIALIZATION */

const dao = new DAO();
const i = new IController(dao);
const router = express.Router(); 

/* --------- ERROR MESSAGES --------- */
const ERROR_404 = {error: '404 Not Found'};
const ERROR_500 = {error: 'Internal Server Error'};
const ERROR_503 = {error: 'Service Unavailable'};



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
    async (req,res)=>{
        try {
            const result= await  i.getItems();
            return res.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return res.status(500).json(ERROR_500);
        }
    }
);

/**
 * API:
 *                GET /api/items/:id
 * =================================================
 */
router.get(
    "/items/:id/:supplierId",
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
    async (req,res)=>{
        try {
            const result= await  i.getItemById(req.params);
            return res.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return res.status(500).json(ERROR_500);
        }
    }
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
    async (req,res)=>{
        try {
            const result= await i.createItem(req.body);
            return res.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return res.status(503).json(ERROR_503);
        }
    }
);

/**
 * API:
 *                PUT /api/item/:id
 * =================================================
 */
router.put(
    "/item/:id/:supplierId",
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
    async (req,res)=>{
        try {
            const result = await  i.modifyItem(req.body, req.params);
            return res.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return res.status(503).json(ERROR_503);
        }
    }
);

/**
 * API:
 *                DELETE /api/items/:id
 * =================================================
 */
router.delete(
    "/items/:id/:supplierId",
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
    async (req,res)=>{
        try {
            const result= await  i.deleteItem(req.params);
            return res.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return res.status(503).json(ERROR_503);
        }
    }   
);

module.exports = router;