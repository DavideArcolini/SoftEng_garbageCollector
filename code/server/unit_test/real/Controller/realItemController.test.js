/**
 *  INTEGRATION TEST: TestResultController
 *           VERSION: real
 * -------------------------------------------- 
 * Services do access the database (although it
 * is a test database).
*/

/* --------- IMPORT MODULES --------- */
const IController         = require('../../../controller/ItemController');
const SkuDAO                = require('../../../db/skuDAO');
const ItemDAO    = require('../../../db/ItemDAO');
const TestDAO               = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const testDAO               = new TestDAO();
const skuDAO                = new SkuDAO(testDAO);
const itemDAO    = new ItemDAO(testDAO);
const i         = new IController(testDAO);

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
                                |                 GET  /api/items                    |
                                ------------------------------------------------------
*/




describe('get items', ()=> { 
    beforeAll(async() => {

        let sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
        await testDAO.run(sql,[1, "a new item", 10.99, 1, 2]);
        await testDAO.run(sql,[2, "another item", 12.99, 2, 1]);
    })

    afterEach(async() => {
        sql = "DELETE FROM ITEMS"
        await testDAO.run(sql);
        sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
        await testDAO.run(sql,[1, "a new item", 10.99, null, 2]);
        await testDAO.run(sql,[2, "another item", 12.99, 2, 1]);
    })

    afterAll(async() => {
        sql = "DELETE FROM ITEMS"
        await testDAO.run(sql);
    })

    //200
    getItems({code :200,message:[{
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
    }]});

})


/*
                                ------------------------------------------------------
                                |          GET  /api/Items/:id             |
                                ------------------------------------------------------
*/


describe('get item by id', ()=> { 
    beforeAll(async() => {
        let sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
        await testDAO.run(sql,[1, "a new item", 10.99, 1, 2]);
        await testDAO.run(sql,[2, "a new item", 10.99, null, 2]);
    })

    afterAll(async() => {
        sql = "DELETE FROM ITEMS"
        await testDAO.run(sql);
    })


//200
getItemById({id: 1,supplierId : 2},{
    id:1,
    description : "a new item",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
});

getItemById({id: 2,supplierId : 2},{
    id:2,
    description : "a new item",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
});

//ERROR_404
getItemById({id: 3,supplierId : 2}, ERROR_404);

})


/*
                                ------------------------------------------------------
                                |             POST  /api/Item              |
                                ------------------------------------------------------
*/


describe('add item', ()=> { 
    beforeAll(async() => {
        let sql="INSERT INTO SKUS (id, description, weight, volume,notes,price,availableQuantity) VALUES (?,?,?,?,?,?,?)";
        await testDAO.run(sql,[25, "a new sku",100,50,"first SKU" ,10.99,50]);
        await testDAO.run(sql,[26, "a new sku",100,50,"first SKU" ,10.99,50]);
        await testDAO.run(sql,[28, "a new sku",100,50,"first SKU" ,10.99,50]);
        sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
        await testDAO.run(sql,[13, "thing", 99, 27, 2]);
        await testDAO.run(sql,[1, "hello", 99, 26, 2]);
    })

    afterAll(async() => {
        sql = "DELETE FROM ITEMS"
        await testDAO.run(sql);
        sql="DELETE FROM SKUS WHERE Id==?"
        await testDAO.run(sql,25);
        await testDAO.run(sql,26);
        await testDAO.run(sql,28);
      })


//201
createItem( MESSG_201, {
    id : 12,
    description : "a new item",
    price : 10.99,
    SKUId : 25,
    supplierId : 2
})

//ERROR_404 SKUId doesn't exist
createItem( ERROR_404, {
    id : 12,
    description : "a new item",
    price : 10.99,
    SKUId : 30,
    supplierId : 2
})

//422 supplier already sell id
createItem(ERROR_422, {
    id : 13,
    description : "a new item",
    price : 10.99,
    SKUId : 28,
    supplierId : 2
})

//422 supplier already sell skuid
createItem( ERROR_422, {
    id : 19,
    description : "a new item",
    price : 10.99,
    SKUId : 26,
    supplierId : 2
})

})

/*
                                ------------------------------------------------------
                                |            PUT  /api/Item/:id            |
                                ------------------------------------------------------
*/


describe('edit item', ()=> { 
    beforeAll(async() => {
        let sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
        await testDAO.run(sql,[13, "thing", 99, 2, 2]);
    })

    afterAll(async() => {
        sql = "DELETE FROM ITEMS"
        await testDAO.run(sql);
    })


//200
modyfyItem(200, {
    newDescription : "a new sku",
    newPrice : 10.99
}, {id: 13,supplierId : 2})

//ERROR_404 Item doesn't exist
modyfyItem(ERROR_404,{
    newDescription : "a new sku",
    newPrice : 10.99
}, {id: 12,supplierId : 2})

})


/*
                                ------------------------------------------------------
                                |            DELETE  /api/Item/:id         |
                                ------------------------------------------------------
*/





describe('delete item', ()=> { //
    beforeAll(async() => {
         let sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
         await testDAO.run(sql,[13, "thing", 99, 2, 2]);
     })

     afterAll(async() => {
         sql = "DELETE FROM ITEMS"
         await testDAO.run(sql);
     })
 
//204
deleteItem(MESSG_204,{id: 13,supplierId : 2})

//ERROR_404
deleteItem(ERROR_404,{id: 12,supplierId : 2})

    })

/*
                                ======================================================================
                               ||        DEFINITIONS OF THE TESTING FUNCTIONS TEST DESCRIPTOR        ||
                                ======================================================================
*/


function getItems(expected){
    test('get items', async () => {
        try {
            let res = await i.getItems();
            expect(res).toEqual(expected);
        } catch (error) {
            console.log(error);
            expect(error).toBeInstanceOf(Error);
        }
    })
}


function getItemById(params,expected){
        test('get item by id', async () => {
            try {
                let res = await i.getItemById(params);
                expect(res).toEqual(expected);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        })
}


function createItem(expected,json){
    
    test('add item', async () => {
        try {
            let res = await i.createItem(json);
            expect(res).toEqual(expected);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    })
}


function modyfyItem(expected,json,params){
    
        test('edit item', async () => {
            try {
                let res = await i.modifyItem(json,params);
                expect(res).toEqual(expected);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        })
}

function deleteItem(expected,params){
    
        test('delete item', async () => {
            try {
                let res = await i.deleteItem(params);
                expect(res).toEqual(expected);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        })
}
