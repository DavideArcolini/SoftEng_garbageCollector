"use strict";

const bcrypt        = require('bcrypt');
const saltRounds    = 10;

const sqlite = require('sqlite3');
const DAO = require("../db/DAO")

// open the database
const dao = new DAO();

exports.createUser = async(username, name, surname, password, type) => {
        const sql = "INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)";
        try{
            let hash = await bcrypt.hash(password, saltRounds);
            await dao.run(sql, [username, name, surname, hash, type], (err) => {
                if(err) throw(err);
            });
            return
        } catch(err) {
            return(err)
        }
}

exports.getUser = async(username, type=undefined) => {
        let sql = ``;
        console.log(username,type)
        try{
            if(type) {
                sql = `
                SELECT * 
                FROM USERS 
                WHERE username = (?) AND type = (?)`;
                return await dao.get(sql, [username, type], (err) => {
                    if (err) throw(err);
                });
            }
            else {
                sql = `
                SELECT * 
                FROM USERS 
                WHERE username = (?)`
                return await dao.get(sql, [username], (err) => {
                    if (err) throw(err);
                });
            }
        } catch(err) {
            return err
        }
}

exports.getUsers = (suppliers = undefined) => {
    return new Promise(async(resolve, reject) => {
        let sql='';
        if(suppliers){
            sql = "SELECT * FROM USERS WHERE type <> (?) and type = \"supplier\"";
        }
        else {
            sql = "SELECT * FROM USERS WHERE type <> (?)";
        }
        let result = await dao.all(sql, "manager", (err) => {
            if(err) reject(err)
        });
        
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
        resolve(final)
    })
}

exports.modifyPermissions = async(username, old_type, new_type) => {
    try{
        const sql = `
        UPDATE USERS
        SET
            type = (?)
        WHERE username = (?) AND type = (?)
        `;

        let res = await dao.run(sql, [new_type, username, old_type], (err) => {
            if(err) throw(err)
        });
        return res
    } catch(err) {
        return(err)
    }
}

exports.removeUser = async(username, type) => {
    const sql = 'DELETE from USERS WHERE username == ? AND type == ?';
    try {
        await dao.run(sql, [username, type], (err) => {
            if (err) throw(err);
            else return;
        });
        
    } catch (error) {
        return(error)
    }
    
}