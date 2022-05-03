"use strict";
const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const DAO = require("../db/DAO")
const dao = new DAO();
const uc = new UserController(dao);

router.get("/newUser", async (req, res) => {
    const sql = "INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)";
    //return this.dao.run(sql)

    if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: "Empty Body request"});
      }
    data = req.body
    await this.dao.run(sql, [data.username, data.name, data.surname, data.password, data.type])
    //await usr_db.storeUser(req.body);
    return res.status(201).json({message: "ok"})
})