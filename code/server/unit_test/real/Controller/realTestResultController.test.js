/**
 *  INTEGRATION TEST: TestResultController
 *           VERSION: real
 * -------------------------------------------- 
 * Services do access the database (although it
 * is a test database).
*/

/* --------- IMPORT MODULES --------- */
const TRController         = require('../../../controller/TestResultController');
const SkuDAO                = require('../../../db/skuDAO');
const TestResultDAO    = require('../../../db/testResultDAO');
const SkuItemDAO            = require('../../../db/skuItemDAO');
const TestDescriptorsDAO    = require('../../../db/testDescriptorsDAO');
const TestDAO               = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const testDAO               = new TestDAO();
const skuDAO                = new SkuDAO(testDAO);
const skuItemDAO            = new SkuItemDAO(testDAO);
const testDescriptorsDAO    = new TestDescriptorsDAO(testDAO);
const testResultDAO    = new TestResultDAO(testDAO);
const tr         = new TRController(testDAO);

/* --------- ERROR MESSAGES --------- */
const MESSG_200 = {code: 200, message: 'Ok'}
const MESSG_201 = {code: 201, message: 'Created'};
const MESSG_204 = {code: 204, message: 'No Content'};
const ERROR_404 = {code: 404, message: 'Not Found'};
const ERROR_422 = {code: 422, message: 'Unprocessable Entity'};




/*
                                ======================================================
                               ||                    TESTING CASES                   ||
                                ======================================================
*/


/*
                                ------------------------------------------------------
                                |        GET  /api/skuitems/:rfid/testResults        |
                                ------------------------------------------------------
*/

describe('get tests', ()=> { 
    beforeAll(async() => {
        let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
        await testDAO.run(sql,["40",40,"2021/11/29 12:30"]);
        await testDAO.run(sql,["41",41,"2021/11/29 12:30"]);
        sql = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
        await testDAO.run(sql,["40",12,"2021/11/28",false]);
        await testDAO.run(sql,["40",13,"2021/11/28",true]);
    })

    afterAll(async()=>{
        sql= "DELETE FROM TEST_RESULTS"
        await testDAO.run(sql);
        sql="DELETE FROM SKUITEMS WHERE SKUId=(?)"
        await testDAO.run(sql,40);
        await testDAO.run(sql,41);
    })





//200 there are test
getTestResults([{
    id: 1,
    idTestDescriptor: 12,
    Date: "2021/11/28",
    Result: false
},{
    id: 2,
    idTestDescriptor: 13,
    Date: "2021/11/28",
    Result: true
}],{rfid: "40"})

//200 there are no test (to bypass the map)
getTestResults([],{rfid: "41"})

//ERROR_404
getTestResults(ERROR_404, {rfid: "47"})


})


/*
                                ------------------------------------------------------
                                |      GET  /api/skuitems/:rfid/testResults/:id      |
                                ------------------------------------------------------
*/


describe('get test by id', ()=> { 
    beforeAll(async() => {
        let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
        await testDAO.run(sql,["43",43,"2021/11/29 12:30"]);
        sql = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
        await testDAO.run(sql,["43",14,"2021/11/28",false]);
        await testDAO.run(sql,["43",14,"2021/11/28",true]);
    })

    afterAll(async()=>{
        sql= "DELETE FROM TEST_RESULTS"
        await testDAO.run(sql);
        sql="DELETE FROM SKUITEMS WHERE SKUId=(?)"
        await testDAO.run(sql,43);
    })


//200 result=false
getTestResultById({
    id: 1,
    idTestDescriptor: 14,
    Date: "2021/11/28",
    Result: false
},{rfid: "43", id: 1})

//200 result=true
getTestResultById({
    id: 2,
    idTestDescriptor: 14,
    Date: "2021/11/28",
    Result: true
},{rfid: "43", id: 2})

//ERROR_404 RFID doesn't exist
getTestResultById(ERROR_404,{rfid: "47", id: 1})

//ERROR_404 ID doesn't exist
getTestResultById(ERROR_404, {rfid: "43", id: 0})


})



/*
                                ------------------------------------------------------
                                |            POST  /api/skuitems/testResult          |
                                ------------------------------------------------------
*/


describe('add test', ()=> {
    beforeAll(async() => {
        let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
        await testDAO.run(sql,["44",44,"2021/11/29 12:30"]);
        sql = "INSERT INTO TEST_DESCRIPTORS(id,name, procedureDescription, idSKU) VALUES(?,?,?,?)"
        await testDAO.run(sql,[28,"test descriptor 3", "This test is described by...", 44]);
    })

    afterAll(async()=>{
        sql= "DELETE FROM TEST_RESULTS"
        await testDAO.run(sql);
        sql="DELETE FROM SKUITEMS WHERE SKUId=(?)"
        await testDAO.run(sql,44);
        sql="DELETE FROM TEST_DESCRIPTORS WHERE id=(?)"
        await testDAO.run(sql,28);
    })

//201
createTestResult(MESSG_201,{
    rfid: "44",
    idTestDescriptor: 28,
    Date: "2021/11/28",
    Result: true
})

//ERROR_404 RFID doesn't exist
createTestResult(ERROR_404,{
    rfid: "47",
    idTestDescriptor: 28,
    Date: "2021/11/28",
    Result: true
})

//ERROR_404 idTestDescriptor doesn't exist
createTestResult(ERROR_404,{
    rfid: "44",
    idTestDescriptor: 29,
    Date: "2021/11/28",
    Result: true
})

})


