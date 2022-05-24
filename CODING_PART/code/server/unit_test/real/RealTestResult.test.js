const DAO = require("../test_DB/TestDAO");
const dao= new DAO();
const TestResultController = require("../../controller/TestResultController");
const tr = new TestResultController(dao);



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
        await dao.run(sql,["40",40,"2021/11/29 12:30"]);
        await dao.run(sql,["41",41,"2021/11/29 12:30"]);
        sql = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
        await dao.run(sql,["40",12,"2021/11/28",false]);
        await dao.run(sql,["40",13,"2021/11/28",true]);
    })

    afterAll(async()=>{
        sql= "DELETE FROM TEST_RESULTS"
        await dao.run(sql);
        sql="DELETE FROM SKUITEMS WHERE SKUId=(?)"
        await dao.run(sql,40);
        await dao.run(sql,41);
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

//404
getTestResults(404, {rfid: "47"})

//500
getTestResults(500, undefined)

})


/*
                                ------------------------------------------------------
                                |      GET  /api/skuitems/:rfid/testResults/:id      |
                                ------------------------------------------------------
*/


describe('get test by id', ()=> { 
    beforeAll(async() => {
        let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
        await dao.run(sql,["43",43,"2021/11/29 12:30"]);
        sql = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
        await dao.run(sql,["43",14,"2021/11/28",false]);
        await dao.run(sql,["43",14,"2021/11/28",true]);
    })

    afterAll(async()=>{
        sql= "DELETE FROM TEST_RESULTS"
        await dao.run(sql);
        sql="DELETE FROM SKUITEMS WHERE SKUId=(?)"
        await dao.run(sql,43);
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

//404 RFID doesn't exist
getTestResultById(404,{rfid: "47", id: 1})

//404 ID doesn't exist
getTestResultById(404, {rfid: "43", id: 0})

//500
getTestResultById(500,undefined)

})



/*
                                ------------------------------------------------------
                                |            POST  /api/skuitems/testResult          |
                                ------------------------------------------------------
*/


describe('add test', ()=> {
    beforeAll(async() => {
        let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
        await dao.run(sql,["44",44,"2021/11/29 12:30"]);
        sql = "INSERT INTO TEST_DESCRIPTORS(id,name, procedureDescription, idSKU) VALUES(?,?,?,?)"
        await dao.run(sql,[28,"test descriptor 3", "This test is described by...", 44]);
    })

    afterAll(async()=>{
        sql= "DELETE FROM TEST_RESULTS"
        await dao.run(sql);
        sql="DELETE FROM SKUITEMS WHERE SKUId=(?)"
        await dao.run(sql,44);
        sql="DELETE FROM TEST_DESCRIPTORS WHERE id=(?)"
        await dao.run(sql,28);
    })

//201
createTestResult(201,{
    rfid: "44",
    idTestDescriptor: 28,
    Date: "2021/11/28",
    Result: true
})

//404 RFID doesn't exist
createTestResult(404,{
    rfid: "47",
    idTestDescriptor: 28,
    Date: "2021/11/28",
    Result: true
})

//404 idTestDescriptor doesn't exist
createTestResult(404,{
    rfid: "44",
    idTestDescriptor: 29,
    Date: "2021/11/28",
    Result: true
})

//503
createTestResult(503,undefined)
})


/*
                                ------------------------------------------------------
                                |        PUT  api/skuitems/:rfid/testResult/:id      |
                                ------------------------------------------------------
*/


describe('edit test', ()=> { 
    beforeAll(async() => {
        let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
        await dao.run(sql,["45",45,"2021/11/29 12:30"]);
        await dao.run(sql,["46",46,"2021/11/29 12:30"]);
        sql = "INSERT INTO TEST_DESCRIPTORS(id,name, procedureDescription, idSKU) VALUES(?,?,?,?)"
        await dao.run(sql,[31,"test descriptor 3", "This test is described by...", 45]);
        await dao.run(sql,[32,"test descriptor 2", "yeah", 45]);
        sql = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
        await dao.run(sql,["45",14,"2021/11/28",false]);
        
    })

    afterAll(async()=>{
        sql= "DELETE FROM TEST_RESULTS"
        await dao.run(sql);
        sql="DELETE FROM SKUITEMS WHERE SKUId=(?)"
        await dao.run(sql,45);
        await dao.run(sql,46);
        sql="DELETE FROM TEST_DESCRIPTORS WHERE id=(?)"
        await dao.run(sql,31); 
        await dao.run(sql,32);
    })


//200
modifyTestResult(200,{id: 1, rfid: "45"},{
    newIdTestDescriptor:31,
    newDate:"2021/11/28",
    newResult: true
})

//404 RFID doesn't exist
modifyTestResult(404,{id: 1, rfid: "47"},{
    newIdTestDescriptor:31,
    newDate:"2021/11/28",
    newResult: true
})

//404 idTestDescriptor doesn't exist
modifyTestResult(404,{id: 1, rfid: "45"},{
    newIdTestDescriptor:47,
    newDate:"2021/11/28",
    newResult: true
})

//404 RFID doesn't have test result
modifyTestResult(404,{id: 1, rfid: "46"},{
    newIdTestDescriptor:31,
    newDate:"2021/11/28",
    newResult: true
})

//404 ID TestResult doesn't exist
modifyTestResult(404,{id: 12, rfid: "45"},{
    newIdTestDescriptor:31,
    newDate:"2021/11/28",
    newResult: true
})

//503
modifyTestResult(503,undefined,{
    newIdTestDescriptor:2,
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
        let sql = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
        await dao.run(sql,["1",14,"2021/11/28",false]);
    })


//204
deleteTestResult(204,{id: 1, rfid: "1"})

//404 RFID doesn't exist
deleteTestResult(404,{id: 1, rfid: "2"})

//404 ID doesn't exist
deleteTestResult(404,{id: 24, rfid: "1"})

//503
deleteTestResult(503,undefined)
})



/*
                                ======================================================================
                               ||        DEFINITIONS OF THE TESTING FUNCTIONS TEST DESCRIPTOR        ||
                                ======================================================================
*/



function getTestResults(expected,rfid) {
    
        test('get tests', async () => {
            let res = await tr.getTestResults(rfid);
            expect(res).toEqual(expected)
        })
}

function getTestResultById(expected,req){
    
        test('get test by id', async () => {
            let res = await tr.getTestResultById(req);
            expect(res).toEqual(expected)
})
}


function createTestResult(expected,req){
    
        test('add test', async () => {
            let res = await tr.createTestResult(req);
            expect(res).toEqual(expected)
        })
}

function modifyTestResult(expected,req1,req2){
 
        test('edit test', async () => {
            let res = await tr.modifyTestResult(req1,req2);
            expect(res).toEqual(expected)
        })
}

function deleteTestResult(expected,req){
    
        test('delete test', async () => {
            let res = await tr.deleteTestResult(req);
            expect(res).toEqual(expected)
        })
}