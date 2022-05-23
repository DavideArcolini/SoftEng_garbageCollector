const dao = require("../test_DB/mock_dao");
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


//200
getTestDescriptors([{
    id: 1,
    name: "test descriptor 1",
    procedureDescription: "This test is described by...",
    idSKU: 1
}], [{
    id: 1,
    name: "test descriptor 1",
    procedureDescription: "This test is described by...",
    idSKU: 1
}]);

//500? throw error?
getTestDescriptors([], 500);


/*
                                ------------------------------------------------------
                                |          GET  /api/testDescriptors/:id             |
                                ------------------------------------------------------
*/


//200
getTestDescriptorById({id: 1}, {
    id: 1,
    name: "test descriptor 1",
    procedureDescription: "This test is described by...",
    idSKU: 1
},{
    id: 1,
    name: "test descriptor 1",
    procedureDescription: "This test is described by...",
    idSKU: 1
});

//404
getTestDescriptorById({id: 1}, undefined, 404);

//500
getTestDescriptorById(undefined, undefined, 500);

/*
                                ------------------------------------------------------
                                |             POST  /api/testDescriptor              |
                                ------------------------------------------------------
*/


//201
createTestDescriptor(1, 201, 201, {
    name: "test descriptor 3",
    procedureDescription: "This test is described by...",
    idSKU: 1
})

//404
createTestDescriptor(undefined, 201, 404, {
    name: "test descriptor 3",
    procedureDescription: "This test is described by...",
    idSKU: 1
})

//503
createTestDescriptor(undefined, 201, 503, undefined)

/*
                                ------------------------------------------------------
                                |            PUT  /api/testDescriptor/:id            |
                                ------------------------------------------------------
*/


//200
modyfyTestDescriptor([1,1], 200, 200, {
    newName: "test descriptor 1",
    newProcedureDescription: "This test is described by...",
    newIdSKU :1
}, {id: 1})

//404 SKUID doesn't exist
modyfyTestDescriptor([undefined,1], 200, 404, {
    newName: "test descriptor 1",
    newProcedureDescription: "This test is described by...",
    newIdSKU :1
}, {id: 1})

//404 ID doesn't exist
modyfyTestDescriptor([1,undefined], 200, 404, {
    newName: "test descriptor 1",
    newProcedureDescription: "This test is described by...",
    newIdSKU :1
}, {id: 1})

//503
modyfyTestDescriptor([1,1], 200, 503, undefined, {id: 1})


/*
                                ------------------------------------------------------
                                |            DELETE  /api/testDescriptor/:id         |
                                ------------------------------------------------------
*/


//204
deleteTestDescriptor(1,204,204,{id: 1})

//404
deleteTestDescriptor(undefined,204,404,{id: 1})

//503
deleteTestDescriptor(1,204,503,undefined)


/*
                                ======================================================================
                               ||        DEFINITIONS OF THE TESTING FUNCTIONS TEST DESCRIPTOR        ||
                                ======================================================================
*/

function getTestDescriptorById(id,resultget,expected){
    describe('get test by id', ()=> { 
        beforeEach(() => {
            dao.get.mockReset();
            dao.get.mockReturnValue(resultget)
        })
    
        test('get test by id', async () => {
            let res = await td.getTestDescriptorById(id);
            expect(res).toEqual(expected)
        })
    })
}

function getTestDescriptors(resultget,expected){
    describe('get tests', ()=> { 
        beforeEach(() => {
            dao.all.mockReset();
            dao.all.mockReturnValue(resultget)
        })
    
        test('get tests', async () => {
            let res = await td.getTestDescriptors();
            expect(res).toEqual(expected)
        })
    })
}

function createTestDescriptor(resultget,resultrun,expected,json){
    describe('add test', ()=> { 
    beforeEach(() => {
        dao.get.mockReset();
        dao.get.mockReturnValueOnce(resultget);
        dao.run.mockReset();
        dao.run.mockReturnValueOnce(resultrun);
    })

    test('add test', async () => {
        let res = await td.createTestDescriptor(json);
        expect(res).toEqual(expected)
    })
})}

function modyfyTestDescriptor(resultget,resultrun,expected,json,id){
    describe('edit test', ()=> { 
        beforeEach(() => {
            dao.get.mockReset();
            dao.get.mockReturnValueOnce(resultget[0]).mockReturnValue(resultget[1])
            dao.run.mockReset();
            dao.run.mockReturnValueOnce(resultrun)
        })
    
        test('edit test', async () => {
            let res = await td.modifyTestDescriptor(json,id);
            expect(res).toEqual(expected)
        })
    })
}

function deleteTestDescriptor(resultget,resultrun,expected,id){
    describe('delete test', ()=> { //
        beforeEach(() => {
            dao.get.mockReset();
            dao.get.mockReturnValueOnce(resultget)
            dao.run.mockReset();
            dao.run.mockReturnValueOnce(resultrun)
        })
    
        test('delete test', async () => {
            let res = await td.deleteTestDescriptor(id);
            expect(res).toEqual(expected)
        })
    })
    
}