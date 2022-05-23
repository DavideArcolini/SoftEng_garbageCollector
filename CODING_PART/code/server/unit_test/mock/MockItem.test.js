const dao = require("../test_DB/mock_dao");
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


//200
getItems([{
    id:1,
    description : "a new item",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
}], [{
    id:1,
    description : "a new item",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
}]);

//500? throw error?
getItems([], 500);


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
},{
    id:1,
    description : "a new item",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
});

//404
getItemById({id: 1}, undefined, 404);

//500
getItemById(undefined, undefined, 500);

/*
                                ------------------------------------------------------
                                |             POST  /api/Item              |
                                ------------------------------------------------------
*/


//201
createItem([1,undefined,undefined], 201, 201, {
    id : 12,
    description : "a new item",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
})

//404 SKUId doesn't exist
createItem([undefined,undefined,undefined], 201, 404, {
    id : 12,
    description : "a new item",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
})

//404 supplier already sell id
createItem([1,1,undefined], 201, 422, {
    id : 12,
    description : "a new item",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
})

//404 supplier already sell skuid
createItem([1,undefined,1], 201, 422, {
    id : 12,
    description : "a new item",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
})


//503
createItem([undefined,undefined,undefined], 201, 503, undefined)

/*
                                ------------------------------------------------------
                                |            PUT  /api/Item/:id            |
                                ------------------------------------------------------
*/


//200
modyfyItem(1, 200, 200, {
    newDescription : "a new sku",
    newPrice : 10.99
}, {id: 1})

//404 Item doesn't exist
modyfyItem(undefined, 200, 404,{
    newDescription : "a new sku",
    newPrice : 10.99
}, {id: 1})

//503
modyfyItem(1, 200, 503, undefined, undefined)


/*
                                ------------------------------------------------------
                                |            DELETE  /api/Item/:id         |
                                ------------------------------------------------------
*/


//204
deleteItem(1,204,204,{id: 1})

//404
deleteItem(undefined,204,404,{id: 1})

//503
deleteItem(1,204,503,undefined)


/*
                                ======================================================================
                               ||        DEFINITIONS OF THE TESTING FUNCTIONS TEST DESCRIPTOR        ||
                                ======================================================================
*/


function getItems(resultget,expected){
    describe('get items', ()=> { 
        beforeEach(() => {
            dao.all.mockReset();
            dao.all.mockReturnValue(resultget)
        })
    
        test('get item', async () => {
            let res = await i.getItems();
            expect(res).toEqual(expected)
        })
    })
}


function getItemById(id,resultget,expected){
    describe('get item by id', ()=> { 
        beforeEach(() => {
            dao.get.mockReset();
            dao.get.mockReturnValue(resultget)
        })
    
        test('get item by id', async () => {
            let res = await i.getItemById(id);
            expect(res).toEqual(expected)
        })
    })
}


function createItem(resultget,resultrun,expected,json){
    describe('add item', ()=> { 
    beforeEach(() => {
        dao.get.mockReset();
        dao.get.mockReturnValueOnce(resultget[0]).mockReturnValueOnce(resultget[1]).mockReturnValueOnce(resultget[2]);
        dao.run.mockReset();
        dao.run.mockReturnValueOnce(resultrun);
    })

    test('add item', async () => {
        let res = await i.createItem(json);
        expect(res).toEqual(expected)
    })
})}

function modyfyItem(resultget,resultrun,expected,json,id){
    describe('edit item', ()=> { 
        beforeEach(() => {
            dao.get.mockReset();
            dao.get.mockReturnValueOnce(resultget)
            dao.run.mockReset();
            dao.run.mockReturnValueOnce(resultrun)
        })
    
        test('edit item', async () => {
            let res = await i.modifyItem(json,id);
            expect(res).toEqual(expected)
        })
    })
}

function deleteItem(resultget,resultrun,expected,id){
    describe('delete item', ()=> { //
        beforeEach(() => {
            dao.get.mockReset();
            dao.get.mockReturnValueOnce(resultget)
            dao.run.mockReset();
            dao.run.mockReturnValueOnce(resultrun)
        })
    
        test('delete item', async () => {
            let res = await i.deleteItem(id);
            expect(res).toEqual(expected)
        })
    })
    
}