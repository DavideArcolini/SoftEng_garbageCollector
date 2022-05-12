"use strict";
const express = require('express'); //inseriamo express
const router = express.Router(); //funzione di express come app
const TDController = require('../controller/ItemController');//richiama il modulo e lo inserisce in variabile
const DAO = require("../db/DAO")//richiama database
const dao = new DAO();//nuovo database
const i = new TDController(dao);//chiama il controller

router.get("/items",i.getItems);
router.get("/items/:id",i.getItemById);
router.post("/item", i.createItem);
router.put("/item/:id", i.modifyItem);
router.delete("/items/:id",i.deleteItem);

module.exports = router;