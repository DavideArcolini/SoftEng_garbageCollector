"use strict";

class UserController {
    constructor(dao) {
        this.dao = dao
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
        return res.status(201).json("ok")
    }

    getStoredUsers = async (req, res) =>{
            if (Object.keys(req.body)) {

            }
            const sql = "SELECT * FROM USERS WHERE type <> (?)";
            let result = await this.dao.all(sql, "manager");

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
            return res.status(200).json(final);
    }

    getUser = async(req, res) => {
        const sql = "SELECT id, username, name, surname FROM USERS WHERE username=? AND password=?";
        let data = req.body;
        let result = await this.dao.get(sql, [data.username, data.password, data.type]);
        return res.status(200).json(result);
    }

    editUser = async(req, res) => {
        const sql = `
            UPDATE USERS
            SET
                type = (?)
            WHERE username = (?) AND type = (?)
        `;
        let data = req.body;
        let user = req.params.username.split("@")[0].concat("@ezwh.com");
        try {
            await this.dao.get(sql, [data.newType, user , data.oldType]);
            return res.status(200).json("ok");
        } catch (error) {
            console.log(error)
        }
    }

    logout = (req, res) => {
        return res.status(200)
    }
}

module.exports = UserController;