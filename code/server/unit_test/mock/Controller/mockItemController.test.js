/**
 *  INTEGRATION TEST: ItemController
 *           VERSION: mock
 * --------------------------------------------
 * Services do access the database (although it
 * is a test database).
*/

/* --------- IMPORT MODULES --------- */
const TDController         = require('../../../controller/ItemController');
const skuDAO                = require('../Database/mockSKUDAO');
const itemDAO    = require('../Database/mockItemDAO');

/* --------- INITIALIZATION --------- */
const i         = new TDController(skuDAO,itemDAO);

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

let ih=[{
    id:1,
    description : "a new item",
    price : 10.99,
    SKUId : 1,
    supplierId : 2
},{
    id:1,
    description : "a new item",
    price : 10.99,
    SKUId : null,
    supplierId : 2
}];
/*
                                ------------------------------------------------------
                                |                 GET  /api/items                    |
                                ------------------------------------------------------
*/

describe('get items', ()=> { 
    beforeAll(() => {
        itemDAO.getItems.mockReset();
        itemDAO.getItems.mockReturnValueOnce(ih).mockImplementationOnce(() => {
            throw new Error();
        })
    })

//200
getItems(200);

//500? throw error?
getItems("Quasiii");
})

/*
                                ------------------------------------------------------
                                |          GET  /api/Items/:id             |
                                ------------------------------------------------------
*/


describe('get item by id', ()=> { 
    beforeAll(() => {
        itemDAO.getItemById.mockReset();
        itemDAO.getItemById.mockReturnValue(ih[0]).mockReturnValue(ih[1]).mockReturnValue(undefined).mockImplementationOnce(() => {
            throw new Error();
        })
    })


//200 skuid not null
getItemById({id: 1,supplierId : 2},ih[0]);

//200 skuid not null
getItemById({id: 1,supplierId : 2},ih[1]);

//404
getItemById({id: 1,supplierId : 2}, ERROR_404);

//500
getItemById({id: 1,supplierId : 2}, "Arcane final is ABSURD");
})

/*
                                ------------------------------------------------------
                                |             POST  /api/Item              |
                                ------------------------------------------------------
*/


describe('add item', ()=> { 
    beforeAll(() => {
        skuDAO.getSKUByID.mockReset();
        skuDAO.getSKUByID.mockReturnValueOnce(ih[0]).mockReturnValueOnce(ih[1]).mockReturnValueOnce(ih[0]).mockReturnValueOnce(undefined)
        .mockImplementationOnce(() => {
            throw new Error();
        })
        itemDAO.getItemBySupId.mockReset();
        itemDAO.getItemBySupId.mockReturnValueOnce(ih[0]).mockReturnValueOnce(ih[0]).mockReturnValueOnce(undefined)
        itemDAO.getItemBySupSKUID.mockReset();
        itemDAO.getItemBySupSKUID.mockReturnValueOnce(ih[0]).mockReturnValueOnce(undefined)
        itemDAO.createItem.mockReset();
        itemDAO.createItem.mockReturnValueOnce(ih[0])
    })

//201
createItem(MESSG_201,ih[0])

//404 SKUId doesn't exist
createItem(ERROR_404,ih[0])

//404 supplier already sell id
createItem(ERROR_422,ih[0])

//404 supplier already sell skuid
createItem(ERROR_422,ih[0])

//503
createItem("Mancano altri 3 file =(",ih[0])
})

/*
                                ------------------------------------------------------
                                |            PUT  /api/Item/:id            |
                                ------------------------------------------------------
*/


describe('edit item', ()=> { 
    beforeAll(() => {
        itemDAO.getItemById.mockReset();
        itemDAO.getItemById.mockReturnValueOnce(ih[0]).mockReturnValueOnce(undefined).mockImplementationOnce(() => {
            throw new Error();
        })
        itemDAO.modifyItem.mockReset();
        itemDAO.modifyItem.mockReturnValueOnce(ih[0])
    })

//200
modyfyItem(MESSG_200,ih[0], {id: 1,supplierId : 2})

//404 Item doesn't exist
modyfyItem(ERROR_404,ih[0], {id: 1,supplierId : 2})

//503
modyfyItem("Zanzara vaffanculo!!!!!!",ih[0], {id: 1,supplierId : 2})
})


/*
                                ------------------------------------------------------
                                |            DELETE  /api/Item/:id         |
                                ------------------------------------------------------
*/


describe('delete item', ()=> { //
    beforeAll(() => {
        itemDAO.deleteItem.mockReset();
        itemDAO.deleteItem.mockReturnValueOnce(ih[0]).mockImplementationOnce(() => {
            throw new Error();
        })

    })

//204
deleteItem(MESSG_204,{id: 1,supplierId : 2})


//503
deleteItem("Fossi viva ti riammazzerei con piacere stronza zanzara",{id: 1,supplierId : 2})
})


/*
                                ======================================================================
                               ||        DEFINITIONS OF THE TESTING FUNCTIONS TEST DESCRIPTOR        ||
                                ======================================================================
*/


function getItems(expected){
    
        test('get item', async () => {
            try {
                let res = await i.getItems();
                expect(res).toEqual(expected);
            } catch (error) {
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