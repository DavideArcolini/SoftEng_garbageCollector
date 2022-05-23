const dao = require("../test_DB/mock_dao");
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


//200
getTestResults(1,[{
    id: 1,
    idTestDescriptor: 14,
    Date: "2021/11/29",
    Result: false
}],[{
    id: 1,
    idTestDescriptor: 14,
    Date: "2021/11/29",
    Result: false
}],{rfid: "1"})

//404 rfid doesn't exist
getTestResults(undefined,[], 404, {rfid: "1"})

//200 there aren't result
getTestResults(1,[], 200, {rfid: "1"})

//500
getTestResults(1,1, 500, undefined)


/*
                                ------------------------------------------------------
                                |      GET  /api/skuitems/:rfid/testResults/:id      |
                                ------------------------------------------------------
*/


//200
getTestResultById([1],{
    id: 1,
    idTestDescriptor: 14,
    Date: "2021/11/29",
    Result: false
},{
    id: 1,
    idTestDescriptor: 14,
    Date: "2021/11/29",
    Result: false
},{rfid: "1", id: 1})

//404 rfid doesn't exist
getTestResultById([],{
    id: 1,
    idTestDescriptor: 14,
    Date: "2021/11/29",
    Result: false
},404,{rfid: "1", id: 1})

//404 id doesn't exist
getTestResultById(1,{
    id: 1,
    idTestDescriptor: 14,
    Date: "2021/11/29",
    Result: false
},404, {rfid: "1", id: 0})

//500
getTestResultById(undefined,undefined,500,undefined)

/*
                                ------------------------------------------------------
                                |            POST  /api/skuitems/testResult          |
                                ------------------------------------------------------
*/


//201
createTestResult([1,1],201,201,{
    rfid: "12345678901234567890123456789016",
    idTestDescriptor: 12,
    Date: "2021/11/28",
    Result: true
})

//404 RFID
createTestResult([undefined,1],201,404,{
    rfid: "12345678901234567890123456789016",
    idTestDescriptor: 12,
    Date: "2021/11/28",
    Result: true
})

//404 idTestDescriptor
createTestResult([1,undefined],201,404,{
    rfid: "12345678901234567890123456789016",
    idTestDescriptor: 12,
    Date: "2021/11/28",
    Result: true
})

//503
createTestResult([1,1],201,503,undefined)


/*
                                ------------------------------------------------------
                                |        PUT  api/skuitems/:rfid/testResult/:id      |
                                ------------------------------------------------------
*/

//200
modifyTestResult([1,1],[{
    id: 1,
    idTestDescriptor: 14,
    Date: "2021/11/29",
    Result: false
}],200,200,{id: 1, rfid: "1"},{
    newIdTestDescriptor:12,
    newDate:"2021/11/28",
    newResult: true
})

//404 RFID doesn't exist
modifyTestResult([undefined,1],[{
    id: 1,
    idTestDescriptor: 14,
    Date: "2021/11/29",
    Result: false
}],200,404,{id: 1, rfid: "1"},{
    newIdTestDescriptor:12,
    newDate:"2021/11/28",
    newResult: true
})

//404 idTestDescriptor doesn't exist
modifyTestResult([1,undefined],[{
    id: 1,
    idTestDescriptor: 14,
    Date: "2021/11/29",
    Result: false
}],200,404,{id: 1, rfid: "1"},{
    newIdTestDescriptor:12,
    newDate:"2021/11/28",
    newResult: true
})

//404 RFID doesn't have test result
modifyTestResult([1,1],[],200,404,{id: 1, rfid: "1"},{
    newIdTestDescriptor:12,
    newDate:"2021/11/28",
    newResult: true
})

//404 ID TestResult doesn't exist
modifyTestResult([1,1],[{ 
    id: 0,
    idTestDescriptor: 14,
    Date: "2021/11/29",
    Result: false
}],200,404,{id: 1, rfid: "1"},{
    newIdTestDescriptor:12,
    newDate:"2021/11/28",
    newResult: true
})

//503
modifyTestResult([1,1],[{
    id: 1,
    idTestDescriptor: 14,
    Date: "2021/11/29",
    Result: false
}],200,503,undefined,{
    newIdTestDescriptor:12,
    newDate:"2021/11/28",
    newResult: true
})

/*
                                ------------------------------------------------------
                                |     DELETE  /api/skuitems/:rfid/testResult/:id     |
                                ------------------------------------------------------
*/


//204
deleteTestResult([{
    id: 1,
    idTestDescriptor: 14,
    Date: "2021/11/29",
    Result: false
}],204,204,{id: 1, rfid: "1"})

//404 RFID doesn't exist
deleteTestResult([],204,404,{id: 1, rfid: "1"})

//404 ID doesn't exist
deleteTestResult([],204,404,{id: 0, rfid: "1"})

//503
deleteTestResult([{
    id: 1,
    idTestDescriptor: 14,
    Date: "2021/11/29",
    Result: false
}],204,503,undefined)

/*
                                ======================================================================
                               ||        DEFINITIONS OF THE TESTING FUNCTIONS TEST DESCRIPTOR        ||
                                ======================================================================
*/



function getTestResults(resultget,resultall,expected,rfid) {
    describe('get tests', ()=> { 
        beforeEach(() => {
            dao.all.mockReset();
            dao.all.mockReturnValue(resultall)
            dao.get.mockReset();
            dao.get.mockReturnValue(resultget)
        })
    
        test('get tests', async () => {
            let res = await tr.getTestResults(rfid);
            expect(res).toEqual(expected)
        })
    })
}

function getTestResultById(resultall,resultget,expected,req){
    describe('get test by id', ()=> { 
        beforeEach(() => {
            dao.all.mockReset();
            dao.all.mockReturnValue(resultall)
            dao.get.mockReset();
            dao.get.mockReturnValue(resultget)
        })
    
        test('get test by id', async () => {
            let res = await tr.getTestResultById(req);
            expect(res).toEqual(expected)
        })
    })
}


function createTestResult(resultget,resultrun,expected,req){
    describe('add test', ()=> {
        beforeEach(() => {
            dao.get.mockReset();
            dao.get.mockReturnValueOnce(resultget[0]).mockReturnValue(resultget[1])
            dao.run.mockReset();
            dao.run.mockReturnValueOnce(resultrun);
        })
    
        test('add test', async () => {
            let res = await tr.createTestResult(req);
            expect(res).toEqual(expected)
        })
    })
}

function modifyTestResult(resultget,resultall,resultrun,expected,req1,req2){
    describe('edit test', ()=> { //
        beforeEach(() => {
            dao.get.mockReset();
            dao.get.mockReturnValueOnce(resultget[0]).mockReturnValue(resultget[1])
            dao.all.mockReset();
            dao.all.mockReturnValue(resultall)
            dao.run.mockReset();
            dao.run.mockReturnValueOnce(resultrun)
        })
    
        test('edit test', async () => {
            let res = await tr.modifyTestResult(req1,req2);
            expect(res).toEqual(expected)
        })
    })
}

function deleteTestResult(resultall,resultrun,expected,req){
    describe('delete test', ()=> { //
        beforeEach(() => {
            dao.all.mockReset();
            dao.all.mockReturnValue(resultall)
            dao.run.mockReset();
            dao.run.mockReturnValueOnce(resultrun)
        })
    
        test('delete test', async () => {
            let res = await tr.deleteTestResult(req);
            expect(res).toEqual(expected)
        })
    })
}

