"use strict";

const sqlite = require('sqlite3');
const DAO = require('../db/DAO');

const bcrypt        = require('bcrypt');
const saltRounds    = 10;

const dao = new DAO();

exports.getAllUsers = async (req, res) =>{
    const sql = "SELECT * FROM USERS WHERE type <> (?)";
    let result = await dao.all(sql, "manager");
    console.log(result)
    let final = result.map((e) => {
        let user = e.username.split("@");
        let email = user[0].concat(`@${e.type}.ezwh.com`);
        let json = {
            id: e.id,
            name: e.name,
            surname: e.surname,
            email: email,
            type: e.type
        }

        return json;
    })
    console.log(final)
    return final;
}     

exports.getuser = async(username, password) => {
    const sql = `
        SELECT * 
        FROM USERS 
        WHERE username=(?)
        `;
        /* AND password=(?);*/

        try{
            let result = await this.dao.get(sql, [username]);

            if (result) {
                let validPass = await bcrypt.compare(password, result.password);
                validPass ? {id: result.id, username: result.username, name: result.name} : {message : "Wrong username and/or password"};
            }
            else {
                return 
            }
        } catch(error) {
            return res.status(500).json("error");
        }
}