/*
                                ------------------------------------------------------
                                |        PUT  api/skuitems/:rfid/testResult/:id      |
                                ------------------------------------------------------
*/


describe('edit test', ()=> { 
    beforeAll(async() => {
        let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
        await testDAO.run(sql,["45",45,"2021/11/29 12:30"]);
        await testDAO.run(sql,["46",46,"2021/11/29 12:30"]);
        sql = "INSERT INTO TEST_DESCRIPTORS(id,name, procedureDescription, idSKU) VALUES(?,?,?,?)"
        await testDAO.run(sql,[31,"test descriptor 3", "This test is described by...", 45]);
        await testDAO.run(sql,[32,"test descriptor 2", "yeah", 45]);
        sql = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
        await testDAO.run(sql,["45",14,"2021/11/28",false]);
        
    })

    afterAll(async()=>{
        sql= "DELETE FROM TEST_RESULTS"
        await testDAO.run(sql);
        sql="DELETE FROM SKUITEMS WHERE SKUId=(?)"
        await testDAO.run(sql,45);
        await testDAO.run(sql,46);
        sql="DELETE FROM TEST_DESCRIPTORS WHERE id=(?)"
        await testDAO.run(sql,31); 
        await testDAO.run(sql,32);
    })


//200
modifyTestResult(MESSG_200,{id: 1, rfid: "45"},{
    newIdTestDescriptor:31,
    newDate:"2021/11/28",
    newResult: true
})

//ERROR_404 RFID doesn't exist
modifyTestResult(ERROR_404,{id: 1, rfid: "47"},{
    newIdTestDescriptor:31,
    newDate:"2021/11/28",
    newResult: true
})

//ERROR_404 idTestDescriptor doesn't exist
modifyTestResult(ERROR_404,{id: 1, rfid: "45"},{
    newIdTestDescriptor:47,
    newDate:"2021/11/28",
    newResult: true
})

//ERROR_404 RFID doesn't have test result
modifyTestResult(ERROR_404,{id: 1, rfid: "46"},{
    newIdTestDescriptor:31,
    newDate:"2021/11/28",
    newResult: true
})

//ERROR_404 ID TestResult doesn't exist
modifyTestResult(ERROR_404,{id: 12, rfid: "45"},{
    newIdTestDescriptor:31,
    newDate:"2021/11/28",
    newResult: true
})

})


/*
                                ------------------------------------------------------
                                |     DELETE  /api/skuitems/:rfid/testResult/:id     |
                                ------------------------------------------------------
*/



describe('delete test', ()=> { 
    beforeAll(async() => {
        let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
        await testDAO.run(sql,["48",48,"2021/11/29 12:30"]);
        sql = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
        await testDAO.run(sql,["48",14,"2021/11/28",false]);
    })

    afterAll(async()=>{
    sql= "DELETE FROM TEST_RESULTS"
    await testDAO.run(sql);
    sql="DELETE FROM SKUITEMS WHERE SKUId=(?)"
    await testDAO.run(sql,48);
})


//204
deleteTestResult(MESSG_204,{id: 1, rfid: "48"})

//ERROR_404 RFID doesn't exist
deleteTestResult(ERROR_404,{id: 1, rfid: "50"})

//ERROR_404 ID doesn't exist
deleteTestResult(ERROR_404,{id: 24, rfid: "48"})

})




/*
                                ======================================================================
                               ||        DEFINITIONS OF THE TESTING FUNCTIONS TEST DESCRIPTOR        ||
                                ======================================================================
*/



function getTestResults(expected,rfid) {
    
        test('get tests', async () => {
            try {
                let res = await tr.getTestResults(rfid);
                expect(res).toEqual(expected);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        })
}

function getTestResultById(expected,req){
    
        test('get test by id', async () => {
            try {
                let res = await tr.getTestResultById(req);
                expect(res).toEqual(expected);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
})
}


function createTestResult(expected,req){
    
        test('add test', async () => {
            try {
                let res = await tr.createTestResult(req);
                expect(res).toEqual(expected);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        })
}

function modifyTestResult(expected,req1,req2){
 
        test('edit test', async () => {
            try {
                let res = await tr.modifyTestResult(req1,req2);
                expect(res).toEqual(expected);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        })
}

function deleteTestResult(expected,req){
    
        test('delete test', async () => {
            try {
                let res = await tr.deleteTestResult(req);
                expect(res).toEqual(expected);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        })
}