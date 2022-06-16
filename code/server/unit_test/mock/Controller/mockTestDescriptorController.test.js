/**
 *  INTEGRATION TEST: TestDescriptorController
 *           VERSION: mock
 * --------------------------------------------
 * Services do access the database (although it
 * is a test database).
*/

/* --------- IMPORT MODULES --------- */
const TDController         = require('../../../controller/TestDescriptorController');
const skuDAO                = require('../Database/mockSKUDAO');
const testDescriptorDAO    = require('../Database/mockTestDescriptorDAO');

/* --------- INITIALIZATION --------- */
const td         = new TDController(skuDAO, testDescriptorDAO);

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

let getall=[{
    id: 1,
    name: "test descriptor 1",
    procedureDescription: "This test is described by...",
    idSKU: 1
}, {
    id: 2,
    name: "test descriptor 1",
    procedureDescription: "This test is described by...",
    idSKU: 1
}]

let sku={
    id: 1,
    description: "a new sku",
    weight: 100,
    volume: 50,
    notes: "first SKU",
    position: "800234523412",
    availableQuantity: 2,
    price: 10.99,
    testDescriptors: [1, 2, 3]
}

/*
                                ------------------------------------------------------
                                |          GET  /api/testDescriptors                 |
                                ------------------------------------------------------
*/

describe('get test by id', ()=> { 
    beforeAll(() => {
        testDescriptorDAO.getTestDescriptors.mockReset();
        testDescriptorDAO.getTestDescriptors.mockReturnValueOnce(getall).mockImplementationOnce(() => {
            throw new Error();
        })
    })


//200
getTestDescriptors(getall);

})
//500? throw error?
getTestDescriptors("quello che voglio");


/*
                                ------------------------------------------------------
                                |          GET  /api/testDescriptors/:id             |
                                ------------------------------------------------------
*/


describe('get tests', ()=> { 
    beforeAll(() => {
        testDescriptorDAO.getTestDescriptorById.mockReset();
        testDescriptorDAO.getTestDescriptorById.mockReturnValueOnce(getall[0])
        .mockReturnValueOnce(undefined)
        .mockImplementationOnce(() => {
            throw new Error();
        })
    })

//200
getTestDescriptorById({id: 1}, getall[0]);

//404
getTestDescriptorById({id: 1}, ERROR_404);

//500
getTestDescriptorById({id: 1},"yeah");

})

/*
                                ------------------------------------------------------
                                |             POST  /api/testDescriptor              |
                                ------------------------------------------------------
*/

describe('add test', ()=> { 
    beforeAll(() => {
        skuDAO.getSKUByID.mockReset();
        skuDAO.getSKUByID.mockReturnValueOnce(sku).mockReturnValueOnce(undefined).mockImplementationOnce(() => {
            throw new Error();
        });
        testDescriptorDAO.createTestDescriptor.mockReset();
        testDescriptorDAO.createTestDescriptor.mockReturnValueOnce(getall[0]).mockReturnValueOnce(getall[0])
    })

//201
createTestDescriptor(MESSG_201,getall[0]);

//404
createTestDescriptor(ERROR_404,getall[0])

//503
createTestDescriptor("Sono esausto", getall[0]);

})

/*
                                ------------------------------------------------------
                                |            PUT  /api/testDescriptor/:id            |
                                ------------------------------------------------------
*/


describe('edit test', ()=> { 
    beforeAll(() => {
        skuDAO.getSKUByID.mockReset();
        skuDAO.getSKUByID.mockReturnValueOnce(sku).mockReturnValueOnce(undefined).mockReturnValueOnce(sku)
        .mockImplementationOnce(() => {
            throw new Error();
        });
        testDescriptorDAO.getTestDescriptorById.mockReset();
        testDescriptorDAO.getTestDescriptorById.mockReturnValueOnce(getall[0]).mockReturnValueOnce(getall[0]).mockReturnValueOnce(undefined)
        testDescriptorDAO.modifyTestDescriptor.mockReset();
        testDescriptorDAO.modifyTestDescriptor.mockReturnValueOnce(getall[0])
    })


//200
modyfyTestDescriptor(MESSG_200,getall[0],{id: 1})

//404 SKUID doesn't exist
modyfyTestDescriptor(ERROR_404,getall[0],{id: 1})

//404 ID doesn't exist
modyfyTestDescriptor(ERROR_404,getall[0], {id: 1})

//503
modyfyTestDescriptor("yeah",getall[0], {id: 1})
})


/*
                                ------------------------------------------------------
                                |            DELETE  /api/testDescriptor/:id         |
                                ------------------------------------------------------
*/


describe('delete test', ()=> { //
    beforeAll(() => {
        testDescriptorDAO.deleteTestDescriptor.mockReset();
        testDescriptorDAO.deleteTestDescriptor.mockReturnValueOnce("AdoroICani").mockImplementationOnce(() => {
            throw new Error();
        });
    })

//204
deleteTestDescriptor(MESSG_204,{id: 1})

//503
deleteTestDescriptor("Sono esausto",{id: 1})
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
                expect(res).toEqual(expected);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            } 
        })
}

function getTestDescriptors(expected){
    
    
        test('get tests', async () => {
            try {
                let res = await td.getTestDescriptors();
                expect(res).toEqual(expected);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            } 
        })
}

function createTestDescriptor(expected,json){
    

    test('add test', async () => {
        try {
            let res = await td.createTestDescriptor(json);
            expect(res).toEqual(expected);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        } 
    })
}

function modyfyTestDescriptor(expected,json,id){
    
        test('edit test', async () => {
            try {
                let res = await td.modifyTestDescriptor(json,id);
                expect(res).toEqual(expected);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            } 
        })
 
}

function deleteTestDescriptor(expected,id){
    
        test('delete test', async () => {
            try {
                let res = await td.deleteTestDescriptor(id);
                expect(res).toEqual(expected);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }  
        }) 
}