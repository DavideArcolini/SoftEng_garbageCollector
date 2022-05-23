const DAO = require("./mockDB/testDao");
const dao= new DAO();
const TestDescriptorController = require("../controller/TestDescriptorController");
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
    name: "test descriptor 3",
    procedureDescription: "This test is described by...",
    idSKU: 1
},{
    id: 2,
    name: "test descriptor 4",
    procedureDescription: "test2",
    idSKU: 1
}],0);

//500? throw error?
getTestDescriptors(500,1);


/*
                                ------------------------------------------------------
                                |          GET  /api/testDescriptors/:id             |
                                ------------------------------------------------------
*/


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


/*
                                ------------------------------------------------------
                                |             POST  /api/testDescriptor              |
                                ------------------------------------------------------
*/


//201
createTestDescriptor(201, {
    name: "test descriptor 3",
    procedureDescription: "This test is described by...",
    idSKU: 1
},0)

//404
createTestDescriptor( 404, {
    name: "test descriptor 3",
    procedureDescription: "This test is described by...",
    idSKU: 1
},1)

//503
createTestDescriptor(503, undefined,0)


/*
                                ------------------------------------------------------
                                |            PUT  /api/testDescriptor/:id            |
                                ------------------------------------------------------
*/


//200
modyfyTestDescriptor(200, {
    newName: "test descriptor 1",
    newProcedureDescription: "put successful",
    newIdSKU :1
}, {id: 1},2)

//404 SKUID doesn't exist
modyfyTestDescriptor(404, {
    newName: "test descriptor 1",
    newProcedureDescription: "This test is described by...",
    newIdSKU :2
}, {id: 1},0)

//404 ID doesn't exist
modyfyTestDescriptor(404, {
    newName: "test descriptor 1",
    newProcedureDescription: "This test is described by...",
    newIdSKU :1
}, {id: 2},0)

//503
modyfyTestDescriptor(503, undefined, {id: 1},0)


/*
                                ------------------------------------------------------
                                |            DELETE  /api/testDescriptor/:id         |
                                ------------------------------------------------------
*/


//204
deleteTestDescriptor(204,{id: 1})

//404
deleteTestDescriptor(404,{id: 2})

//503
deleteTestDescriptor(503,undefined)



/*
                                ======================================================================
                               ||        DEFINITIONS OF THE TESTING FUNCTIONS TEST DESCRIPTOR        ||
                                ======================================================================
*/


function getTestDescriptors(expected,mode){
    describe('get tests', ()=> { 
        beforeEach(async() => {
            await dao.dropTableTD();
            await dao.newTableTD();
            if(mode==0){
            let sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)"
            await dao.run(sql,["test descriptor 3", "This test is described by...", 1]);
            sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)"
            await dao.run(sql,["test descriptor 4", "test2", 1]);
            }
        })
    
        test('get tests', async () => {
            let res = await td.getTestDescriptors();
            expect(res).toEqual(expected)
        })
    })
}


function getTestDescriptorById(id,expected){
    describe('get test by id', ()=> { 
        beforeEach(async () => {
            await dao.dropTableTD();
            await dao.newTableTD();
            let sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)"
            await dao.run(sql,["test descriptor 3", "This test is described by...", 1]);
        })
    
        test('get test by id', async () => {
            let res = await td.getTestDescriptorById(id);
            expect(res).toEqual(expected)
        })
    })
}


function createTestDescriptor(expected,json,mode){
    describe('add test', ()=> { 
    beforeEach(async() => {
        await dao.dropTableTD();
        await dao.newTableTD();
        await dao.dropTableSKUItems();
        await dao.newTableSKUItems();
        if(mode==0){
        let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
        await dao.run(sql,["12345678901234567890123456789015",1,"2021/11/29 12:30"]);
        sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)"
        await dao.run(sql,["test descriptor 3", "This test is described by...", 1]);
        }
    })

    test('add test', async () => {
        let res = await td.createTestDescriptor(json);
        expect(res).toEqual(expected)
    })
})}


function modyfyTestDescriptor(expected,json,id,mode){
    describe('edit test', ()=> { 
        beforeEach(async() => {
            await dao.dropTableTD();
            await dao.newTableTD();
            await dao.dropTableSKUItems();
            await dao.newTableSKUItems();
            if(mode==0){
                let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
                await dao.run(sql,["12345678901234567890123456789015",1,"2021/11/29 12:30"])
            }else if(mode==2){
                let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
                await dao.run(sql,["12345678901234567890123456789015",1,"2021/11/29 12:30"]);
                sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)";
                await dao.run(sql,["test descriptor 3", "This test is described by...", 1]);
            }
        })
    
        test('edit test', async () => {
            let res = await td.modifyTestDescriptor(json,id);
            expect(res).toEqual(expected)
        })
    })
}

function deleteTestDescriptor(expected,id){
    describe('delete test', ()=> { //
        beforeEach(async() => {
            await dao.dropTableTD();
            await dao.newTableTD();
            sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)";
            await dao.run(sql,["test descriptor 3", "This test is described by...", 1]);
        })
    
        test('delete test', async () => {
            let res = await td.deleteTestDescriptor(id);
            expect(res).toEqual(expected)
        })
    })
    
}