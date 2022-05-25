"use strict";
const express = require('express');
const router = express.Router();
const IOController = require('../controller/InternalOrderController');
const DAO = require("../db/DAO")
const dao = new DAO();
const ioc = new IOController(dao);

const { validationHandler } = require("../validator/validationHandler");
const { param }             = require('express-validator');
const { header }            = require('express-validator');
const { body }              = require('express-validator');


 /**
  * API:
  *                GET /api/internalOrders
  * =================================================
  */
router.get(
    "/internalOrders", 
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
        const result = await ioc.getInternalOrders();
        return res.status(200).json(result);
        }catch(error){
            return res.status(500).end();
        }
    } 
);

/**
 * API:
 *                GET /api/internalOrdersIssued
 * =================================================
 */
router.get(
    "/internalOrdersIssued", 
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
        const result = await ioc.getInternalOrdersIssued();
        return res.status(200).json(result);
        }catch(error){
            return res.status(500).end();
        }
    } 
);

 /**
  * API:
  *                GET /api/internalOrdersAccepted
  * =================================================
  */
router.get(
    "/internalOrdersAccepted", 
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
        const result = await ioc.getInternalOrdersAccepted();
        return res.status(200).json(result);
        }catch(error){
            return res.status(500).end();
        }
    } 
);

/**
 * API:
 *            GET /api/internalOrders/:id
 * =================================================
 */
router.get(
    "/internalOrders/:id", 
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
        const io = await ioc.getInternalOrderById(req.params.id);
        if(io.message){
            return res.status(404).end();
        }
        return res.status(200).json(io);
        }catch(error){
            return res.status(503).end();
        }
    } 
);



/**
 * API:
 *             POST /api/internalOrders
 * =================================================
 */
router.post(
    "/internalOrders", 
    [
        header('Content-Type').equals('application/json'),                              /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                                        /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.issueDate === undefined ||
                value.products === undefined ||
                value.customerId === undefined) {
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
            console.log(value);
            value.forEach((product) => {
                if (isNaN(product.SKUId)) {
                    throw new Error('Invalid product value');
                } else if (/^[\u0000-\u007f]*$/.test(product.description) === false  || product.description instanceof String) {
                    throw new Error('Invalid product value');
                } else if (isNaN(product.price) || product.price < 0) {
                    throw new Error('Invalid product value');
                } else if (isNaN(product.qty) || product.qty < 0) {
                    throw new Error('Invalid product value');
                }
            });
            return true;
        }),
        body('customerId').isNumeric()                                                  /* [FROM API.md]: customerID is a numeric value                     */
    ],
    validationHandler,
    async(req,res)=>{
        try{
        await ioc.createInternalOrder(req.body.issueDate,req.body.products,req.body.customerId,);
        return res.status(201).end();
        }catch(error){
            return res.status(503).end();
        }
    }
);

/**
 * API:
 *            PUT /api/internalOrders/:id
 * =================================================
 */
router.put(
    "/internalOrders/:id", 
    [
        param('id').isNumeric(),                                                        /* [FROM API.md]: id is a numeric value                                                 */
        header('Content-Type').equals('application/json'),                              /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {   
                                                            /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.newState === undefined) {
                throw new Error('Missing parameters');
            } else if (value.newState === "COMPLETED") {

                if (value.products === undefined) {
                    console.log("ROTTISSIMO")
                    throw new Error('Missing parameters');
                }
            }
            return true;
        }),
        body().custom(value => {
            if (value.products !== undefined) {
                value.products.forEach((product) => {
                    if (isNaN(product.SkuID)) {
                        console.log("ROTTO 1")
                        throw new Error('Invalid product value');
                    } else if (product.RFID.length != 32 || /^[0-9]+$/.test(product.RFID) === false) {
                        console.log("ROTTO 2")
                        throw new Error('Invalid product value');
                    }
                });
            }
            return true;
        })
    ],
    validationHandler,
    async(req,res)=>{
        try{
        let io = await ioc.modifyInternalOrderState(req.params.id,req.body.newState,req.body.products);

        if(io.message){
            return res.status(404).end();
        }
        return res.status(200).end();
        }catch(error){
            return res.status(503).end();
        }
    }
);

/**
 * API:
 *                DELETE /api/internalOrders/:id
 * =================================================
 */
router.delete(
    "/internalOrders/:id",
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
        await ioc.deleteInternalOrder(req.params.id);
        return res.status(204).end();
        }catch(error){
            return res.status(503).end();
        }
    } 
);

module.exports = router;