"use strict";

class UserController {
    constructor(dao) {
        this.dao = dao
        this.dao.new
    }

    newUser = async (req, res) => {
        const sql = "INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)";
        //return this.dao.run(sql)
    
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({error: "Empty Body request"});
          }
        let data = req.body;
        await this.dao.run(sql, [data.username, data.name, data.surname, data.password, data.type])
        //await usr_db.storeUser(req.body);
        return res.status(201)
    }

    getStoredUsers = async (req, res) =>{

            if (Object.keys(req.body)) {

            }
            const sql = "SELECT * FROM USERS WHERE USERS.type <> 'manager'";
            let result = await this.dao.all(sql);
            return res.status(200).json(result);
    }

    getUser = async(req, res) => {
            const sql = "SELECT id, username, name, surname FROM USERS WHERE username=? AND password=?";
            let data = req.body;
            let result = await this.dao.get(sql, [data.username, data.password, data.type]);
            return res.status(200).json(result);
    }

    logout = (req, res) => {
        return res.status(200)
    }
}

module.exports = UserController;