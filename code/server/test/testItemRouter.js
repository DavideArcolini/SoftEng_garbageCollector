/**
 *      TESTING ROUTER: TEST DESCRIPTOR 
 * ==================================
 * 
*/

'use strict'

/* ------------ MODULE IMPORT ------------ */
const chai      = require('chai');
const chaiHttp  = require('chai-http');
const app       = require('../server');
const DAO       = require('../db/DAO');
require("./testTestResultRouter")

/* ------------ INITIALIZATION ------------ */
chai.use(chaiHttp);
chai.should();
let agent = chai.request.agent(app); //was var see if you should change
const dao = new DAO();

let tst= {
    id : 12,
    description : "a new item",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
}


let tst2= {
    newDescription : "a new sku",
    newPrice : 10.99
}


let sku={
    description: "newSku",
    weight: 100,
    volume: 50,
    notes: "first SKU",
    price: 10.99,
    availableQuantity: 50
}

let skui={
    "RFID": "90000000000000000000000000000002",
    "SKUId": 1,
    "DateOfStock": "2021/11/29 12:30"
}

/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |            T E S T    R E S U L T S              |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/

/*
* -----------------------------------------
*         API: POST/api/item
* =========================================
   @param {String} testName specific name of the test run
 * @param {Number} expectedHTTPStatus return status of the API call
   tst is a json prova
*/

