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
    id:14,
    description : "a new item",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
},{
    id:15,
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
    id:6,
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



describe('get items', ()=> { 
beforeAll(async() => {
    tis=[{
        id:3,
        description : "a new item",
        price : 10.99,
        SKUId : 1,
        supplierId : 2
    },{
        id:4,
        description : "another item",
        price : 12.99,
        SKUId : 2,
        supplierId : 1
    }];
let sql = "INSERT INTO ITEMS(id,description, price, SKUId,supplierId) VALUES(?,?,?,?,?)"
await dao.run(sql,[tis[0].id,tis[0].description,tis[0].price,tis[0].SKUId,tis[0].supplierId]);
await dao.run(sql,[tis[1].id,tis[1].description,tis[1].price,tis[1].SKUId,tis[1].supplierId]);
})


afterAll(async() => {
sql = "DELETE FROM ITEMS"
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

describe('get item by id', ()=> { 
beforeAll(async () => {
    tis=[{
        id:5,
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
    let sql = "INSERT INTO ITEMS(id,description, price, SKUId,supplierId) VALUES(?,?,?,?,?)"
    await dao.run(sql,[tis[0].id, tis[0].description, tis[0].price, tis[0].SKUId, tis[0].supplierId]);
})

afterAll(async() => {
sql = "DELETE FROM ITEMS"
await dao.run(sql);
})


//200
getItemById("Success",tis[0].id,tis[0],tis[0].supplierId);

})



/*
 ------------------------------------------------------
 |             POST  /api/item              |
 ------------------------------------------------------
*/



describe('add item', ()=> { 

afterAll(async() => {
    sql = "DELETE FROM ITEMS"
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



describe('edit item', ()=> { 
beforeAll(async() => {
    tis=[{
        id:6,
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
    let sql = "INSERT INTO ITEMS(id,description, price, SKUId,supplierId) VALUES(?,?,?,?,?)"
    await dao.run(sql,[tis[0].id, tis[0].description, tis[0].price, tis[0].SKUId, tis[0].supplierId]);
})

afterAll(async() => {
    sql = "DELETE FROM ITEMS"
    await dao.run(sql);
})


//200
modifyItem("success",tis2,tis[0].id,tis[0].supplierId,tis1);

})



/*
 ------------------------------------------------------
 |            DELETE  /api/item/:id         |
 ------------------------------------------------------
*/


describe('delete item', ()=> { //
beforeAll(async() => {
    tis=[{
        id:7,
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
    let sql = "INSERT INTO ITEMS(id,description, price, SKUId,supplierId) VALUES(?,?,?,?,?)"
    await dao.run(sql,[tis[0].id, tis[0].description, tis[0].price, tis[0].SKUId, tis[0].supplierId]);
})


//204
deleteItem("Success",tis[0],tis[0].id,tis[0].supplierId)



})


/*
 ------------------------------------------------------
 |            GET        getItemBySupSKUID              |
 ------------------------------------------------------
*/


describe('get item skuid an supplier', ()=> { //
    beforeAll(async() => {
        tis=[{
            id:8,
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
        let sql = "INSERT INTO ITEMS(id,description, price, SKUId,supplierId) VALUES(?,?,?,?,?)"
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


describe('get item id and supplier', ()=> { //
    beforeAll(async() => {
        tis=[{
            id:9,
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
        let sql = "INSERT INTO ITEMS(id,description, price, SKUId,supplierId) VALUES(?,?,?,?,?)"
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
        expect(error).toBeInstanceOf(Error);
    }
})
}


function getItemById(name,id,supplierId,expected){

test(name, async () => {

    try {
        let res = await i.getItemById(id,supplierId);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
})
}


function createItem(name,expected,json){

test(name, async () => {
    try {
        let res = await i.createItem(json);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
})
}


function modifyItem(name,expected,id,supplierId,json){


test(name, async () => {
    try {
        let res = await i.modifyItem(id,supplierId,json);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
})
}

function deleteItem(name,expected,id,supplierId){

test(name, async () => {

    try {
        let res = await i.deleteItem(id,supplierId);
        expect(res).toEqual(expected)
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
})

}

function getItemBySupSKUID(name,expected,skuid,supplierid){

    test(name, async () => {
    
        try {
            let res = await i.getItemBySupSKUID(skuid,supplierid);
            expect(res).toEqual(expected)
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    })
    
    }


    function getItemBySupId(name,expected,id,supplierid){

        test(name, async () => {
        
            try {
                let res = await i.getItemBySupId(id,supplierid);
                expect(res).toEqual(expected)
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        })
        
        }