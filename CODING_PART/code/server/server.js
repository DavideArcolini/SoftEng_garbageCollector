'use strict';

/* ROUTER MODULE */
const userrouter      = require("./router/UserRouter");
const routerSKU       = require("./router/SKURouter");
const routerPosition  = require("./router/PositionRouter");
const routerSKUitem   = require("./router/SKUitemRouter");

/* EXPRESS MODULE */
const express = require('express');
const app = new express();
const PORT = 3001;

/* Enabling built-in middleware function .json(): parses incoming requests with JSON payloads */
app.use(express.json()); 

/* ENABLING ROUTER TO DISPACH API  */
app.use("/api", userrouter);
app.use("/api", routerSKU);
app.use("/api", routerPosition);
app.use("/api", routerSKUitem);


/**
 * API: 
 *        GET /api/test
 */
app.get('/api/hello', (req,res)=>{
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});


/* NEW USER */
/*
app.post('/api/newUser', async(req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({error: "Empty Body request"});
  }

  await usr_db.storeUser(req.body);
  return res.status(201).json({message: "ok"})
});
/* MANAGER SESSION */
/*
app.post('/api/managerSessions', async(req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({error: "Empty Body request"})
  }
  console.log(req.body)
  const usr = await usr_db.getUser(req.body);
  return res.status(200).json(usr);
});

app.get('/api/managerSessions', async (req, res) => {
  const userList = await usr_db.getStoredUsers();
  return res.status(200).json(userList);
}); */

/* CUSTOMER SESSION */






/* STARTING THE SERVER CONNECTION */
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

/* EXPORTING MODULES */
module.exports = app;