describe('new item', () => {


    before(async()=>{
        await agent.post(`/api/sku`).send(sku).then(function(res){
            res.should.have.status(201);
          });
          await agent.post(`/api/skuitem`).send(skui).then(function(res){
            res.should.have.status(201);
          });
        })
    

    //  201
    newItem('201 return', 201, tst);

    //  422
    newItem('empty body', 422, {});

    newItem('wrong price type', 422, {
        id : 12,
        description : "a new item",
        price : "HereFailure10.99",
        SKUId : 1,
        supplierId : 2
    })


    //  404
    newItem("skuid doesn't exist", 404, {
        id : 12,
        description : "a new item",
        price : 10.99,
        SKUId : 2,
        supplierId : 2
    });


    after(async() => {
        // let sql="DELETE FROM ITEMS"
        // await dao.run(sql)
<<<<<<< HEAD
        await agent.delete(`/api/items/12`).then(async (response) => {
=======
        await agent.delete(`/api/items/12/2`).then(async (response) => {
>>>>>>> delivery_changes
            response.should.have.status(204);
        });
        await agent.delete(`/api/skuitems/90000000000000000000000000000002`).then(async (response) => {
            response.should.have.status(204);
        });
        await agent.delete(`/api/skus/1`).then(async (response) => {
            response.should.have.status(204);
        });
    })
       

})
/*
* -----------------------------------------
*         API: GET /api/items
* =========================================
   @param {String} testName specific name of the test run
 * @param {Number} expectedHTTPStatus return status of the API call
   tst is a json prova
*/

describe('get item', () => {
    
    
    before(async()=>{
        await agent.post(`/api/sku`).send(sku).then(function(res){
            res.should.have.status(201);
          });
          await agent.post(`/api/skuitem`).send(skui).then(function(res){
            res.should.have.status(201);
          });
          let sql= "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
            await dao.run(sql,[tst.id, tst.description, tst.price, tst.SKUId, tst.supplierId]);

    });

    //200
   getItems('200 return', 200);

   after(async() => {

    let sql="DELETE FROM ITEMS"
    await dao.run(sql)
    await agent.delete(`/api/skuitems/90000000000000000000000000000002`).then(async (response) => {
        response.should.have.status(204);
    });
    await agent.delete(`/api/skus/1`).then(async (response) => {
        response.should.have.status(204);
    });
    })

});


/*
* ---------------------------------------------
*          API: GET /api/items/:id/:supplierId
* =============================================
*/

describe('get item by id and sup id', () => {

    before(async () => {
        await agent.post(`/api/sku`).send(sku).then(function(res){
            res.should.have.status(201);
          });
          await agent.post(`/api/skuitem`).send(skui).then(function(res){
            res.should.have.status(201);
          });

          let sql= "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
            await dao.run(sql,[tst.id, tst.description, tst.price, tst.SKUId, tst.supplierId]);
    });

    //200
    getItemById('200 return', {id: 12, supplierId : 2},200);

    //404
    getItemById('id non existing)', {id: 3,supplierId : 2},404);

    //422
    getItemById('id constraint failed', {id: "FailureHere",supplierId : 2},422);

    after(async() => {

        let sql="DELETE FROM ITEMS"
        await dao.run(sql)
        await agent.delete(`/api/skuitems/90000000000000000000000000000002`).then(async (response) => {
            response.should.have.status(204);
        });
        await agent.delete(`/api/skus/1`).then(async (response) => {
            response.should.have.status(204);
        });
    })
});


/*
* ---------------------------------------------
*         API: PUT /api/item/:id
* =============================================
*/
describe('modify item', () => {

    before(async () => {
        let sql= "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
        await dao.run(sql,[tst.id, tst.description, tst.price, tst.SKUId, tst.supplierId]);
    });

    //200 
    modifyItem('200 return',{id: 12,supplierId : 2},tst2,200);

    //404
    modifyItem("id doesn't exist",{id: 2,supplierId : 2},
    {
        newDescription : "a new sku",
        newPrice : 10.99
    },422);

    //422
    modifyItem("body format is wrong",{id: 12,supplierId : 2},
    {
        newDescription : "a new sku",
        newPrice : "FailureHere10.99"
    }, 422  );

    after(async () => {
        let sql="DELETE FROM ITEMS";
        await dao.run(sql);
    });
});






/*
* ---------------------------------------------
*          API: DELETE /api/item/:id
* =============================================
*/

describe("delete item", () => {
    before(async () => {

        await agent.post(`/api/sku`).send(sku).then(function(res){
            res.should.have.status(201);
          });
          await agent.post(`/api/skuitem`).send(skui).then(function(res){
            res.should.have.status(201);
          });

          let sql= "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
            await dao.run(sql,[tst.id, tst.description, tst.price, tst.SKUId, tst.supplierId]);
    });

    //204
    deleteItem('204 No Content',{id: 12,supplierId : 2},204);


    after(async() => {
    
        await agent.delete(`/api/skuitems/90000000000000000000000000000002`).then(async (response) => {
            response.should.have.status(204);
        });
    
        await agent.delete(`/api/skus/1`).then(async (response) => {
            response.should.have.status(204);
        });

    });

})





/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |          T E S T    F U N C T I O N S            |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/

function newItem(name, expectedHTTPStatus, tst) {
    it(name, function(done){
           agent.post('/api/item').send(tst).then( function(res){
                    res.should.have.status(expectedHTTPStatus);
                });
                done();
    });
}


function getItems(testName, expectedHTTPStatus) {
    it(testName, function (done){
         agent.get('/api/items').then(function (response) {
            response.should.have.status(expectedHTTPStatus);
            response.should.to.be.json;
            response.body.should.be.a('array');
        })
        done();
    });
    
}


function getItemById(testName, params, expectedHTTPStatus) {
    it(testName, function (done) {
        agent.get(`/api/items/${params.id}/${params.supplierId}`).then(function(response){
            response.should.have.status(expectedHTTPStatus);
            response.should.to.be.json;
        })
        done();
    });
}


function modifyItem(testName, params, request, expectedHTTPStatus) {
    it(testName, function(done){
            agent.put(`/api/item/${params.id}/${params.supplierId}`).send(request).then(function(response){
            response.should.have.status(expectedHTTPStatus);
        });
        done();
    });
}



function deleteItem(testName, params, expectedHTTPStatus) {
    it(testName, function(done)  {
            agent.delete(`/api/items/${params.id}/${params.supplierId}`).then(function (response) {
            response.should.have.status(expectedHTTPStatus);
        });
        done();
    });

}