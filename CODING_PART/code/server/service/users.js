"use strict";

class UserService {
    dao;

    constructor(dao) {
        this.dao = dao;
    }

    getUsers = async (req, res) => {
        try {
            const users = await this.dao.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).end();
        }
    }

    login = async(req,res) => {
        try {
            const user = await this.dao.getUser(req.body.username, req.body.password);
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).end();
        }
    }
}

module.exports = UserService;