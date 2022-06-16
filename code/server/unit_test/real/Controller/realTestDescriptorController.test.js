/**
 *  INTEGRATION TEST: TestDescriptorController
 *           VERSION: real
 * --------------------------------------------
 * Services do access the database (although it
 * is a test database).
*/

/* --------- IMPORT MODULES --------- */
const TDController         = require('../../../controller/TestDescriptorController');
const SkuDAO                = require('../../../db/skuDAO');
const TestDescriptorsDAO    = require('../../../db/testDescriptorsDAO');
const TestDAO               = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const testDAO               = new TestDAO();
const skuDAO                = new SkuDAO(testDAO);
const testDescriptorsDAO    = new TestDescriptorsDAO(testDAO);
const td         = new TDController(testDAO);

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
                                |          GET  /api/testDescriptors                 |
                                ------------------------------------------------------
*/



describe('get tests descriptor', ()=> { 
    beforeAll(async() => {
        let sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)"
        await testDAO.run(sql,["test descriptor 3", "This test is described by...", 1]);
        await testDAO.run(sql,["test descriptor 4", "test2", 1]);
    })


    afterAll(async() => {
        sql = "DELETE FROM TEST_DESCRIPTORS"
        await testDAO.run(sql);
      })

//200
getTestDescriptors("Success",[{
    id: 1,
    name: "test descriptor 3",
    procedureDescription: "This test is described by...",
    idSKU: 1
},{
    id: 2,
    name: "test descriptor 4",
    procedureDescription: "test2",
    idSKU: 1
}]);

})



/*
                                ------------------------------------------------------
                                |          GET  /api/testDescriptors/:id             |
                                ------------------------------------------------------
*/

describe('get test descriptor by id', ()=> { 
    beforeAll(async () => {
        let sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)"
        await testDAO.run(sql,["test descriptor 3", "This test is described by...", 1]);
    })

    afterAll(async() => {
        sql = "DELETE FROM TEST_DESCRIPTORS"
        await testDAO.run(sql);
      })


//200
getTestDescriptorById({id: 1}, {
    id: 1,
    name: "test descriptor 3",
    procedureDescription: "This test is described by...",
    idSKU: 1
});

//404
getTestDescriptorById({id: 2},  ERROR_404);

})



/*
                                ------------------------------------------------------
                                |             POST  /api/testDescriptor              |
                                ------------------------------------------------------
*/



describe('add test descriptor', ()=> { 
    beforeAll(async() => {
        let sql="INSERT INTO SKUS (id,DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?,?, ?, ?, ?, ?, ?)";
        await testDAO.run(sql,[32,"newSku",100, 50,"first SKU",10.99,50]);
        sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)"
        await testDAO.run(sql,["test descriptor 3", "This test is described by...", 1]);
    })

    afterAll(async() => {
        sql = "DELETE FROM TEST_DESCRIPTORS"
        await testDAO.run(sql);
        sql = "DELETE FROM SKUS WHERE id=(?)"
        await testDAO.run(sql,32);
      })

//201
createTestDescriptor(MESSG_201, {
    name: "test descriptor 3",
    procedureDescription: "This test is described by...",
    idSKU: 32
})

// ERROR_404
createTestDescriptor(  ERROR_404, {
    name: "test descriptor 3",
    procedureDescription: "This test is described by...",
    idSKU: 37
})

})




/*
                                ------------------------------------------------------
                                |            PUT  /api/testDescriptor/:id            |
                                ------------------------------------------------------
*/



describe('edit test descriptor', ()=> { 
    beforeAll(async() => {
        let sql="INSERT INTO SKUS (id,DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?,?, ?, ?, ?, ?, ?)";
            await testDAO.run(sql,[33,"newSku",100, 50,"first SKU",10.99,50]);
            await testDAO.run(sql,[34,"newSku",100, 50,"first SKU",10.99,50]);
            sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)";
            await testDAO.run(sql,["test descriptor 3", "This test is described by...", 1]);

    })

    afterAll(async() => {
        sql = "DELETE FROM TEST_DESCRIPTORS"
        await testDAO.run(sql);
        sql = "DELETE FROM SKUS WHERE id=(?)"
        await testDAO.run(sql,33);
        await testDAO.run(sql,34);
      })


//200
modifyTestDescriptor(MESSG_200, {
    newName: "test descriptor 1",
    newProcedureDescription: "put successful",
    newIdSKU :33
}, {id: 1})

// ERROR_404 SKUID doesn't exist
modifyTestDescriptor( ERROR_404, {
    newName: "test descriptor 1",
    newProcedureDescription: "This test is described by...",
    newIdSKU :39
}, {id: 1})

// ERROR_404 ID doesn't exist
modifyTestDescriptor( ERROR_404, {
    newName: "test descriptor 1",
    newProcedureDescription: "This test is described by...",
    newIdSKU :33
}, {id: 2})

})



/*
                                ------------------------------------------------------
                                |            DELETE  /api/testDescriptor/:id         |
                                ------------------------------------------------------
*/


describe('delete test descriptor', ()=> { //
    beforeAll(async() => {
        sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)";
        await testDAO.run(sql,["test descriptor 3", "This test is described by...", 1]);
    })

    afterAll(async() => {
        sql = "DELETE FROM TEST_DESCRIPTORS"
        await testDAO.run(sql);
      })

//204
deleteTestDescriptor(MESSG_204,{id: 1})

// ERROR_404
deleteTestDescriptor( ERROR_404,{id: 2})

})

/*
                                ======================================================================
                               ||        DEFINITIONS OF THE TESTING FUNCTIONS TEST DESCRIPTOR        ||
                                ======================================================================
*/


function getTestDescriptors(name,expected){
    
    
        test(name, async () => {
            try {
                let result = await td.getTestDescriptors();
                expect(result).toEqual(expected);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        })
}


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


function modifyTestDescriptor(expected,json,id){
    
    
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