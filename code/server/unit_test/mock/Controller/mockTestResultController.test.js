/**
 *  INTEGRATION TEST: TestResultController
 *           VERSION: mock
 * --------------------------------------------
 * Services do access the database (although it
 * is a test database).
*/

/* --------- IMPORT MODULES --------- */
const TDController         = require('../../../controller/TestResultController');
const skuDAO                = require('../Database/mockSKUDAO');
const testResultDAO    = require('../Database/mockTestResultDAO');
const skuItemDAO            = require('../Database/mockSkuItemDAO');
const testDescriptorDAO    = require('../Database/mockTestDescriptorDAO');

/* --------- INITIALIZATION --------- */
const tr         = new TDController(skuDAO, skuItemDAO,testDescriptorDAO,testResultDAO);

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

let trar=[{
    id: 1,
    idTestDescriptor: 14,
    Date: "2021/11/29",
    Result: 0
},{
    id: 1,
    idTestDescriptor: 14,
    Date: "2021/11/29",
    Result: 1
}];
/*
                                ------------------------------------------------------
                                |        GET  /api/skuitems/:rfid/testResults        |
                                ------------------------------------------------------
*/

describe('get tests', ()=> { 
    beforeAll(() => {
        skuItemDAO.getSKUitemByRFID.mockReset();
        skuItemDAO.getSKUitemByRFID.mockReturnValueOnce("skuitem").mockReturnValueOnce(undefined).mockReturnValueOnce("skuitem").mockImplementationOnce(() => {
            throw new Error();
        })
        testResultDAO.getTestResults.mockReset();
        testResultDAO.getTestResults.mockReturnValueOnce(trar).mockReturnValueOnce([]);
    })
//200
getTestResults(trar,{rfid: "1"})

//404 rfid doesn't exist
getTestResults(ERROR_404,{rfid: "1"})

//200 there aren't result
getTestResults([], {rfid: "1"})

//500
getTestResults("Non ho piu forze", {rfid: "1"})

})
/*
                                ------------------------------------------------------
                                |      GET  /api/skuitems/:rfid/testResults/:id      |
                                ------------------------------------------------------
*/


describe('get test by id', ()=> { 
    beforeAll(() => {
        skuItemDAO.getSKUitemByRFID.mockReset();
        skuItemDAO.getSKUitemByRFID.mockReturnValueOnce(trar[0]).mockReturnValueOnce(trar[0]).mockReturnValueOnce(undefined)
        .mockReturnValueOnce(trar[0]).mockImplementationOnce(() => {
            throw new Error();
        })
        testResultDAO.getTestResultById.mockReset();
        testResultDAO.getTestResultById.mockReturnValueOnce(trar[0]).mockReturnValueOnce(trar[1]).mockReturnValueOnce(undefined)
    })

//200 true
getTestResultById(1,{rfid: "1", id: 1})

//200 false
getTestResultById(1,{rfid: "1", id: 1})

//404 rfid doesn't exist
getTestResultById(ERROR_404,{rfid: "1", id: 1})

//404 id doesn't exist
getTestResultById(ERROR_404, {rfid: "1", id: 0})

//500
getTestResultById("Succo di frutta!", {rfid: "1", id: 0})

})

/*
                                ------------------------------------------------------
                                |            POST  /api/skuitems/testResult          |
                                ------------------------------------------------------
*/

describe('add test', ()=> {
    beforeAll(() => {
        skuItemDAO.getSKUitemByRFID.mockReset();
        skuItemDAO.getSKUitemByRFID.mockReturnValueOnce(trar[0]).mockReturnValue(undefined).mockReturnValueOnce(trar[0])
        .mockReturnValueOnce(trar[0]).mockImplementationOnce(() => {
            throw new Error();
        })
        testDescriptorDAO.getTestDescriptorById.mockReset();
        testDescriptorDAO.getTestDescriptorById.mockReturnValueOnce(trar[0]).mockReturnValueOnce(undefined);
        testResultDAO.createTestResult.mockReset();
        testResultDAO.createTestResult.mockReturnValueOnce(trar[0]);
    })

//201
createTestResult(MESSG_201,trar[0]);

//404 RFID
createTestResult(ERROR_404,trar[0])

//404 idTestDescriptor
createTestResult(ERROR_404,trar[0]);

//503
createTestResult([1,1],201,503,undefined)
})


/*
                                ------------------------------------------------------
                                |        PUT  api/skuitems/:rfid/testResult/:id      |
                                ------------------------------------------------------
*/


describe('edit test', ()=> { //
        beforeAll(() => {
            skuItemDAO.getSKUitemByRFID.mockReset();
            skuItemDAO.getSKUitemByRFID.mockReturnValueOnce(trar[0]).mockReturnValueOnce(undefined).mockReturnValue(trar[0])
            .mockReturnValueOnce(trar[0]).mockImplementationOnce(() => {
                throw new Error();
            })
            testDescriptorDAO.getTestDescriptorById.mockReset();
            testDescriptorDAO.getTestDescriptorById.mockReturnValueOnce(trar[0]).mockReturnValueOnce(undefined).mockReturnValueOnce(trar[0])
            testResultDAO.getTestResultById.mockReset();
            testResultDAO.getTestResultById.mockReturnValueOnce(trar[0]).mockReturnValueOnce(undefined)
            testDescriptorDAO.modifyTestDescriptor.mockReset();
            testDescriptorDAO.modifyTestDescriptor.mockReturnValueOnce(trar[0])
        })
    

//200
modifyTestResult(200,{id: 1, rfid: "1"},trar[0])

//404 RFID doesn't exist
modifyTestResult(ERROR_404,{id: 1, rfid: "1"},trar[0])

//404 idTestDescriptor doesn't exist
modifyTestResult(ERROR_404,{id: 1, rfid: "1"},trar[0])

//404 RFID doesn't have test result
modifyTestResult(ERROR_404,{id: 1, rfid: "1"},trar[0])

//404 ID TestResult doesn't exist
modifyTestResult(ERROR_404,{id: 1, rfid: "1"},trar[0])

//503
modifyTestResult("ERROREEEE",{id: 1, rfid: "1"},trar[0])
})

/*
                                ------------------------------------------------------
                                |     DELETE  /api/skuitems/:rfid/testResult/:id     |
                                ------------------------------------------------------
*/


describe('delete test', ()=> { //
        beforeAll(() => {
            skuItemDAO.getSKUitemByRFID.mockReset();
            skuItemDAO.getSKUitemByRFID.mockReturnValueOnce(trar[0]).mockReturnValueOnce(undefined)
            .mockReturnValueOnce(trar[0]).mockImplementationOnce(() => {
                throw new Error();
            })
            testResultDAO.deleteTestResult.mockReset();
            testResultDAO.deleteTestResult.mockReturnValueOnce(trar[0])
        })
//204
deleteTestResult(MESSG_204,{id: 1, rfid: "1"})

//404 RFID doesn't exist
deleteTestResult(ERROR_404,{id: 1, rfid: "1"})

//404 ID doesn't exist
deleteTestResult(ERROR_404,{id: 1, rfid: "1"})

//503
deleteTestResult("Viva la birra",{id: 1, rfid: "1"})
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

