/**
 *  UNIT TEST: testResultDAO
 *    VERSION: real
 * ===========================
 */

/* --------- IMPORT MODULES --------- */
const TRDAO        = require('../../../db/testResultDAO');
const DAO           = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const dao         = new DAO();
const tr      = new TRDAO(dao);


/*
                         ======================================================
                        ||                    TESTING CASES                   ||
                         ======================================================
*/
trs=[{
    id: 1,
    idTestDescriptor: 12,
    Date: "2021/11/28",
    Result: false
},{
    id: 2,
    idTestDescriptor: 13,
    Date: "2021/11/28",
    Result: true
}]

trs0={
    rfid: "44",
    idTestDescriptor: 29,
    Date: "2021/11/28",
    Result: true
}

trs1={
    newIdTestDescriptor:31,
    newDate:"2021/11/28",
    newResult: true
}

trs2={
    rfid: "44",
    idTestDescriptor: 31,
    Date: "2021/11/28",
    Result: false
}

/*
 ------------------------------------------------------
 |          GET  /api/testResults                 |
 ------------------------------------------------------
*/



describe('get tests result', ()=> { 
beforeAll(async() => {
    trs=[{
        id: 20,
        idTestDescriptor: 12,
        Date: "2021/11/28",
        Result: false
    },{
        id: 21,
        idTestDescriptor: 13,
        Date: "2021/11/28",
        Result: true
    }]
let sql = "INSERT INTO TEST_RESULTS(id,rfid,idTestDescriptor,  Date, Result) VALUES(?,?,?,?,?)"
await dao.run(sql,[trs[0].id,"44",trs[0].idTestDescriptor,trs[0]. Date,trs[0]. Result]);
await dao.run(sql,[trs[1].id,"44",trs[1].idTestDescriptor,trs[1]. Date,trs[1]. Result]);
})


afterAll(async() => {
sql = "DELETE FROM TEST_RESULTS"
await dao.run(sql);
})

//200
getTestResults("Success",trs,"44");

})



/*
 ------------------------------------------------------
 |          GET  /api/testResults/:id             |
 ------------------------------------------------------
*/

describe('get test result by id', ()=> { 
beforeAll(async () => {
    let sql = "INSERT INTO TEST_RESULTS(id,rfid,idTestDescriptor,  Date, Result) VALUES(?,?,?,?,?)"
    await dao.run(sql,[trs[0].id,"44",trs[0].idTestDescriptor,trs[0]. Date,trs[0]. Result]);
})

afterAll(async() => {
sql = "DELETE FROM TEST_RESULTS"
await dao.run(sql);
})


//200
getTestResultById("Success",trs[0],1,"44");

})



/*
 ------------------------------------------------------
 |             POST  /api/testResult              |
 ------------------------------------------------------
*/



describe('add test result', ()=> { 

afterAll(async() => {
    sql = "DELETE FROM TEST_RESULTS"
    await dao.run(sql);
})

//201
createTestResult("success",trs0,trs0);

})




/*
 ------------------------------------------------------
 |            PUT  /api/testResult/:id            |
 ------------------------------------------------------
*/



describe('edit test result', ()=> { 
beforeAll(async() => {
    let sql = "INSERT INTO TEST_RESULTS(id,rfid,idTestDescriptor,  Date, Result) VALUES(?,?,?,?,?)"
    await dao.run(sql,[trs[0].id,"44",trs[0].idTestDescriptor,trs[0]. Date,trs[0]. Result]);
})

afterAll(async() => {
    sql = "DELETE FROM TEST_RESULTS"
    await dao.run(sql);
})


//200
modyfyTestResult("success",trs2,1,trs1);

})



/*
 ------------------------------------------------------
 |            DELETE  /api/testResult/:id         |
 ------------------------------------------------------
*/


describe('delete test result', ()=> { //
beforeAll(async() => {
    let sql = "INSERT INTO TEST_RESULTS(id,rfid,idTestDescriptor,  Date, Result) VALUES(?,?,?,?,?)"
    await dao.run(sql,[trs[0].id,"44",trs[0].idTestDescriptor,trs[0]. Date,trs[0]. Result]);
})


//204
deleteTestResult("Success",trs[0],"44",1)

})



/*
 ======================================================================
||        DEFINITIONS OF THE TESTING FUNCTIONS TEST RESULT        ||
 ======================================================================
*/


function getTestResults(name,expected,rfid){

test(name, async () => {
    try {
        let res = await tr.getTestResults(rifd);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
})
}


function getTestResultById(name,expected,id,rfid){

test(name, async () => {

    try {
        let res = await tr.getTestResultById(id,rfid);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
})
}


function createTestResult(name,expected,json){

test(name, async () => {
    try {
        let res = await tr.createTestResult(json);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
})
}


function modyfyTestResult(name,expected,id,json){


test(name, async () => {
    try {
        let res = await tr.modifyTestResult(id,json);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
})
}

function deleteTestResult(name,expected,rfid,id){

test(name, async () => {

    try {
        let res = await tr.deleteTestResult(rfid,id);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
})

}
