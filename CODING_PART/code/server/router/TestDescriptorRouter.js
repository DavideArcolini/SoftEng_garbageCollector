"use strict";
const express = require('express'); 
const router = express.Router(); 
const TDController = require('../controller/TestDescriptorController');
const DAO = require("../db/DAO")
const dao = new DAO();
const td = new TDController(dao);

const { validationHandler } = require("../validator/validationHandler");
const { param }             = require('express-validator');
const { header }            = require('express-validator');
const { body }              = require('express-validator');


/**
 * API:
 *              GET /api/testDescriptors
 * =================================================
 */
router.get(
    "/testDescriptors",
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
        let result= await   td.getTestDescriptors();
        if(result==500){
            return res.status(500).json();
        }else{
            return res.status(200).json(result);
        }
    }
);

/**
 * API:
 *              GET /api/testDescriptors/:id
 * =========================================================
 */
router.get(
    "/testDescriptors/:id",
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
        let result= await  td.getTestDescriptorById(req.params);
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
 *             POST /api/testDescriptor
 * =====================================================
 */
router.post(
    "/testDescriptor", 
    [
        header('Content-Type').equals('application/json'),                      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.name === undefined ||
                value.procedureDescription === undefined ||
                value.idSKU === undefined) {
                    throw new Error('Missing parameters');
                }
            return true;
        }),
        body('name').isAscii(),                                                 /* [FROM API.md]: name is reasonably an ASCII strings                   */
        body('procedureDescription').isAscii(),                                 /* [FROM API.md]: procedureDescription is reasonably an ASCII strings   */
        body('idSKU').isNumeric()                                               /* [FROM API.md]: idSKU is a numeric string                             */
    ],
    validationHandler,
    async (req,res)=>{
        let result= await   td.createTestDescriptor(req.body);
        if(result==404){
            return res.status(404).json();
        }else if(result==503){
            return res.status(503).json();
        }else{
            return res.status(201).json();
        }
    }
);

/**
 * API:
 *             PUT /api/testDescriptor/:id
 * =====================================================
 */
router.put(
    "/testDescriptor/:id", 
    [
        param('id').isNumeric(),                                                /* [FROM API.md]: is is a numeric string                                                */
        header('Content-Type').equals('application/json'),                      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.newName === undefined ||
                value.newProcedureDescription === undefined ||
                value.newIdSKU === undefined) {
                    throw new Error('Missing parameters');
                }
            return true;
        }),
        body('newName').isAscii(),                                                 /* [FROM API.md]: name is reasonably an ASCII strings                   */
        body('newProcedureDescription').isAscii(),                                 /* [FROM API.md]: procedureDescription is reasonably an ASCII strings   */
        body('newIdSKU').isNumeric()                                               /* [FROM API.md]: idSKU is a numeric string                             */
    ],
    validationHandler,
    async (req,res)=>{
        result= await     td.modifyTestDescriptor(req.body,req.params);
        if(result==200){ //PUT success, no body
            return res.status(200).json();
        }else if(result==404){
            return res.status(404).json();
        }else{
            return res.status(503).json();
        }
    }
);

/**
 * API:
 *             DELETE /api/testDescriptor/:id
 * =====================================================
 */
router.delete(
    "/testDescriptor/:id",
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
        result= await     td.deleteTestDescriptor(req.params);
        if(result==503){
            return res.status(503).json();
        }else{
            return res.status(404);
        }
    }   
);

module.exports = router;