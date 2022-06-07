"use strict";

/* IMPORT MODULES */
const express = require('express'); 
const TDController = require('../controller/TestResultController');
const DAO = require("../db/DAO")
const { validationHandler } = require("../validator/validationHandler");
const { param }             = require('express-validator');
const { header }            = require('express-validator');
const { body }              = require('express-validator');

/* INITIALIZATION */
const dao = new DAO();
const tr = new TDController(dao);
const router = express.Router();

/* --------- ERROR MESSAGES --------- */
const ERROR_404 = {error: '404 Not Found'};
const ERROR_500 = {error: 'Internal Server Error'};
const ERROR_503 = {error: 'Service Unavailable'};

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
        try {
            const result= await  tr.getTestResults(req.params);
            return res.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return res.status(500).json(ERROR_500);
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
        try {
            const result= await  tr.getTestResultById(req.params);
            return res.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return res.status(500).json(ERROR_500);
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
        try {
            const result= await  tr.createTestResult(req.body);
            return res.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return res.status(503).json(ERROR_503);
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
        try {
            const result= await  tr.modifyTestResult(req.params,req.body);
            return res.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return res.status(503).json(ERROR_503);
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
        try {
            const result= await  tr.deleteTestResult(req.params);
            return res.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            return res.status(503).json(ERROR_503);
        }
    }
);

module.exports = router;