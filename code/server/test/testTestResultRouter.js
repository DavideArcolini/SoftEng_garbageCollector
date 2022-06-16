/**
 *      TESTING ROUTER: TEST RESULT 
 * ==================================
 * 
*/

'use strict'

/* ------------ MODULE IMPORT ------------ */
const chai      = require('chai');
const chaiHttp  = require('chai-http');
const app       = require('../server');
const DAO       = require('../db/DAO');
require("./testTestDescriptorRouter");

/* ------------ INITIALIZATION ------------ */
chai.use(chaiHttp);
chai.should();
let agent = chai.request.agent(app); //was var see if you should change
const dao = new DAO();

let tst=  {
    rfid:"90000000000000000000000000000002",
    idTestDescriptor:1,
    Date:"2021/11/28",
    Result: true
}


let td= {
    name:"test descriptor 3",
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
*         API: POST/api/testResult
* =========================================
   @param {String} testName specific name of the test run
 * @param {Number} expectedHTTPStatus return status of the API call
   tst is a json prova
*/

describe('new test result', () => {


    before(async()=>{
        await agent.post(`/api/sku`).send(sku).then(function(res){
            res.should.have.status(201);
          });
          await agent.post(`/api/skuitem`).send(skui).then(function(res){
            res.should.have.status(201);
          });
          await agent.post('/api/testDescriptor').send(td).then( async (res)=> {
            res.should.have.status(201);
            })
        })
    

    //  201
    newTestResult('201 return',201, tst);

    //  422
    newTestResult('empty body', 422, {});

    newTestResult('wrong rfid length', 422, {
        rfid:"12345678",
        idTestResult:12,
        Date:"2021/11/28",
        Result: true
    })


    //  404
    newTestResult("rfid doesn't exist", 404, {
        rfid:"12345678901234567890123456789016",
        idTestResult:12,
        Date: 2021/11/28,
        Result: true
    });

    newTestResult("id doesn't exist", 404, {
        rfid:"90000000000000000000000000000002",
        idTestResult:12,
        Date:2021/11/28,
        Result: true
    });


    after(async() => {
        let sql="DELETE FROM TEST_RESULTS "
        await dao.run(sql)
        sql="DELETE FROM TEST_DESCRIPTORS "
        await dao.run(sql)
        sql="DELETE FROM SKUITEMS "
        await dao.run(sql)
        sql="DELETE FROM SKUS "
        await dao.run(sql)
    })
       

})
/*
* -----------------------------------------
*  API: GET /api/skuitems/:rfid/testResults
* =========================================
   @param {String} testName specific name of the test run
 * @param {Number} expectedHTTPStatus return status of the API call
   tst is a json prova
*/

describe('get test result', () => {
    
    
    before(async()=>{
        await agent.post(`/api/sku`).send(sku).then(function(res){
            res.should.have.status(201);
          });
          await agent.post(`/api/skuitem`).send(skui).then(function(res){
            res.should.have.status(201);
          });

          await agent.post('/api/testDescriptor').send(td).then(function (res) {
              res.should.have.status(201);
          })
          let sql="INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
          await dao.run(sql,["90000000000000000000000000000002",1,"2021/11/28",true])
    });

    //200
   getTestResults('200 return',{rfid:"90000000000000000000000000000002" } ,200);

    //422
   getTestResults('rfid short',{rfid:"900000000000000000000" } ,422);


   after(async() => {

    let sql="DELETE FROM TEST_RESULTS"
    await dao.run(sql)
    sql="DELETE FROM TEST_DESCRIPTORS"
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
*     API: GET /api/skuitems/:rfid/testResults/:id
* =============================================
*/

describe('get test result by id', () => {

    before(async()=>{
        await agent.post(`/api/sku`).send(sku).then(function(res){
            res.should.have.status(201);
          });
          await agent.post(`/api/skuitem`).send(skui).then(function(res){
            res.should.have.status(201);
          });

          await agent.post('/api/testDescriptor').send(td).then(function (res) {
              res.should.have.status(201);
          })
          let sql="INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
          await dao.run(sql,["90000000000000000000000000000002",1,"2021/11/28",true])
    });

    //200
    getTestResultById('200 return', {rfid: "90000000000000000000000000000002",id: 1},200);

    //404
    getTestResultById('id non existing)', {rfid: "90000000000000000000000000000002",id: 3},404);

    getTestResultById('rfid non existing)', {rfid: "90000000000000000000000000000003",id: 1},404);

    //422
    getTestResultById('id constraint failed', {rfid: "90000000000000000000000000000002", id: "FailureHere"},422);

    getTestResultById('rfid constraint failed', {rfid: "900000000000000000002", id: "FailureHere"},422);

    after(async() => {

        let sql="DELETE FROM TEST_RESULTS"
        await dao.run(sql)
        sql="DELETE FROM TEST_DESCRIPTORS"
        await dao.run(sql)
        await agent.delete(`/api/skuitems/90000000000000000000000000000002`).then(async (response) => {
            response.should.have.status(204);
        });
        await agent.delete(`/api/skus/1`).then(async (response) => {
            response.should.have.status(204);
        });
    })

})


/*
* ---------------------------------------------
*         API: PUT /api/testResult/:id
* =============================================
*/

describe('modify test result', () => {

    before(async () => {

        await agent.post(`/api/sku`).send(sku).then(function(res){
            res.should.have.status(201);
          });
          await agent.post(`/api/skuitem`).send(skui).then(function(res){
            res.should.have.status(201);
          });

          await agent.post('/api/testDescriptor').send(td).then(function (res) {
              res.should.have.status(201);
          })
        let sql="INSERT INTO TEST_RESULTS(rfid ,idTestDescriptor,Date,Result) VALUES(?,?,?,?)"
        await dao.run(sql,[tst.rfid,tst.idTestDescriptor,tst.Date,tst.Result]);
    });

    //200 
    modifyTestResult('200 return',{rfid:"90000000000000000000000000000002", id: 1},
    {
        newIdTestDescriptor:12,
        newDate:"2021/11/28",
        newResult: true
    },200);

    //404
    modifyTestResult("id doesn't exist",{rfid:"90000000000000000000000000000002", id: 2},
    {
        newIdTestDescriptor:12,
        newDate:"2021/11/28",
        newResult: true
    },422 );

    //422
    modifyTestResult("body format is wrong",{rfid:"90000000000000000000000000000002", id: 1},
    {
        newIdTestDescriptor:"Failure Here",
        newDate:"2021/11/28",
        newResult: true
    }, 422 );

    after(async () => {
        let sql="DELETE FROM TEST_RESULTS"
        await dao.run(sql)
        sql="DELETE FROM TEST_DESCRIPTORS"
        await dao.run(sql)
        await agent.delete(`/api/skuitems/90000000000000000000000000000002`).then(async (response) => {
            response.should.have.status(204);
        });
        await agent.delete(`/api/skus/1`).then(async (response) => {
            response.should.have.status(204);
        });
    });
});






/*
* ---------------------------------------------
*          API: DELETE /api/testResult/:id
* =============================================
*/

describe("delete test result", () => {
    before(async () => {

        await agent.post(`/api/sku`).send(sku).then(function(res){
            res.should.have.status(201);
          });
          await agent.post(`/api/skuitem`).send(skui).then(function(res){
            res.should.have.status(201);
          });
          await agent.post('/api/testDescriptor').send(td).then(function (res) {
            res.should.have.status(201);
         })
            let sql="INSERT INTO TEST_RESULTS(rfid ,idTestDescriptor,Date,Result) VALUES(?,?,?,?)"
            await dao.run(sql,[tst.rfid,tst.idTestDescriptor,tst.Date,tst.Result]);
    });

    //204
    deleteTestResult('204 No Content',{rfid:"90000000000000000000000000000002", id: 1},204);


    after(async() => {
    
        let sql="DELETE FROM TEST_RESULTS"
        await dao.run(sql)
        sql="DELETE FROM TEST_DESCRIPTORS"
        await dao.run(sql)
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

function newTestResult(name, expectedHTTPStatus, tst) {
    it(name, function(done){
           agent.post('/api/skuitems/testResult').send(tst).then( function(res) {
                    res.should.have.status(expectedHTTPStatus);
                });
                done();
    });
}


function getTestResults(testName, params,expectedHTTPStatus) {
    it(testName, function(done){
        agent.get(`/api/skuitems/${params.rfid}/testResults`).then(function(response) {
            response.should.have.status(expectedHTTPStatus);
            response.should.to.be.json;
            response.body.should.be.a('array');
        })
        done();
    });
    
}


function getTestResultById(testName, params, expectedHTTPStatus) {
    it(testName, function (done){
            agent.get(`/api/skuitems/${params.rfid}/testResults/${params.id}`).then(function (response){
            response.should.have.status(expectedHTTPStatus);
            response.should.to.be.json;
        });
        done();
    });
}


function modifyTestResult(testName, params, request, expectedHTTPStatus) {
    it(testName, function(done){
            agent.put(`/api/skuitems/${params.rfid}/testResult/${params.id}`).send(request).then(function(response){
            response.should.have.status(expectedHTTPStatus);
        });
        done();
    });
}



function deleteTestResult(testName, params, expectedHTTPStatus) {
    it(testName, function(done)  {
            agent.delete(`/api/skuitems/${params.rfid}/testResult/${params.id}`).then(function (response) {
            response.should.have.status(expectedHTTPStatus);
        });
        done();
    });

}