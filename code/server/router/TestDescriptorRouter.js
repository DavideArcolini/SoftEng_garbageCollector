"use strict";

/* IMPORT MODULES */
const express = require('express'); 
const TDController = require('../controller/TestDescriptorController');
const DAO = require("../db/DAO")
const { validationHandler } = require("../validator/validationHandler");
const { param }             = require('express-validator');
const { header }            = require('express-validator');
const { body }              = require('express-validator')


/* INITIALIZATION */
const dao = new DAO();
const td = new TDController(dao);
const router = express.Router(); 

/* --------- ERROR MESSAGES --------- */
const ERROR_404 = {error: '404 Not Found'};
const ERROR_500 = {error: 'Internal Server Error'};
const ERROR_503 = {error: 'Service Unavailable'};




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
    async (request,response)=>{
        try {
            let result = await td.getTestDescriptors();
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return response.status(500).json(ERROR_500);
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
        try {
            let result= await  td.getTestDescriptorById(req.params);
            return res.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return res.status(500).json(ERROR_500);
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
        try {
            let result= await   td.createTestDescriptor(req.body);
            return res.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return res.status(503).json(ERROR_503);
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
        try {
            const result = await td.modifyTestDescriptor(req.body,req.params);
            return res.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return res.status(503).json(ERROR_503);
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
        try {
            const result= await     td.deleteTestDescriptor(req.params);
            return res.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return res.status(503).json(ERROR_503);
        }
    }   
);

module.exports = router;