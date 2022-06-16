/**
 *  UNIT TEST: testDescriptorsDAO
 *    VERSION: real
 * ===========================
 */

/* --------- IMPORT MODULES --------- */
const TDDAO        = require('../../../db/testDescriptorsDAO');
const DAO           = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const dao         = new DAO();
const td      = new TDDAO(dao);

/*
                         ======================================================
                        ||                    TESTING CASES                   ||
                         ======================================================
*/
let tds=[{
    id: 13,
    name: "test descriptor 3",
    procedureDescription: "This test is described by...",
    idSKU: 1
},{
    id: 14,
    name: "test descriptor 4",
    procedureDescription: "test2",
    idSKU: 1
}];

let tds1={
    newName: "test descriptor 1",
    newProcedureDescription: "put successful",
    newIdSKU :33
}

let tds2={
    id:7,
    name: "test descriptor 1",
    procedureDescription: "put successful",
    idSKU :33
}

/*
 ------------------------------------------------------
 |          GET  /api/testDescriptors                 |
 ------------------------------------------------------
*/



describe('get tests descriptor', ()=> { 
beforeAll(async() => {
    let tds=[{
        id: 3,
        name: "test descriptor 3",
        procedureDescription: "This test is described by...",
        idSKU: 1
    },{
        id: 4,
        name: "test descriptor 4",
        procedureDescription: "test2",
        idSKU: 1
    }];
    let sql = "INSERT INTO TEST_DESCRIPTORS(id,name, procedureDescription, idSKU) VALUES(?,?,?,?)"
    await dao.run(sql,[tds[0].id,tds[0].name,tds[0].procedureDescription,tds[0].idSKU]);
    await dao.run(sql,[tds[1].id,tds[1].name,tds[1].procedureDescription,tds[1].idSKU]);
})


afterAll(async() => {
sql = "DELETE FROM TEST_DESCRIPTORS"
await dao.run(sql);
})

//200
getTestDescriptors("Success",tds);

})



/*
 ------------------------------------------------------
 |          GET  /api/testDescriptors/:id             |
 ------------------------------------------------------
*/

describe('get test descriptor by id', ()=> { 
beforeAll(async () => {
    let tds=[{
        id: 5,
        name: "test descriptor 3",
        procedureDescription: "This test is described by...",
        idSKU: 1
    },{
        id: 4,
        name: "test descriptor 4",
        procedureDescription: "test2",
        idSKU: 1
    }];
let sql = "INSERT INTO TEST_DESCRIPTORS(id,name, procedureDescription, idSKU) VALUES(?,?,?,?)"
await dao.run(sql,[tds[0].id,tds[0].name,tds[0].procedureDescription,tds[0].idSKU]);
})

afterAll(async() => {
sql = "DELETE FROM TEST_DESCRIPTORS"
await dao.run(sql);
})


//200
getTestDescriptorById("Success",1,tds[0]);

})



/*
 ------------------------------------------------------
 |             POST  /api/testDescriptor              |
 ------------------------------------------------------
*/



describe('add test descriptor', ()=> { 

afterAll(async() => {
    sql = "DELETE FROM TEST_DESCRIPTORS"
    await dao.run(sql);
})

//201
let tds=[{
    id: 6,
    name: "test descriptor 3",
    procedureDescription: "This test is described by...",
    idSKU: 1
},{
    id: 4,
    name: "test descriptor 4",
    procedureDescription: "test2",
    idSKU: 1
}];
createTestDescriptor("success",tds[0],tds[0]);

})




/*
 ------------------------------------------------------
 |            PUT  /api/testDescriptor/:id            |
 ------------------------------------------------------
*/



describe('edit test descriptor', ()=> { 
beforeAll(async() => {
    let tds=[{
        id: 7,
        name: "test descriptor 3",
        procedureDescription: "This test is described by...",
        idSKU: 1
    },{
        id: 4,
        name: "test descriptor 4",
        procedureDescription: "test2",
        idSKU: 1
    }];
    let sql = "INSERT INTO TEST_DESCRIPTORS(id,name, procedureDescription, idSKU) VALUES(?,?,?,?)"
    await dao.run(sql,[tds[0].id,tds[0].name,tds[0].procedureDescription,tds[0].idSKU]);
})

afterAll(async() => {
    sql = "DELETE FROM TEST_DESCRIPTORS"
    await dao.run(sql);
})


//200
modyfyTestDescriptor("success",tds2,tds[0].id,tds1);

})



/*
 ------------------------------------------------------
 |            DELETE  /api/testDescriptor/:id         |
 ------------------------------------------------------
*/


describe('delete test descriptor', ()=> { //
beforeAll(async() => {
    let tds=[{
        id: 8,
        name: "test descriptor 3",
        procedureDescription: "This test is described by...",
        idSKU: 1
    },{
        id: 4,
        name: "test descriptor 4",
        procedureDescription: "test2",
        idSKU: 1
    }];
    let sql = "INSERT INTO TEST_DESCRIPTORS(id,name, procedureDescription, idSKU) VALUES(?,?,?,?)"
    await dao.run(sql,[tds[0].id,tds[0].name,tds[0].procedureDescription,tds[0].idSKU]);
})


//204
deleteTestDescriptor("Success",tds[0],tds[0].id)



})


/*
 ------------------------------------------------------
 |            GET        getTDIDbySKUid               |
 ------------------------------------------------------
*/


describe('get test descriptor by skuid', ()=> { //
    beforeAll(async() => {
        let tds=[{
            id: 9,
            name: "test descriptor 3",
            procedureDescription: "This test is described by...",
            idSKU: 1
        },{
            id: 10,
            name: "test descriptor 4",
            procedureDescription: "test2",
            idSKU: 1
        }];
        let sql = "INSERT INTO TEST_DESCRIPTORS(id,name, procedureDescription, idSKU) VALUES(?,?,?,?)"
        await dao.run(sql,[tds[0].id,tds[0].name,tds[0].procedureDescription,tds[0].idSKU]);
        await dao.run(sql,[tds[1].id,tds[1].name,tds[1].procedureDescription,tds[1].idSKU]);
    })
    
    
    //204
    getTDIDbySKUid  ("Success",[9,10],1)
    
    
    
    })


/*
 ======================================================================
||        DEFINITIONS OF THE TESTING FUNCTIONS TEST DESCRIPTOR        ||
 ======================================================================
*/


function getTestDescriptors(name,expected){

test(name, async () => {
    try {
        let res = await td.getTestDescriptors();
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
})
}


function getTestDescriptorById(name,id,expected){

test(name, async () => {

    try {
        let res = await td.getTestDescriptorById(id);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
})
}


function createTestDescriptor(name,expected,json){

test(name, async () => {
    try {
        let res = await td.createTestDescriptor(json);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
})
}


function modyfyTestDescriptor(name,expected,id,json){


test(name, async () => {
    try {
        let res = await td.modifyTestDescriptor(id,json);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
})
}

function deleteTestDescriptor(name,expected,id){

test(name, async () => {

    try {
        let res = await td.deleteTestDescriptor(id);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
})

}

function getTDIDbySKUid(name,expected,skuid){

    test(name, async () => {
    
        try {
            let res = await td.getTDIDbySKUid(skuid);
            expect(res).toEqual(expected)
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    })
    
    }