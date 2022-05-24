const DAO = require("../test_DB/TestDAO");
const dao= new DAO();
const ItemController = require("../../controller/ItemController");
const i = new ItemController(dao);

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
        await dao.run(sql,[1, "a new item", 10.99, 1, 2]);
        await dao.run(sql,[2, "another item", 12.99, 2, 1]);
    })

    afterEach(async() => {
        sql = "DELETE FROM ITEMS"
        await dao.run(sql);
        sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
        await dao.run(sql,[1, "a new item", 10.99, null, 2]);
        await dao.run(sql,[2, "another item", 12.99, 2, 1]);
    })

    afterAll(async() => {
        sql = "DELETE FROM ITEMS"
        await dao.run(sql);
    })

    //200
    getItems([{
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
    }]);

    //500? throw error?
    getItems(500);

})


/*
                                ------------------------------------------------------
                                |          GET  /api/Items/:id             |
                                ------------------------------------------------------
*/


describe('get item by id', ()=> { 
    beforeAll(async() => {
        let sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
        await dao.run(sql,[1, "a new item", 10.99, 1, 2]);
    })

    afterAll(async() => {
        sql = "DELETE FROM ITEMS"
        await dao.run(sql);
    })


//200
getItemById({id: 1},{
    id:1,
    description : "a new item",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
});

//404
getItemById({id: 2}, 404);

//500
getItemById(undefined, 500);


})


/*
                                ------------------------------------------------------
                                |             POST  /api/Item              |
                                ------------------------------------------------------
*/


describe('add item', ()=> { 
    beforeAll(async() => {
        let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
        await dao.run(sql,["25",25,"2021/11/29 12:30"]);
        await dao.run(sql,["26",26,"2021/11/29 12:30"]);
        await dao.run(sql,["28",28,"2021/11/29 12:30"]);
        sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
        await dao.run(sql,[13, "thing", 99, 27, 2]);
        await dao.run(sql,[1, "hello", 99, 26, 2]);
    })
    afterAll(async() => {
        sql = "DELETE FROM ITEMS"
        await dao.run(sql);
        sql="DELETE FROM SKUITEMS WHERE SKUId==?"
        await dao.run(sql,25);
        await dao.run(sql,26);
        await dao.run(sql,28);
      })


//201
createItem( 201, {
    id : 12,
    description : "a new item",
    price : 10.99,
    SKUId : 25,
    supplierId : 2
})

//404 SKUId doesn't exist
createItem( 404, {
    id : 12,
    description : "a new item",
    price : 10.99,
    SKUId : 30,
    supplierId : 2
})

//422 supplier already sell id
createItem(422, {
    id : 13,
    description : "a new item",
    price : 10.99,
    SKUId : 28,
    supplierId : 2
})

//422 supplier already sell skuid
createItem( 422, {
    id : 12,
    description : "a new item",
    price : 10.99,
    SKUId : 26,
    supplierId : 2
})


//503
createItem(503, undefined)

})

/*
                                ------------------------------------------------------
                                |            PUT  /api/Item/:id            |
                                ------------------------------------------------------
*/


describe('edit item', ()=> { 
    beforeAll(async() => {
        let sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
        await dao.run(sql,[13, "thing", 99, 2, 2]);
    })

    afterAll(async() => {
        sql = "DELETE FROM ITEMS"
        await dao.run(sql);
    })


//200
modyfyItem(200, {
    newDescription : "a new sku",
    newPrice : 10.99
}, {id: 13})

//404 Item doesn't exist
modyfyItem(404,{
    newDescription : "a new sku",
    newPrice : 10.99
}, {id: 12})

//503
modyfyItem(503, undefined, undefined)

})


/*
                                ------------------------------------------------------
                                |            DELETE  /api/Item/:id         |
                                ------------------------------------------------------
*/





describe('delete item', ()=> { //
    beforeAll(async() => {
         let sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
         await dao.run(sql,[13, "thing", 99, 2, 2]);
     })

     afterAll(async() => {
         sql = "DELETE FROM ITEMS"
         await dao.run(sql);
     })
 
//204
deleteItem(204,{id: 13})

//404
deleteItem(404,{id: 12})

//503
deleteItem(503,undefined)
    })

/*
                                ======================================================================
                               ||        DEFINITIONS OF THE TESTING FUNCTIONS TEST DESCRIPTOR        ||
                                ======================================================================
*/







function getItems(expected){
    test('get items', async () => {
        let res = await i.getItems();
        expect(res).toEqual(expected)
    })
}


function getItemById(id,expected){
        test('get item by id', async () => {
            let res = await i.getItemById(id);
            expect(res).toEqual(expected)
        })
}


function createItem(expected,json){
    
    test('add item', async () => {
        let res = await i.createItem(json);
        expect(res).toEqual(expected)
    })
}


function modyfyItem(expected,json,id){
    
        test('edit item', async () => {
            let res = await i.modifyItem(json,id);
            expect(res).toEqual(expected)
        })
}

function deleteItem(expected,id){
    
        test('delete item', async () => {
            let res = await i.deleteItem(id);
            expect(res).toEqual(expected)
        })
}
