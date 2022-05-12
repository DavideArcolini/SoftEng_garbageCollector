"use strict";

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
        //uncomment for the first run
        //this.dao.run("INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)", [this.manager.username, this.manager.name, this.manager.surname, this.manager.type, this.manager.password])
    }

    newUser = async (req, res) => {
        try {
            const sql = "INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)";
            let data = req.body;

            let control = await this.dao.get("SELECT username FROM USERS where username = (?)", data.username)
            if (Object.keys(req.body).length === 0 || (data.type == "manager") || (data.type == "administrator") || (data.password.length < 8) || !this.regex.test(data.username)) {
                return res.status(422).json({error: "Empty Body request"});
            }
            else if (control != undefined) {
                return res.status(409).json({message: "User already exists"})
            }
            else {
                await this.dao.run(sql, [data.username, data.name, data.surname, data.password, data.type])
                return res.status(201).json("ok")
            }
        }
        catch(error) {
            return res.status(503).json({message : "Service unavailable"});
        }
        
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

    getSuppliers = async (req, res) => {
        if (Object.keys(req.body)) {

        }
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
        return res.status(200).json(final);
    }

    getUser = async(req, res) => {
        const sql = `
        SELECT * 
        FROM USERS 
        WHERE username=(?) AND password=(?);
        `;
        let data = req.body;
        try{
            let result = await this.dao.get(sql, [data.username, data.password]);
            if (result == undefined) {
                return res.status(401).json({message : "Wrong username and/or password"});
            }
            else {
                return res.status(200).json(result);
            }
        } catch(error) {
            return res.status(500).json("error");
        }
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
            let control = await this.dao.get("SELECT * FROM USERS WHERE username=(?)", [user])

            if ((Object.keys(data).length == 0) || (data.oldType=="manager" || data.oldType == "administrator") || (data.newType == "manager" || data.newType == "administrator") || !this.regex.test(req.params.username)) {
                return res.status(422).json({error: "Validation failed"});
            }
            else if ((!this.types.includes(data.oldType)) || (!this.types.includes(data.newType)) || (control == undefined)) {
                return res.status(404).json({error : "Not found"});
            }
            else {
                await this.dao.run(sql, [data.newType, user , data.oldType]);
                return res.status(200).json("ok");
            }
        } catch (error) {
            return res.status(503).json("error");
        }
    }

    deleteUser = async (req,res) => {
        let type = req.params.type;
        let username = req.params.username;
        let user = req.params.username.split("@")[0].concat("@ezwh.com");
        const sql = `
        DELETE from USERS
        WHERE username = (?) AND type = (?)
        `;

        try {
            if((type == "manager") || !this.regex.test(username)) {
                return res.status(422).json({message : "validation of username or of type failed or attempt to delete a manager/administrator"});
            }
            else {
                await this.dao.run(sql, [user, type]);
                return res.status(204).json({message:"success"});
            }
        } catch (error) {
            return res.status(503).json("error");
        }
    }

    logout = (req, res) => {
        try {
            return res.status(200).json({message:"logged out"});
        }
        catch(error){
            return res.status(500).json({message: "error"})
        }
    }
}

module.exports = UserController;