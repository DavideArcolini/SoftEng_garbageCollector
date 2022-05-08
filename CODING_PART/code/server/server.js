'use strict';
const express = require('express');
// init express
const app = new express();
const userrouter = require("./router/UserRouter");
const RORouter = require("./router/RestockOrderRouter");
const IORouter = require("./router/InternalOrderRouter");
const RTORouter = require("./router/ReturnOrderRouter");


const port = 3001;

app.use(express.json());

/* USERS  */
app.use("/api", userrouter)

app.use("/api",RORouter)

app.use("/api",IORouter);

app.use("/api",RTORouter);
//GET /api/test
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

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;