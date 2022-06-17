"use strict";

/* IMPORT MODULES */
const express               = require("express");
const ROController          = require('../controller/RestockOrderController');
const RestockOrderDAO       = require('../db/RestockOrderDAO')
const TestResultDAO         = require('../db/testResultDAO');
const DAO                   = require("../db/DAO");
const { validationHandler } = require("../validator/validationHandler");
const { param }             = require('express-validator');
const { header }            = require('express-validator');
const { body }              = require('express-validator');

/* INITIALIZATION */
const router            = express.Router();
const dao               = new DAO();
const roDAO             = new RestockOrderDAO(dao);
const testResultDAO      = new TestResultDAO(dao);
const roc               = new ROController(roDAO, testResultDAO);

/* --------- ERROR MESSAGES --------- */
const ERROR_404 = {error: '404 Not Found'};
const ERROR_500 = {error: 'Internal Server Error'};
const ERROR_503 = {error: 'Service Unavailable'};

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
    async(req,res)=>{
        try{
        const ro = await roc.getRestockOrders();
        return res.status(200).json(ro);
        }catch(error){
            return res.status(500).end();
        }
    } 
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
    async(req,res)=>{
        try{
        const ro = await roc.getRestockOrdersIssued();
        return res.status(200).json(ro);
        }catch(error){
            return res.status(500).end();
        }
    } 
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
    validationHandler, async(req,res)=>{
        try{
        const ro = await roc.getRestockOrderById(req.params.id);
        return res.status(ro.code).json(ro.message);
        }catch(error){
            return res.status(503).end();
        }
    } 
    
);

/**
 * API:
 *          GET /api/restockOrders/:id/returnItems
 * ==========================================================
 */
router.get(
    "/restockOrders/:id/returnItems",
    [
        param('id').isNumeric({min:1}),                                                /* [FROM API.md]: id is a numeric value                                                 */
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    async(req,res)=>{
        try{
        let result = await roc.getReturnItems(req.params.id)
        return res.status(result.code).json(result.message);
        }catch(error){
            return res.status(500).end();
        }
    } 
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
    async(req,res)=>{
        try{
            //console.log(JSON.stringify(req.body))
        let result = await roc.createRestockOrder(req.body.issueDate,req.body.supplierId,req.body.products);
        return res.status(result.code).end();
        }catch(error){
            return res.status(503).end();
        }
    } 
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
    async(req,res)=>{
        try{
        const ro = await roc.modifyRestockOrderState(req.params.id,req.body.newState);
       return res.status(ro.code).end();
        }catch(error){
            return res.status(503).end();
        }
    } 
    
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
                } else if (skuItem.rfid.length != 32 ) {
                    throw new Error('Invalid skuItem value');
                }
            });
            return true;
        })
    ],
    validationHandler,
    async(req,res)=>{
        try{
        let result = await roc.setSkuItems(req.params.id,req.body.skuItems, req.body.ItemId);
        return res.status(result.code).end();
        }catch(error){
            return res.status(503).end();
        }
    } 
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
            if (/^\d{4}\/\d{2}\/\d{2}$/.test(value.transportNote.deliveryDate) === false && 
                /^\d{4}\/\d{2}\/\d{2} \d{2}\:\d{2}$/.test(value.transportNote.deliveryDate) === false) {
                throw new Error("Invalid date format");
            }
            return true;
        })
    ], 
    validationHandler,
    async(req,res)=>{
        try{
        let result = await roc.addTransportNote(req.params.id,req.body.transportNote);
        return res.status(result.code).end();
        }catch(error){
            return res.status(503).end();
        }
    } 
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
    async(req,res)=>{
        try{
        let result = await roc.deleteRestockOrder(req.params.id);
        return res.status(result.code).end();
        }catch(error){
            return res.status(503).end();
        }
    } 
);


module.exports = router;