"use strict";
const express = require('express'); //inseriamo express
const router = express.Router(); //funzione di express come app
const TDController = require('../controller/TestDescriptorController');//richiama il modulo e lo inserisce in variabile
const DAO = require("../db/DAO")//richiama database
const dao = new DAO();//nuovo database
const td = new TDController(dao);//chiama il controller

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
    td.getTestDescriptors
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
    td.getTestDescriptorById
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
    td.createTestDescriptor
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
    td.modifyTestDescriptor
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
    td.deleteTestDescriptor
);

module.exports = router;