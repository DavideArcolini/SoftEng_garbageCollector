"use strict";
const express = require('express'); 
const router = express.Router();
const TDController = require('../controller/TestResultController');
const DAO = require("../db/DAO")
const dao = new DAO();
const tr = new TDController(dao);

const { validationHandler } = require("../validator/validationHandler");
const { param }             = require('express-validator');
const { header }            = require('express-validator');
const { body }              = require('express-validator');


/**
 * API:
 *                /api/skuitems/:rfid/testResults
 * ================================================================
 */
router.get(
    "/skuitems/:rfid/testResults",
    [
        param('rfid').isLength({min: 32, max: 32}).isNumeric(),                 /* [FROM API.md]: RFID is a 32 digits string                                            */
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    async (req,res)=>{
        const result= await  tr.getTestResults(req.params);
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
 *             GET /api/skuitems/:rfid/testResults/:id
 * ================================================================
 */
router.get(
    "/skuitems/:rfid/testResults/:id",
    [
        param('rfid').isLength({min: 32, max: 32}).isNumeric(),                 /* [FROM API.md]: RFID is a 32 digits string                                            */
        param('id').isNumeric(),                                                /* [FROM API.md]: id is a numeric string                                                */
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    async (req,res)=>{
        const result= await  tr.getTestResultById(req.params);
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
 *              POST /api/skuitems/testResult
 * ================================================================
 */
router.post(
    "/skuitems/testResult", 
    [
        header('Content-Type').equals('application/json'),                      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.rfid === undefined ||
                value.idTestDescriptor === undefined ||
                value.Date === undefined ||
                value.Result === undefined) {
                    throw new Error('Missing parameters');
                }
            return true;
        }),
        body('rfid').isLength({min: 32, max: 32}).isNumeric(),                  /* [FROM API.md]: RFID is a 32 digits string                                            */
        body('idTestDescriptor').isNumeric(),                                   /* [FROM API.md]: id is a numeric string                                                */
        body('Date').isDate({format: "YYYY/MM/DD"}),                            /* [FROM API.md]: date is a date value in the format YYYY/MM/DD                         */
        body('Result').isBoolean()                                              /* [FROM API.md]: result is a boolean value (true/false or 0/1)                         */
    ],
    validationHandler,
    async (req,res)=>{
        const result= await  tr.createTestResult(req.body);
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
 *                /api/skuitems/:rfid/testResults
 * ================================================================
 */
router.put(
    "/skuitems/:rfid/testResult/:id", 
    [
        param('rfid').isLength({min: 32, max: 32}).isNumeric(),                 /* [FROM API.md]: RFID is a 32 digits string                                            */
        param('id').isNumeric(),                                                /* [FROM API.md]: id is a numeric string                                                */
        header('Content-Type').equals('application/json'),                      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.newIdTestDescriptor === undefined ||
                value.newDate === undefined ||
                value.newResult === undefined) {
                    throw new Error('Missing parameters');
                }
            return true;
        }),
        body('newIdTestDescriptor').isNumeric(),                                   /* [FROM API.md]: id is a numeric string                                                */
        body('newDate').isDate({format: "YYYY/MM/DD"}),                            /* [FROM API.md]: date is a date value in the format YYYY/MM/DD                         */
        body('newResult').isBoolean()                                              /* [FROM API.md]: result is a boolean value (true/false or 0/1)                         */
    ],
    validationHandler,
    async (req,res)=>{
        const result= await  tr.modifyTestResult(req.params,req.body);
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
 *                /api/skuitems/:rfid/testResults
 * ================================================================
 */
router.delete(
    "/skuitems/:rfid/testResult/:id",
    [
        param('rfid').isLength({min: 32, max: 32}).isNumeric(),                 /* [FROM API.md]: RFID is a 32 digits string                                            */
        param('id').isNumeric(),                                                /* [FROM API.md]: id is a numeric string                                                */
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    async (req,res)=>{
        const result= await  tr.deleteTestResult(req.params);
        if(result==404){
            return res.status(404).json();
        }else if(result==503){
            return res.status(503).json();
        }else{
            return res.status(204).json();
        }
    }
);

module.exports = router;