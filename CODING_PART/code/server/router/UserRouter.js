"use strict";
const express = require('express');
const { ValidationHalt } = require('express-validator/src/base');
const router = express.Router();
const UserController = require('../controller/UserController');
const DAO = require("../db/DAO");
const dao = new DAO();
const uc = new UserController(dao);

const { validationHandler } = require("../validator/validationHandler");
const { param }             = require('express-validator');
const { header }            = require('express-validator');
const { body }              = require('express-validator');


/**
 * API:
 *            GET /api/suppliers
 *  =================================================
 */
router.get(
    "/suppliers", 
    [
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    async(req, res) => {
        try {
            const users = await uc.getSuppliers();
            return res.status(200).json(users);
        } catch (error) {
            res.status(500).json({message: "Internal server error"});
        }
        
    }
);

/**
 * API:
 *            GET /api/users
 *  =================================================
 */
router.get(
    "/users", 
    [
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    async(req, res) => {
        try {
            const users = await uc.getStoredUsers();
            return res.status(200).json(users);
        } catch (error) {
            res.status(500).json({message: "Internal server error"});
        }
        
    }
);

/**
 * API:
 *            POST /api/newUser
 *  =================================================
 */
router.post(
    "/newUser", 
    [
        header('Content-Type').equals('application/json'),                      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.username === undefined ||
                value.name === undefined ||
                value.surname === undefined ||
                value.password === undefined ||
                value.type === undefined) {
                    throw new Error('Missing parameters');
                }
            return true;
        }),
        body('username').isEmail(),                                                 /* [FROM API.md]: username is an email                                                  */
        body('name').isAscii(),                                                     /* [FROM API.md]: name is a string reasonably containing ASCII chars                    */
        body('surname').isAscii(),                                                  /* [FROM API.md]: surname is a string reasonably containing ASCII chars                 */
        body('password').isLength({min: 8})/*.isStrongPassword()*/,                 /* [FROM API.md]: password is AT LEAST 8 characters                                     */
        /* enable it to implement strongPassword authentication  */
        body('type').custom((value) => {                                            /* [FROM API.md] Possible types : customer, qualityEmployee, clerk, deliveryEmployee, supplier */
            const TYPES = ['customer', 'qualityEmployee', 'clerk', 'deliveryEmployee', 'supplier'];
            for (let t of TYPES) {
                if (t === value) {
                    return true;
                }
            }
            throw new Error('Invalid type value');
        })
    ],
    validationHandler,
    async(req, res) => {
        const isOk = await uc.newUser(req.body);
        if(isOk === 201) {
            return res.status(201).json({message: "ok"})
        }
        else if (isOk === 409) {
            return res.status(409).json({message: "User already exists"})
        }
        else {
            return res.status(503).json({message : "Service unavailable"});
        }
        
    }
    //uc.newUser
);

/**
 * API:
 *            PUT /api/users/:username
 *  =================================================
 */
router.put(
    "/users/:username", 
    [
        param('username').isEmail(),                                            /* [FROM API.md]: username is an email                                                  */
        header('Content-Type').equals('application/json'),                      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length === 0) {
                throw new Error('Body should not be empty');
            }
            return true;
        }),
        body().custom(value => {                                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
            if (value.oldType === undefined ||
                value.newType === undefined) {
                    throw new Error('Missing parameters');
                }
            return true;
        }),
        body('oldType').custom((value) => {                                     /* [FROM API.md] Possible types : customer, qualityEmployee, clerk, deliveryEmployee, supplier */
            const TYPES = ['customer', 'qualityEmployee', 'clerk', 'deliveryEmployee', 'supplier'];
            for (let t of TYPES) {
                if (t === value) {
                    return true;
                }
            }
            throw new Error('Invalid type value');
        }),
        body('newType').custom((value) => {                                     /* [FROM API.md] Possible types : customer, qualityEmployee, clerk, deliveryEmployee, supplier */
            const TYPES = ['customer', 'qualityEmployee', 'clerk', 'deliveryEmployee', 'supplier'];
            for (let t of TYPES) {
                if (t === value) {
                    return true;
                }
            }
            throw new Error('Invalid type value');
        })
    ],
    validationHandler,
    async(req, res) => {
        let result = await uc.editUser(req.body, req.params.username);
        
        if(result===404) {
            res.status(404).json({error : "Not Found"});
        }
        else if(result===200) {
            return res.status(200).json({message: "ok"});
        }
        else {
            return res.status(503).json({error: "Service Unavailable"});
        }
    }
    //uc.editUser
);


