"use strict";

const bcrypt        = require('bcrypt');
const saltRounds    = 10;

const sqlite = require('sqlite3');
const DAO = require("../db/DAO")

// open the database
let dao = new DAO();

exports.setDAO = async(user_dao) => {
    dao = user_dao
}

exports.createUser = async(username, name, surname, password, type) => {
    const sql = "INSERT OR IGNORE INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)";

    let hash = await bcrypt.hash(password, saltRounds);
    await dao.run(sql, [username, name, surname, hash, type])
        .catch((err) => {throw new Error(err.message);});
    return undefined;
}

exports.getUser = async(username, type=undefined) => {
    let sql = ``;

    if(type) {
        sql = `
        SELECT * 
        FROM USERS 
        WHERE username = (?) AND type = (?)`;
        return await dao.get(sql, [username, type])
        .catch((err) => {
            if(err) throw new Error(err.message);
        });
    }
    else {
        sql = `
        SELECT * 
        FROM USERS 
        WHERE username = (?)`
        return await dao.get(sql, [username])
        .catch((err) => {
            if(err) throw new Error(err.message);
        });
    }
}

exports.getUsers = async (suppliers = undefined) => {
        let sql='';
        if(suppliers){
            sql = "SELECT * FROM USERS WHERE type <> (?) and type = \"supplier\"";
        }
        else {
            sql = "SELECT * FROM USERS WHERE type <> (?)";
        }
        let result = await dao.all(sql, "manager")
        .catch((err) => {
            if(err) throw new Error(err.message);
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
        return final
}

exports.modifyPermissions = async(username, old_type, new_type) => {
    const sql = `
    UPDATE USERS
    SET
        type = (?)
    WHERE username = (?) AND type = (?)
    `;

    let res = await dao.run(sql, [new_type, username, old_type])
    .catch((err) => {
        if(err) throw new Error(err.message);
    });
}

exports.removeUser = async(username, type) => {
    const sql = 'DELETE from USERS WHERE username == ? AND type == ?';
    await dao.run(sql, [username, type])
    .catch((err) => {
        if(err) throw new Error(err.message);
    });
    
}

exports.deleteAllUsers = async() => {
    const sql = "DELETE FROM USERS";
    await dao.run(sql);
}