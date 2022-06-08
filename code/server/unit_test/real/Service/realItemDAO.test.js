/**
 *  UNIT TEST: itemsDAO
 *    VERSION: real
 * ===========================
 */

/* --------- IMPORT MODULES --------- */
const IDAO        = require('../../../db/itemDAO');
const DAO           = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const dao         = new DAO();
const i      = new IDAO(dao);

/*
                         ======================================================
                        ||                    TESTING CASES                   ||
                         ======================================================
*/
tis=[{
    id:1,
    description : "a new item",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
},{
    id:2,
    description : "another item",
    price : 12.99,
    SKUId : 2,
    supplierId : 1
}];

tis1={
    newDescription : "a new sku",
    newPrice : 10.99
}

tis2={
    id:1,
    description : "a new sku",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
}

/*
 ------------------------------------------------------
 |          GET  /api/items                 |
 ------------------------------------------------------
*/



describe('get tests', ()=> { 
beforeAll(async() => {
let sql = "INSERT INTO TEST_ITEMS(id,description, price, SKUId,supplierId) VALUES(?,?,?,?,?)"
await dao.run(sql,[tis[0].id,tis[0].description,tis[0].price,tis[0].SKUId,tis[0].supplierId]);
await dao.run(sql,[tis[1].id,tis[1].description,tis[1].price,tis[1].SKUId,tis[1].supplierId]);
})


afterAll(async() => {
sql = "DELETE FROM TEST_ITEMS"
await dao.run(sql);
})

//200
getItems("Success",tis);

})



/*
 ------------------------------------------------------
 |          GET  /api/items/:id             |
 ------------------------------------------------------
*/

describe('get test by id', ()=> { 
beforeAll(async () => {
    let sql = "INSERT INTO TEST_ITEMS(id,description, price, SKUId,supplierId) VALUES(?,?,?,?,?)"
    await dao.run(sql,[tis[0].id, tis[0].description, tis[0].price, tis[0].SKUId, tis[0].supplierId]);
})

afterAll(async() => {
sql = "DELETE FROM TEST_ITEMS"
await dao.run(sql);
})


//200
getItemById("Success",tis[0].id,tis[0]);

})



/*
 ------------------------------------------------------
 |             POST  /api/item              |
 ------------------------------------------------------
*/



describe('add test', ()=> { 

afterAll(async() => {
    sql = "DELETE FROM TEST_ITEMS"
    await dao.run(sql);
})

//201
createItem("success",tis[0],tis[0]);

})




/*
 ------------------------------------------------------
 |            PUT  /api/item/:id            |
 ------------------------------------------------------
*/



describe('edit test', ()=> { 
beforeAll(async() => {
    let sql = "INSERT INTO TEST_ITEMS(id,description, price, SKUId,supplierId) VALUES(?,?,?,?,?)"
    await dao.run(sql,[tis[0].id, tis[0].description, tis[0].price, tis[0].SKUId, tis[0].supplierId]);
})

afterAll(async() => {
    sql = "DELETE FROM TEST_ITEMS"
    await dao.run(sql);
})


//200
modyfyItem("success",tis2,1,tis1);

})



/*
 ------------------------------------------------------
 |            DELETE  /api/item/:id         |
 ------------------------------------------------------
*/


describe('delete test', ()=> { //
beforeAll(async() => {
    let sql = "INSERT INTO TEST_ITEMS(id,description, price, SKUId,supplierId) VALUES(?,?,?,?,?)"
    await dao.run(sql,[tis[0].id, tis[0].description, tis[0].price, tis[0].SKUId, tis[0].supplierId]);
})


//204
deleteItem("Success",tis[0],1)



})


/*
 ------------------------------------------------------
 |            GET        getItemBySupSKUID              |
 ------------------------------------------------------
*/


describe('get test descriptor by skuid', ()=> { //
    beforeAll(async() => {
        let sql = "INSERT INTO TEST_ITEMS(id,description, price, SKUId,supplierId) VALUES(?,?,?,?,?)"
        await dao.run(sql,[tis[0].id, tis[0].description, tis[0].price, tis[0].SKUId, tis[0].supplierId]);
    })
    
    
    //204
    getItemBySupSKUID("Success",tis[0],tis[0].SKUId, tis[0].supplierId);
    
    
    
    })





/*
 ------------------------------------------------------
 |            GET        getItemBySupId              |
 ------------------------------------------------------
*/


describe('get test descriptor by skuid', ()=> { //
    beforeAll(async() => {
        let sql = "INSERT INTO TEST_ITEMS(id,description, price, SKUId,supplierId) VALUES(?,?,?,?,?)"
        await dao.run(sql,[tis[0].id, tis[0].description, tis[0].price, tis[0].SKUId, tis[0].supplierId]);
    })
    
    
    //204
    getItemBySupId("Success",tis[0],tis[0].id, tis[0].supplierId);
    
    
    
    })


/*
 ======================================================================
||        DEFINITIONS OF THE TESTING FUNCTIONS TEST DESCRIPTOR        ||
 ======================================================================
*/


function getItems(name,expected){

test(name, async () => {
    try {
        let res = await i.getItems();
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(expected);
    }
})
}


function getItemById(name,id,expected){

test(name, async () => {

    try {
        let res = await i.getItemById(id);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(expected);
    }
})
}


function createItem(name,expected,json){

test(name, async () => {
    try {
        let res = await i.createItem(json);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(expected);
    }
})
}


function modyfyItem(name,expected,id,json){


test(name, async () => {
    try {
        let res = await i.modifyItem(id,json);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(expected);
    }
})
}

function deleteItem(name,expected,id){

test(name, async () => {

    try {
        let res = await i.deleteItem(id);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(expected);
    }
})

}

function getItemBySupSKUID(name,expected,skuid,supplierid){

    test(name, async () => {
    
        try {
            let res = await i.getItemBySupSKUID(skuid,supplierid);
            expect(res).toEqual(expected)
        } catch (error) {
            expect(error).toBeInstanceOf(expected);
        }
    })
    
    }


    function getItemBySupId(name,expected,id,supplierid){

        test(name, async () => {
        
            try {
                let res = await i.getItemBySupId(id,supplierid);
                expect(res).toEqual(expected)
            } catch (error) {
                expect(error).toBeInstanceOf(expected);
            }
        })
        
        }