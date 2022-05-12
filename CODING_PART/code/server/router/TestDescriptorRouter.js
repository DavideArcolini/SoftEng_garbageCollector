"use strict";
const express = require('express'); //inseriamo express
const router = express.Router(); //funzione di express come app
const TDController = require('../controller/TestDescriptorController');//richiama il modulo e lo inserisce in variabile
const DAO = require("../db/DAO")//richiama database
const dao = new DAO();//nuovo database
const td = new TDController(dao);//chiama il controller

router.get("/testDescriptors",td.getTestDescriptors);
router.get("/testDescriptors/:id",td.getTestDescriptorById);
router.post("/testDescriptor", td.createTestDescriptor);
router.put("/testDescriptor/:id", td.modifyTestDescriptor);
router.delete("/testDescriptor/:id",td.deleteTestDescriptor);

module.exports = router;