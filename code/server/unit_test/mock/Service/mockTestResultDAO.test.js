/**
 *  UNIT TEST: TestResultDAO
 */

/* --------- IMPORT MODULES --------- */
const TRDAO    = require('../../../db/testResultDAO');
const mockDAO   = require('../Database/mockDAO');

/* --------- INITIALIZATION --------- */
const tr = new TRDAO(mockDAO);

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
    beforeAll(() => {
        mockDAO.all.mockReset();
        mockDAO.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "testError"});
            });
        });


    })

 
//500
getTestResults("error",1)
})


/*
                                ------------------------------------------------------
                                |      GET  /api/skuitems/:rfid/testResults/:id      |
                                ------------------------------------------------------
*/

describe('get test by id', ()=> { 
    beforeAll(() => {
        mockDAO.get.mockReset();
        mockDAO.get.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "testError"});
            });
        })
})

//500
getTestResultById("error",1,1)
})

/*
                                ------------------------------------------------------
                                |            POST  /api/skuitems/testResult          |
                                ------------------------------------------------------
*/

describe('add test', ()=> { 
    beforeAll(() => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "testError"});
            });
        })
    })

//503
createTestResult("error",{rfid:1,idTestDescriptor:1,Date:1,Result:1})
})


/*
                                ------------------------------------------------------
                                |        PUT  api/skuitems/:rfid/testResult/:id      |
                                ------------------------------------------------------
*/


describe('edit test', ()=> { 
    beforeAll(() => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "testError"});
            });
        })
    })

//503
modifyTestResult("error",1,{rfid:1,idTestDescriptor:1,Date:1,Result:1})
})

/*
                                ------------------------------------------------------
                                |     DELETE  /api/skuitems/:rfid/testResult/:id     |
                                ------------------------------------------------------
*/
describe('delete test', ()=> { //
    beforeAll(() => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "testError"});
            });
        })
    })


//503
deleteTestResult("error",1,1)
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
                expect(res).toEqual(expected)
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        })
}

function getTestResultById(expected,rfid,id){

        test('get test by id', async () => {
            try {
                let res = await tr.getTestResultById(rfid,id);
                expect(res).toEqual(expected)
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
    })
}


function createTestResult(expected,json){

        test('add test', async () => {
            try {
                let res = await tr.createTestResult(json);
                expect(res).toEqual(expected)
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
    })
}

function modifyTestResult(expected,id,json){

        test('edit test', async () => {
            try {
                let res = await tr.modifyTestResult(id,json);
                expect(res).toEqual(expected)
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
    })
}

function deleteTestResult(expected,id,rfid){

        test('delete test', async () => {
            try {
                let res = await tr.deleteTestResult(id,rfid);
                expect(res).toEqual(expected)
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
    })
}