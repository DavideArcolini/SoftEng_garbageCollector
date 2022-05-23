const DAO = require("./mockDB/testDao");
const dao= new DAO();
const TestResultController = require("../controller/TestResultController");
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


//200 there are test
getTestResults([{
    id: 1,
    idTestDescriptor: 12,
    Date: "2021/11/28",
    Result: false
},{
    id: 2,
    idTestDescriptor: 12,
    Date: "2021/11/28",
    Result: true
}],{rfid: "1"})

//200 there are no test
getTestResults([],{rfid: "2"})

//404
getTestResults(404, {rfid: "3"})

//500
getTestResults(500, undefined)


/*
                                ------------------------------------------------------
                                |      GET  /api/skuitems/:rfid/testResults/:id      |
                                ------------------------------------------------------
*/


//200 result=false
getTestResultById({
    id: 1,
    idTestDescriptor: 14,
    Date: "2021/11/28",
    Result: false
},{rfid: "1", id: 1})

//200 result=true
getTestResultById({
    id: 2,
    idTestDescriptor: 14,
    Date: "2021/11/28",
    Result: true
},{rfid: "1", id: 2})

//404 RFID doesn't exist
getTestResultById(404,{rfid: "2", id: 1})

//404 ID doesn't exist
getTestResultById(404, {rfid: "1", id: 0})

//500
getTestResultById(500,undefined)


/*
                                ------------------------------------------------------
                                |            POST  /api/skuitems/testResult          |
                                ------------------------------------------------------
*/


//201
createTestResult(201,{
    rfid: "1",
    idTestDescriptor: 1,
    Date: "2021/11/28",
    Result: true
})

//404 RFID doesn't exist
createTestResult(404,{
    rfid: "2",
    idTestDescriptor: 1,
    Date: "2021/11/28",
    Result: true
})

//404 idTestDescriptor doesn't exist
createTestResult(404,{
    rfid: "1",
    idTestDescriptor: 12,
    Date: "2021/11/28",
    Result: true
})

//503
createTestResult(503,undefined)


/*
                                ------------------------------------------------------
                                |        PUT  api/skuitems/:rfid/testResult/:id      |
                                ------------------------------------------------------
*/

//200
modifyTestResult(200,{id: 1, rfid: "1"},{
    newIdTestDescriptor:2,
    newDate:"2021/11/28",
    newResult: true
})

//404 RFID doesn't exist
modifyTestResult(404,{id: 1, rfid: "0"},{
    newIdTestDescriptor:2,
    newDate:"2021/11/28",
    newResult: true
})

//404 idTestDescriptor doesn't exist
modifyTestResult(404,{id: 1, rfid: "1"},{
    newIdTestDescriptor:5,
    newDate:"2021/11/28",
    newResult: true
})

//404 RFID doesn't have test result
modifyTestResult(404,{id: 1, rfid: "2"},{
    newIdTestDescriptor:2,
    newDate:"2021/11/28",
    newResult: true
})

//404 ID TestResult doesn't exist
modifyTestResult(404,{id: 12, rfid: "1"},{
    newIdTestDescriptor:2,
    newDate:"2021/11/28",
    newResult: true
})

//503
modifyTestResult(503,undefined,{
    newIdTestDescriptor:2,
    newDate:"2021/11/28",
    newResult: true
})


/*
                                ------------------------------------------------------
                                |     DELETE  /api/skuitems/:rfid/testResult/:id     |
                                ------------------------------------------------------
*/


//204
deleteTestResult(204,{id: 1, rfid: "1"})

//404 RFID doesn't exist
deleteTestResult(404,{id: 1, rfid: "2"})

//404 ID doesn't exist
deleteTestResult(404,{id: 24, rfid: "1"})

//503
deleteTestResult(503,undefined)




/*
                                ======================================================================
                               ||        DEFINITIONS OF THE TESTING FUNCTIONS TEST DESCRIPTOR        ||
                                ======================================================================
*/



function getTestResults(expected,rfid) {
    describe('get tests', ()=> { 
        beforeEach(async() => {
            await dao.dropTableSKUItems();
            await dao.newTableSKUItems();
            await dao.dropTableTR();
            await dao.newTableTR();
            let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
            await dao.run(sql,["1",1,"2021/11/29 12:30"]);
            sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
            await dao.run(sql,["2",1,"2021/11/29 12:30"]);
            sql = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
            await dao.run(sql,["1",12,"2021/11/28",false]);
            sql = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
            await dao.run(sql,["1",12,"2021/11/28",true]);
        })
    
        test('get tests', async () => {
            let res = await tr.getTestResults(rfid);
            expect(res).toEqual(expected)
        })
    })
}

function getTestResultById(expected,req){
    describe('get test by id', ()=> { 
        beforeEach(async() => {
            await dao.dropTableSKUItems();
            await dao.newTableSKUItems();
            await dao.dropTableTR();
            await dao.newTableTR();
            let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
            await dao.run(sql,["1",1,"2021/11/29 12:30"]);
            sql = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
            await dao.run(sql,["1",14,"2021/11/28",false]);
            sql = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
            await dao.run(sql,["1",14,"2021/11/28",true]);
        })
    
        test('get test by id', async () => {
            let res = await tr.getTestResultById(req);
            expect(res).toEqual(expected)
        })
    })
}


function createTestResult(expected,req){
    describe('add test', ()=> {
        beforeEach(async() => {
            await dao.dropTableSKUItems();
            await dao.newTableSKUItems();
            await dao.dropTableTR();
            await dao.newTableTR();
            let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
            await dao.run(sql,["1",1,"2021/11/29 12:30"]);
            await dao.dropTableTD();
            await dao.newTableTD();
            sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)"
            await dao.run(sql,["test descriptor 3", "This test is described by...", 1]);
        })
    
        test('add test', async () => {
            let res = await tr.createTestResult(req);
            expect(res).toEqual(expected)
        })
    })
}

function modifyTestResult(expected,req1,req2){
    describe('edit test', ()=> { 
        beforeEach(async() => {
            await dao.dropTableSKUItems();
            await dao.newTableSKUItems();
            await dao.dropTableTR();
            await dao.newTableTR();
            let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
            await dao.run(sql,["1",1,"2021/11/29 12:30"]);
            sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
            await dao.run(sql,["2",1,"2021/11/29 12:30"]);
            await dao.dropTableTD();
            await dao.newTableTD();
            sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)"
            await dao.run(sql,["test descriptor 3", "This test is described by...", 1]);
            sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)"
            await dao.run(sql,["test descriptor 2", "yeah", 1]);
            sql = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
            await dao.run(sql,["1",14,"2021/11/28",false]);
            
        })
    
        test('edit test', async () => {
            let res = await tr.modifyTestResult(req1,req2);
            expect(res).toEqual(expected)
        })
    })
}

function deleteTestResult(expected,req){
    describe('delete test', ()=> { 
        beforeEach(async() => {
            await dao.dropTableTR();
            await dao.newTableTR();
            let sql = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
            await dao.run(sql,["1",14,"2021/11/28",false]);
        })
    
        test('delete test', async () => {
            let res = await tr.deleteTestResult(req);
            expect(res).toEqual(expected)
        })
    })
}