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
    async(req,res)=>{
        try{
        const result = await rtoc.getReturnOrders();
        return res.status(200).json(result);
        }catch(error){
            return res.status(500).end();
        }
    } 
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
    async(req,res)=>{
        try{
        const result = await rtoc.getReturnOrderById(req.params.id);
        
        return res.status(result.code).json(result.message);
        }catch(error){
            return res.status(500).end();
        }
    } 
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
            value.forEach((product) => {
                if (isNaN(product.SKUId)) {
                    throw new Error('Invalid product value');
                } else if (/^[\u0000-\u007f]*$/.test(product.description) === false || product.description instanceof String) {
                    throw new Error('Invalid product value');
                } else if (isNaN(product.price) || product.price < 0) {
                    throw new Error('Invalid product value');
                } else if (product.RFID.length != 32 || /^[0-9]+$/.test(product.RFID) === false) {
                    throw new Error('Invalid skuItem value');
                }
            });
            return true;
        }),
        body('restockOrderId').isNumeric()                                               /* [FROM API.md]: restockOrderId is a numeric value                     */
    ],
    validationHandler,
    async(req,res)=>{
        try{
        let result = await rtoc.createReturnOrder(req.body.returnDate,req.body.restockOrderId,req.body.products);
        return res.status(result.code).end();
        }catch(error){
            return res.status(503).end();
        }
    }
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
    async(req,res)=>{
        try{
        await rtoc.deleteReturnOrder(req.params.id);
        return res.status(204).end();
        }catch(error){
            return res.status(503).end();
        }
    } 
);


module.exports = router;