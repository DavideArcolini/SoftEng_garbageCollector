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
    async (req,res)=>{
        const result= await  i.getItems();
        if(result==500){
            return res.status(500).json();
        }else{
            return res.status(200).json(result);
        }
    }
);

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
    async (req,res)=>{
        const result= await  i.getItemById(req.params);
        if(result==404){
            return res.status(404).json();
        }else if(result==500){
            return res.status(500).json();
        }else{
            return res.status(200).json(result);
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
        const result= await i.createItem(req.body);
        if(result===404){
            return res.status(404).json();
        }else if(result===500){
            return res.status(500).json();
        }else if(result===422){
            return res.status(422).json();
        }else{
            return res.status(201).json();
        }
    }
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
    async (req,res)=>{
        const result = await  i.modifyItem(req.body, req.id);
        if(result==200){ //PUT success, no body
            return res.status(200).json();
        }else if(result==404){
            return res.status(404).json();
        }else if(result==503){
            return res.status(503).json();
        }
    }
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
    async (req,res)=>{
        const result= await  i.deleteItem(req.params);
        if(result==404){
            return res.status(404).json();
        }else if(result==503){
            return res.status(503).json();
        }else if(result==204){
            return res.status(204).json();
        }
    }   
);

module.exports = router;