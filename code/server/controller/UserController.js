"use strict";

const { throws } = require('assert');
const bcrypt        = require('bcrypt');
const saltRounds    = 10;

class UserController {
    types = ['customer','qualityEmployee','clerk','deliveryEmployee','supplier'];
    regex =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    
    constructor(dao) {
        this.dao = dao
    }

    newUser = async (req) => {
        let data = req;
        try {
            let control = await this.dao.getUser(data.username, data.type)
            
            if (control != undefined) {
                return 409;
            }
            else {
                await this.dao.createUser(data.username, data.name, data.surname, data.password, data.type)
                return 201;
            }
        }
        catch(error) {
            return 503;
        }
        
    }

    getStoredUsers = async () =>{
        try {
            let result = this.dao.getUsers();
            return result
        } catch (error) {
            console.log(error)
        }
    }

    getSuppliers = async () => {
        try {
            let result = this.dao.getUsers(true);
            return result
        } catch (error) {
            console.log(error)
        }
    }

    login = async(req) => {
        const sql = `
        SELECT * 
        FROM USERS 
        WHERE username=(?)
        `;
        /* AND password=(?);*/
        try{
            let result = await this.dao.getUser(req.username);
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
        try {
            let user = username.split("@")[0].concat("@ezwh.com");
            let control = await this.dao.getUser(user, req.oldType)
            if (control === undefined) {
                return 404
            }
            else {
                await this.dao.modifyPermissions(user, req.oldType, req.newType)
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
            let user = username.split("@")[0].concat("@ezwh.com");
        
            await this.dao.removeUser(user, type);
            return 204
        } catch (error) {
            return 503
        }
    }
}

module.exports = UserController;