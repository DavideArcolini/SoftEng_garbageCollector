"use strict";

const bcrypt        = require('bcrypt');
const saltRounds    = 10;

class UserController {
    types = ['customer','qualityEmployee','clerk','deliveryEmployee','supplier'];
    regex =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    manager = {
        username: "manager1@ezwh.com",
        name: "Dave",
        surname: "Grohl",
        type: "manager",
        password: "testpassword"
    }
    constructor(dao) {
        this.dao = dao
    }

    newUser = async (req) => {
        let data = req;
        try {
            const sql = "INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)";
            //let data = req;
            let control = await this.dao.get("SELECT username FROM USERS where username = (?)", data.username)

            if (Object.keys(data).length === 0 || (data.type == "manager") || (data.type == "administrator") || (data.password.length < 8) || !this.regex.test(data.username)) {
                return 422;
            }
            if (control != undefined) {
                return 409;
            }
            else {
                let hash = await bcrypt.hash(data.password, saltRounds);
                await this.dao.run(sql, [data.username, data.name, data.surname, hash, data.type]);
                return 201;
            }
        }
        catch(error) {
            return 503;
        }
        
    }

    getStoredUsers = async () =>{
        try {
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
            return final;
        } catch (error) {
            
        }
            //return res.status(200).json(final);
    }

    getSuppliers = async () => {
        const sql = "SELECT * FROM USERS WHERE type <> (?) and type = \"supplier\"";
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
        return final;
    }

    getUser = async(req) => {
        const sql = `
        SELECT * 
        FROM USERS 
        WHERE username=(?)
        `;
        /* AND password=(?);*/
        try{
            let result = await this.dao.get(sql, req.username);
            if (result) {
                let validPass = await bcrypt.compare(req.password, result.password);
                return validPass ? {id: result.id, username: result.username, name: result.name} : 401;
            }
            else {return 401}
        }
        catch(e){
            return;
        }
    }

    editUser = async(req, username) => {
        const sql = `
            UPDATE USERS
            SET
                type = (?)
            WHERE username = (?) AND type = (?)
        `;
        let user = username.split("@")[0].concat("@ezwh.com");
        
        try {
            let control = await this.dao.get("SELECT username FROM USERS WHERE username=(?)", [user])

            if ((Object.keys(req).length == 0) || (req.oldType=="manager" || req.oldType == "administrator") || (req.newType == "manager" || req.newType == "administrator") || !this.regex.test(username)) {
                return 422
            }
            else if ((!this.types.includes(req.oldType)) || (!this.types.includes(req.newType)) || (control == undefined)) {
                return 404
            }
            else {
                await this.dao.run(sql, [req.newType, user , req.oldType]);
                return 200
            }
        } catch (error) {
            return 503
        }
    }

    deleteUser = async (req) => {
        try {
            let type = req.type;
            let username = req.username;
            let user = req.username.split("@")[0].concat("@ezwh.com");
            const sql = `
            DELETE from USERS
            WHERE username = (?) AND type = (?)
            `;
        
            let res = await this.dao.get("SELECT username FROM USERS WHERE username = (?) AND type = (?)", [user, type])
            if((type == "manager") || !this.regex.test(username) || res === undefined) {
                return 422;
            }
            else {
                await this.dao.run(sql, [user, type]);
                return 204
            }
        } catch (error) {
            return 503
        }
    }

    logout = async (req) => {
        
        if (req) {return 200}
        else {
            return 500
        }
        
    }
}

module.exports = UserController;