/**
 *  UNIT TEST: TestDescriptorDAO
 */

/* --------- IMPORT MODULES --------- */
const TDDAO    = require('../../../db/testDescriptorsDAO');
const mockDAO   = require('../Database/mockDAO');

/* --------- INITIALIZATION --------- */
const td = new TDDAO(mockDAO);



/*
                                ======================================================
                               ||                    TESTING CASES                   ||
                                ======================================================
*/


/*
                                ------------------------------------------------------
                                |          GET  /api/testDescriptors                 |
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

//500? throw error?
getTestDescriptors("error");
})


/*
                                ------------------------------------------------------
                                |          GET  /api/testDescriptors/:id             |
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
getTestDescriptorById(1,"error");

})
/*
                                ------------------------------------------------------
                                |             POST  /api/testDescriptor              |
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
createTestDescriptor("error",1)
})

/*
                                ------------------------------------------------------
                                |            PUT  /api/testDescriptor/:id            |
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
modyfyTestDescriptor("error",1,1)
})


/*
                                ------------------------------------------------------
                                |            DELETE  /api/testDescriptor/:id         |
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
deleteTestDescriptor("error",1)
})

/*
                                ------------------------------------------------------
                                |                   getTDIDbySKUid                   |
                                ------------------------------------------------------
*/

describe('search test', ()=> { //
    beforeAll(() => {
        mockDAO.all.mockReset();
        mockDAO.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "testError"});
            });
        })
    })

//503
getTDIDbySKUid("error",1)
})


/*
                                ======================================================================
                               ||        DEFINITIONS OF THE TESTING FUNCTIONS TEST DESCRIPTOR        ||
                                ======================================================================
*/

function getTestDescriptorById(id,expected){
    
        test('get test by id', async () => {
            try {
                let res = await td.getTestDescriptorById(id);
                expect(res).toEqual(expected)
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        })
    
}

function getTestDescriptors(expected){
    
    
        test('get tests', async () => {
            try {
                let res = await td.getTestDescriptors();
                expect(res).toEqual(expected)
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        })
    
}

function createTestDescriptor(expected,json){
   
    test('add test', async () => {
        try {
            let res = await td.createTestDescriptor(json);
            expect(res).toEqual(expected)
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
})}

function modyfyTestDescriptor(expected,json,id){
    
    
        test('edit test', async () => {
            try {
                let res = await td.modifyTestDescriptor(json,id);
                expect(res).toEqual(expected)
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        })
}

function deleteTestDescriptor(expected,id){
    
        test('delete test', async () => {
            try {
                let res = await td.deleteTestDescriptor(id);
                expect(res).toEqual(expected)
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        })
    
}

function getTDIDbySKUid(expected,id){
    
    test('delete test', async () => {
        try {
            let res = await td.getTDIDbySKUid(id);
            expect(res).toEqual(expected)
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    })

}