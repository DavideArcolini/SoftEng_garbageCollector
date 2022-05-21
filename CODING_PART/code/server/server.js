'use strict';

const morgan = require("morgan");

/* ---------- IMPORTS ---------- */
const router_USER           = require("./router/UserRouter");
const router_SKU            = require("./router/SKURouter");
const router_Position       = require("./router/PositionRouter");
const router_SKUitem        = require("./router/SKUitemRouter");
const router_ITEM           = require("./router/ItemRouter");
const router_TestDescriptor = require("./router/TestDescriptorRouter");
const router_TestResult     = require("./router/TestResultRouter");
const router_RestockOrder   = require("./router/RestockOrderRouter");
const router_InternalOrder  = require("./router/InternalOrderRouter");
const router_ReturnOrder    = require("./router/ReturnOrderRouter");

/* ---------- EXPRESS MODULE ---------- */
const express     = require('express');
const app         = new express();
const PORT        = 3001;
app.use(express.json());
app.use(morgan('dev'));

/* ---------- ENABLING ROUTER TO DISPATCH API ---------- */
app.use("/api", router_USER);                                     /* USER                   */
app.use("/api", router_SKU);                                      /* SKU                    */
app.use("/api", router_Position);                                 /* POSITION               */
app.use("/api", router_SKUitem);                                  /* SKUitem                */
app.use("/api", router_RestockOrder);                             /* RESTOCK ORDER          */
app.use("/api", router_InternalOrder);                            /* INTERNAL ORDER         */
app.use("/api", router_ReturnOrder);                              /* RETURN ORDER           */
app.use("/api", router_ITEM)                                      /* ITEM ORDER             */
app.use("/api", router_TestDescriptor);                           /* TEST DESCRIPTOR        */
app.use("/api", router_TestResult);                               /* TEST RESULT            */

//GET /api/test
app.get('/api/hello', (req,res)=>{
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});

// activate the server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

module.exports = app;