/**
 * API:
 *            DELETE /users/:username/:type
 *  =================================================
 */
router.delete(
    "/users/:username/:type", 
    [
        param('username').isEmail(),                                            /* [FROM API.md]: username is an email                                                  */
        param('type').custom((value) => {                                       /* [FROM API.md]: Manager/Administrator accounts cannot be deleted.                     */
            if (value === 'manager' || value === 'administrator') {
                throw new Error('Invalid type value');
            }
            return true;
        }),
        body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length !== 0) {
                throw new Error('Body should be empty');
            }
            return true;
        })
    ],
    validationHandler,
    async(req, res) => {
        try {
            let result = await uc.deleteUser(req.params);
            
            if (result === 204) {
                return res.status(204).json({message:"success"});
            }
            else {
                return res.status(503).json({error: "Service Unavailable"});
            }
        } catch (error) {
            return res.status(503).json({error: "Service Unavailable"});
        }
        
        
    }
    //uc.deleteUser
);

/* SESSIONS */
router.post("/managerSessions",[
    header('Content-Type').equals('application/json'),                      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
    body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length === 0) {
                throw new Error('Body should not be empty');
            }
            return true;
    }),
    body().custom(value => {                                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
        if (value.username === undefined ||
            value.password === undefined) {
                throw new Error('Missing parameters');
            }
        return true;
    }),
    body('username').isEmail(),                                                 /* [FROM API.md]: username is an email                                                  */
    body('password').isLength({min: 8})/*.isStrongPassword()*/,                 /* [FROM API.md]: password is AT LEAST 8 characters                                     */
    /* enable it to implement strongPassword authentication  */
    
],
validationHandler,
async(req, res) => {
    const user = await uc.getUser(req.body);
    
    if(user === 401) {
        return res.status(401).json({message : "Wrong username and/or password"});
    }
    else if (user) {
        return res.status(200).json(user)
    }
    else {
        return res.status(500).json("error");
    }
});

router.post("/deliveryEmployeeSessions", [
    header('Content-Type').equals('application/json'),                      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
    body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length === 0) {
                throw new Error('Body should not be empty');
            }
            return true;
    }),
    body().custom(value => {                                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
        if (value.username === undefined ||
            value.password === undefined) {
                throw new Error('Missing parameters');
            }
        return true;
    }),
    body('username').isEmail(),                                                 /* [FROM API.md]: username is an email                                                  */
    body('password').isLength({min: 8})/*.isStrongPassword()*/,                 /* [FROM API.md]: password is AT LEAST 8 characters                                     */
    /* enable it to implement strongPassword authentication  */
    
],
validationHandler,
async(req, res) => {
    const user = await uc.getUser(req.body);
    
    if(user === 401) {
        return res.status(401).json({message : "Wrong username and/or password"});
    }
    else if (user) {
        return res.status(200).json(user)
    }
    else {
        return res.status(500).json("error");
    }
});

