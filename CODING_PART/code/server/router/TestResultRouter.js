"use strict";
const express = require('express'); //inseriamo express
const router = express.Router(); //funzione di express come app
const TDController = require('../controller/TestResultController');//richiama il modulo e lo inserisce in variabile
const DAO = require("../db/DAO")//richiama database
const dao = new DAO();//nuovo database
const tr = new TDController(dao);//chiama il controller

router.get("/skuitems/:rfid/testResults",tr.getTestResults);
router.get("/skuitems/:rfid/testResults/:id",tr.getTestResultById);
router.post("/skuitems/testResult", tr.createTestResult);
router.put("/skuitems/:rfid/testResult/:id", tr.modifyTestResult);
router.delete("/skuitems/:rfid/testResult/:id",tr.deleteTestResult);

module.exports = router;