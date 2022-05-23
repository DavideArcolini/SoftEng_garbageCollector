const DAO = require("./mockDB/testDao");
const dao= new DAO();
const ItemController = require("../controller/ItemController");
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
}],0);

//500? throw error?
getItems(500,1);


/*
                                ------------------------------------------------------
                                |          GET  /api/Items/:id             |
                                ------------------------------------------------------
*/


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

/*
                                ------------------------------------------------------
                                |             POST  /api/Item              |
                                ------------------------------------------------------
*/


//201
createItem( 201, {
    id : 12,
    description : "a new item",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
})

//404 SKUId doesn't exist
createItem( 404, {
    id : 12,
    description : "a new item",
    price : 10.99,
    SKUId : 8,
    supplierId : 2
})

//422 supplier already sell id
createItem(422, {
    id : 13,
    description : "a new item",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
})

//422 supplier already sell skuid
createItem( 422, {
    id : 12,
    description : "a new item",
    price : 10.99,
    SKUId : 2,
    supplierId : 2
})


//503
createItem(503, undefined)

/*
                                ------------------------------------------------------
                                |            PUT  /api/Item/:id            |
                                ------------------------------------------------------
*/


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


/*
                                ------------------------------------------------------
                                |            DELETE  /api/Item/:id         |
                                ------------------------------------------------------
*/


//204
deleteItem(204,{id: 13})

//404
deleteItem(404,{id: 12})

//503
deleteItem(503,undefined)


/*
                                ======================================================================
                               ||        DEFINITIONS OF THE TESTING FUNCTIONS TEST DESCRIPTOR        ||
                                ======================================================================
*/


function getItems(expected,mode){
    describe('get items', ()=> { 
        beforeEach(async() => {
            await dao.dropTableI();
            await dao.newTableI();
            if(mode==0){
            let sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
            await dao.run(sql,[1, "a new item", 10.99, 1, 2]);
            sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
            await dao.run(sql,[2, "another item", 12.99, 2, 1]);
            }

        })
    
        test('get items', async () => {
            let res = await i.getItems();
            expect(res).toEqual(expected)
        })
    })
}


function getItemById(id,expected){
    describe('get item by id', ()=> { 
        beforeEach(async() => {
            await dao.dropTableI();
            await dao.newTableI();
            let sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
            await dao.run(sql,[1, "a new item", 10.99, 1, 2]);
        })
    
        test('get item by id', async () => {
            let res = await i.getItemById(id);
            expect(res).toEqual(expected)
        })
    })
}


function createItem(expected,json){
    describe('add item', ()=> { 
    beforeEach(async() => {
        await dao.dropTableI();
        await dao.newTableI();
        await dao.dropTableSKUItems();
        await dao.newTableSKUItems();
        let sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
        await dao.run(sql,["1",1,"2021/11/29 12:30"]);
        sql="INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
        await dao.run(sql,["2",2,"2021/11/29 12:30"]);
        sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
        await dao.run(sql,[13, "thing", 99, 4, 2]);
        sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
        await dao.run(sql,[1, "hello", 99, 2, 2]);
    })

    test('add item', async () => {
        let res = await i.createItem(json);
        expect(res).toEqual(expected)
    })
})}


function modyfyItem(expected,json,id){
    describe('edit item', ()=> { 
        beforeEach(async() => {
            await dao.dropTableI();
            await dao.newTableI();
            let sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
            await dao.run(sql,[13, "thing", 99, 2, 2]);
        })
    
        test('edit item', async () => {
            let res = await i.modifyItem(json,id);
            expect(res).toEqual(expected)
        })
    })
}

function deleteItem(expected,id){
    describe('delete item', ()=> { //
        beforeEach(async() => {
            await dao.dropTableI();
            await dao.newTableI();
            let sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
            await dao.run(sql,[13, "thing", 99, 2, 2]);
        })
    
        test('delete item', async () => {
            let res = await i.deleteItem(id);
            expect(res).toEqual(expected)
        })
    })
    
}