router.post("/qualityEmployeeSessions", [
    header('Content-Type').equals('application/json'),                      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
    body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length === 0) {
                throw new Error('Body should not be empty');
            }
            return true;
    }),
    body().custom(value => {                                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
        if (value.username === undefined ||
            value.password === undefined) {
                throw new Error('Missing parameters');
            }
        return true;
    }),
    body('username').isEmail(),                                                 /* [FROM API.md]: username is an email                                                  */
    body('password').isLength({min: 8})/*.isStrongPassword()*/,                 /* [FROM API.md]: password is AT LEAST 8 characters                                     */
    /* enable it to implement strongPassword authentication  */
    
],
validationHandler,
async(req, res) => {
    const user = await uc.getUser(req.body);
    
    if(user === 401) {
        return res.status(401).json({message : "Wrong username and/or password"});
    }
    else if (user) {
        return res.status(200).json(user)
    }
    else {
        return res.status(500).json("error");
    }
});

router.post("/clerkSessions", 
[
    header('Content-Type').equals('application/json'),                      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
    body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length === 0) {
                throw new Error('Body should not be empty');
            }
            return true;
    }),
    body().custom(value => {                                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
        if (value.username === undefined ||
            value.password === undefined) {
                throw new Error('Missing parameters');
            }
        return true;
    }),
    body('username').isEmail(),                                                 /* [FROM API.md]: username is an email                                                  */
    body('password').isLength({min: 8})/*.isStrongPassword()*/,                 /* [FROM API.md]: password is AT LEAST 8 characters                                     */
    /* enable it to implement strongPassword authentication  */
    
],
validationHandler,
async(req, res) => {
    const user = await uc.getUser(req.body);
    
    if(user === 401) {
        return res.status(401).json({message : "Wrong username and/or password"});
    }
    else if (user) {
        return res.status(200).json(user)
    }
    else {
        return res.status(500).json({message: "error"});
    }
});

router.post("/customerSessions", [
    header('Content-Type').equals('application/json'),                      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
    body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length === 0) {
                throw new Error('Body should not be empty');
            }
            return true;
    }),
    body().custom(value => {                                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
        if (value.username === undefined ||
            value.password === undefined) {
                throw new Error('Missing parameters');
            }
        return true;
    }),
    body('username').isEmail(),                                                 /* [FROM API.md]: username is an email                                                  */
    body('password').isLength({min: 8})/*.isStrongPassword()*/,                 /* [FROM API.md]: password is AT LEAST 8 characters                                     */
    /* enable it to implement strongPassword authentication  */
    
],
validationHandler,
async(req, res) => {
    const user = await uc.getUser(req.body);
    
    if(user === 401) {
        return res.status(401).json({message : "Wrong username and/or password"});
    }
    else if (user) {
        return res.status(200).json(user)
    }
    else {
        return res.status(500).json("error");
    }
});

router.post("/supplierSessions", [
    header('Content-Type').equals('application/json'),                      /* [FROM API.md]: Request header has a line: Content-Type: application/json.            */
    body().custom(value => {                                                /* [FROM API.md]: body should be empty                                                  */
            if (Object.keys(value).length === 0) {
                throw new Error('Body should not be empty');
            }
            return true;
    }),
    body().custom(value => {                                                /* [FROM API.md]: all parameters should be defined (no optional parameters)             */
        if (value.username === undefined ||
            value.password === undefined) {
                throw new Error('Missing parameters');
            }
        return true;
    }),
    body('username').isEmail(),                                                 /* [FROM API.md]: username is an email                                                  */
    body('password').isLength({min: 8})/*.isStrongPassword()*/,                 /* [FROM API.md]: password is AT LEAST 8 characters                                     */
    /* enable it to implement strongPassword authentication  */
    
],
validationHandler,
async(req, res) => {
    const user = await uc.getUser(req.body);
    
    if(user === 401) {
        return res.status(401).json({message : "Wrong username and/or password"});
    }
    else if (user) {
        return res.status(200).json(user)
    }
    else {
        return res.status(500).json("error");
    }
});

/**
 * API:
 *            POST /logout
 *  =================================================
 */
router.post("/logout", async(req, res) => {
    let result = await uc.logout(req);

    if(result===200) {return res.status(200).json({message:"logged out"});}
    else {res.status(500).json({message: "error"});}
})

module.exports = router;