const DAO = require("../test_DB/TestDAO");
const dao= new DAO();
const TestDescriptorController = require("../../controller/TestDescriptorController");
const td = new TestDescriptorController(dao);


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
    beforeAll(async() => {
        let sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)"
        await dao.run(sql,["test descriptor 3", "This test is described by...", 1]);
        await dao.run(sql,["test descriptor 4", "test2", 1]);
    })

    afterEach(async() => {
        sql = "DELETE FROM TEST_DESCRIPTORS"
        await dao.run(sql);
        sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)"
        await dao.run(sql,["test descriptor 3", "This test is described by...", null]);
        await dao.run(sql,["test descriptor 4", "test2", 1]);
      })

    afterAll(async() => {
        sql = "DELETE FROM TEST_DESCRIPTORS"
        await dao.run(sql);
      })

//200
getTestDescriptors([{
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

//500? throw error?
getTestDescriptors(500);

})



/*
                                ------------------------------------------------------
                                |          GET  /api/testDescriptors/:id             |
                                ------------------------------------------------------
*/

describe('get test by id', ()=> { 
    beforeAll(async () => {
        let sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)"
        await dao.run(sql,["test descriptor 3", "This test is described by...", 1]);
    })

    afterAll(async() => {
        sql = "DELETE FROM TEST_DESCRIPTORS"
        await dao.run(sql);
      })


//200
getTestDescriptorById({id: 1}, {
    id: 1,
    name: "test descriptor 3",
    procedureDescription: "This test is described by...",
    idSKU: 1
});

//404
getTestDescriptorById({id: 2}, 404);

//500
getTestDescriptorById(undefined, 500);
})



/*
                                ------------------------------------------------------
                                |             POST  /api/testDescriptor              |
                                ------------------------------------------------------
*/



describe('add test', ()=> { 
    beforeAll(async() => {
        let sql="INSERT INTO SKUS (id,DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?,?, ?, ?, ?, ?, ?)";
        await dao.run(sql,[32,"newSku",100, 50,"first SKU",10.99,50]);
        sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)"
        await dao.run(sql,["test descriptor 3", "This test is described by...", 1]);
    })

    afterAll(async() => {
        sql = "DELETE FROM TEST_DESCRIPTORS"
        await dao.run(sql);
        sql = "DELETE FROM SKUS WHERE id=(?)"
        await dao.run(sql,32);
      })

//201
createTestDescriptor(201, {
    name: "test descriptor 3",
    procedureDescription: "This test is described by...",
    idSKU: 32
})

//404
createTestDescriptor( 404, {
    name: "test descriptor 3",
    procedureDescription: "This test is described by...",
    idSKU: 37
})

//503
createTestDescriptor(503, undefined)
})




/*
                                ------------------------------------------------------
                                |            PUT  /api/testDescriptor/:id            |
                                ------------------------------------------------------
*/



describe('edit test', ()=> { 
    beforeAll(async() => {
        let sql="INSERT INTO SKUS (id,DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?,?, ?, ?, ?, ?, ?)";
            await dao.run(sql,[33,"newSku",100, 50,"first SKU",10.99,50]);
            await dao.run(sql,[34,"newSku",100, 50,"first SKU",10.99,50]);
            sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)";
            await dao.run(sql,["test descriptor 3", "This test is described by...", 1]);

    })

    afterAll(async() => {
        sql = "DELETE FROM TEST_DESCRIPTORS"
        await dao.run(sql);
        sql = "DELETE FROM SKUS WHERE id=(?)"
        await dao.run(sql,33);
        await dao.run(sql,34);
      })


//200
modyfyTestDescriptor(200, {
    newName: "test descriptor 1",
    newProcedureDescription: "put successful",
    newIdSKU :33
}, {id: 1})

//404 SKUID doesn't exist
modyfyTestDescriptor(404, {
    newName: "test descriptor 1",
    newProcedureDescription: "This test is described by...",
    newIdSKU :39
}, {id: 1})

//404 ID doesn't exist
modyfyTestDescriptor(404, {
    newName: "test descriptor 1",
    newProcedureDescription: "This test is described by...",
    newIdSKU :1
}, {id: 2})

//503
modyfyTestDescriptor(503, undefined, {id: 1})
})



/*
                                ------------------------------------------------------
                                |            DELETE  /api/testDescriptor/:id         |
                                ------------------------------------------------------
*/


describe('delete test', ()=> { //
    beforeAll(async() => {
        sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)";
        await dao.run(sql,["test descriptor 3", "This test is described by...", 1]);
    })

    afterAll(async() => {
        sql = "DELETE FROM TEST_DESCRIPTORS"
        await dao.run(sql);
      })

//204
deleteTestDescriptor(204,{id: 1})

//404
deleteTestDescriptor(404,{id: 2})

//503
deleteTestDescriptor(503,undefined)

})

/*
                                ======================================================================
                               ||        DEFINITIONS OF THE TESTING FUNCTIONS TEST DESCRIPTOR        ||
                                ======================================================================
*/


function getTestDescriptors(expected){
    
    
        test('get tests', async () => {
            let res = await td.getTestDescriptors();
            expect(res).toEqual(expected)
        })
}


function getTestDescriptorById(id,expected){
    
        test('get test by id', async () => {
            let res = await td.getTestDescriptorById(id);
            expect(res).toEqual(expected)
        })
}


function createTestDescriptor(expected,json){
    
    test('add test', async () => {
        let res = await td.createTestDescriptor(json);
        expect(res).toEqual(expected)
    })
}


function modyfyTestDescriptor(expected,json,id){
    
    
        test('edit test', async () => {
            let res = await td.modifyTestDescriptor(json,id);
            expect(res).toEqual(expected)
        })
}

function deleteTestDescriptor(expected,id){
    
        test('delete test', async () => {
            let res = await td.deleteTestDescriptor(id);
            expect(res).toEqual(expected)
        })
    
}