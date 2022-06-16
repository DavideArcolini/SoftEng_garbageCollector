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
require('./testSKURouter');

/* ------------ INITIALIZATION ------------ */
chai.use(chaiHttp);
chai.should();
let agent = chai.request.agent(app); //was var see if you should change
const dao = new DAO();

let tst= {
        name:"test descriptor 3",
        procedureDescription:"This test is described by...",
        idSKU :1
    }

let tst2= {
        name:"test descriptor 4",
        procedureDescription:"This test is described by...",
        idSKU :1
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
*         API: POST/api/testDescriptor
* =========================================
   @param {String} testName specific name of the test run
 * @param {Number} expectedHTTPStatus return status of the API call
   tst is a json prova
*/

describe('new test descriptor', () => {


    before(async()=>{
        await agent.post(`/api/sku`).send(sku).then(function(res){
            res.should.have.status(201);
          });
          await agent.post(`/api/skuitem`).send(skui).then(function(res){
            res.should.have.status(201);
          });
        })
    

    //  201
    newTestDescriptor('201 return', 201, tst);

    //  422
    newTestDescriptor('empty body', 422, {});

    newTestDescriptor('wrong idsku type', 422, {
        name: 3,
        procedureDescription:"This test is described by...",
        idSKU :"yella"
    })


    //  404
    newTestDescriptor("skuid doesn't exist", 404, {
        name:"test descriptor 3",
        procedureDescription:"This test is described by...",
        idSKU :6
    });


    after(async() => {
        let sql="DELETE FROM TEST_DESCRIPTORS WHERE id==?"
        await dao.run(sql,1)
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
*         API: GET /api/testDescriptors
* =========================================
   @param {String} testName specific name of the test run
 * @param {Number} expectedHTTPStatus return status of the API call
   tst is a json prova
*/

describe('get test descriptor', () => {
    
    
    before(async()=>{
        await agent.post(`/api/sku`).send(sku).then(function(res){
            res.should.have.status(201);
          });
          await agent.post(`/api/skuitem`).send(skui).then(function(res){
            res.should.have.status(201);
          });

          await agent.post('/api/testDescriptor').send(tst).then(function (res) {
              res.should.have.status(201);
          })
          await agent.post('/api/testDescriptor').send(tst2).then(function (res) {
            res.should.have.status(201);
        })
    });

    //200
   getTestDescriptors('200 return', 200);

   after(async() => {

    let sql="DELETE FROM TEST_DESCRIPTORS"
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
*          API: GET /api/testDescriptors/:id
* =============================================
*/

describe('get test descriptor by id', () => {

    before(async () => {
        await agent.post(`/api/sku`).send(sku).then(function(res){
            res.should.have.status(201);
          });
          await agent.post(`/api/skuitem`).send(skui).then(function(res){
            res.should.have.status(201);
          });

          await agent.post('/api/testDescriptor').send(tst).then(function (res) {
              res.should.have.status(201);
          })
    });

    //200
    getTestDescriptorById('200 return', {id: 1},200);

    //404
    getTestDescriptorById('id non existing)', {id: 3},404);

    //422
    getTestDescriptorById('id constraint failed', {id: "FailureHere"},422);

    after(async() => {

        let sql="DELETE FROM TEST_DESCRIPTORS"
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
*         API: PUT /api/testDescriptor/:id
* =============================================
*/
describe('modify test descriptor', () => {

    before(async () => {
        let sql="INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)"
        await dao.run(sql,[tst.name,tst.procedureDescription,tst.idSKU])
    });

    //200 
    modifyTestDescriptor('200 return',{id: 1},
        {
            newName: "test descriptor 1",
            newProcedureDescription :"This test is described by...",
            newIdSKU :1
        },200
    );

    //404
    modifyTestDescriptor("id doesn't exist",{id: 2},
        {
            newName: "test descriptor 1",
            newProcedureDescription :"This test is described by...",
            newIdSKU :1
        },422
    );

    //422
    modifyTestDescriptor("body format is wrong",{id: 1},
        {
            newName: "test descriptor 1",
            newProcedureDescription :"This test is described by...",
            newIdSKU : "FailureHere"
        }, 422 
    );

    after(async () => {
        let sql="DELETE FROM TEST_DESCRIPTORS";
        await dao.run(sql);
    });
});






/*
* ---------------------------------------------
*          API: DELETE /api/testDescriptor/:id
* =============================================
*/

describe("delete test descriptor", () => {
    before(async () => {

        await agent.post(`/api/sku`).send(sku).then(function(res){
            res.should.have.status(201);
          });
          await agent.post(`/api/skuitem`).send(skui).then(function(res){
            res.should.have.status(201);
          });

          await agent.post('/api/testDescriptor').send(tst).then(function (res) {
              res.should.have.status(201);
          })
    });

    //204
    deleteTestDescriptor('204 No Content',{id: 1},204);


    after(async() => {
    
        await agent.delete(`/api/skuitems/90000000000000000000000000000002`).then(async (response) => {
            response.should.have.status(204);
        });
    
        let sql="DELETE FROM SKUS";
        dao.run(sql);

    });

})





/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |          T E S T    F U N C T I O N S            |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/

function newTestDescriptor(name, expectedHTTPStatus, tst) {
    it(name, async() =>{
          await agent.post('/api/testDescriptor').send(tst).then( async (res)=> {
                    res.should.have.status(expectedHTTPStatus);
                });
    });
}


function getTestDescriptors(testName, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.get('/api/testDescriptors').then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
            response.should.to.be.json;
            response.body.should.be.a('array');
        })
    });
    
}


function getTestDescriptorById(testName, params, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.get(`/api/testDescriptors/${params.id}`).then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
            response.should.to.be.json;
        })
    });
}


function modifyTestDescriptor(testName, params, request, expectedHTTPStatus) {
    it(testName, async()=>{
            agent.put(`/api/testDescriptor/${params.id}`).send(request).then(async(response)=>{
            response.should.have.status(expectedHTTPStatus);
        });
    });
}



function deleteTestDescriptor(testName, params, expectedHTTPStatus) {
    it(testName, function(done)  {
            agent.delete(`/api/testDescriptor/${params.id}`).then(function (response) {
            response.should.have.status(expectedHTTPStatus);
        });
        done();
    });

}