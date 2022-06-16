/**
 *  UNIT TEST: itemDAO
 */

/* --------- IMPORT MODULES --------- */
const IDAO    = require('../../../db/itemDAO');
const mockDAO   = require('../Database/mockDAO');

/* --------- INITIALIZATION --------- */
const i = new IDAO(mockDAO);

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
        mockDAO.all.mockReset();
        mockDAO.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "testError"});
            });
        });

})


//200
getItems("Success",Error);

})



/*
------------------------------------------------------
|          GET  /api/items/:id             |
------------------------------------------------------
*/

describe('get item by id', ()=> { 
    beforeAll(async () => {
        mockDAO.get.mockReset();
        mockDAO.get.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "testError"});
            });
        })
})



//500
getItemById("Error",tis[0].id,tis[0].supplierId,tis[0]);

})



/*
------------------------------------------------------
|             POST  /api/item              |
------------------------------------------------------
*/



describe('add item', ()=> { 
    beforeAll(async () => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "testError"});
            });
        })
})


//201
createItem("Error",tis[0],tis[0]);

})




/*
------------------------------------------------------
|            PUT  /api/item/:id            |
------------------------------------------------------
*/



describe('edit item', ()=> { 
    beforeAll(async () => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "testError"});
            });
        })
})



//200
modyfyItem("error",tis2,tis[0].id,tis[0].supplierId,tis1);

})



/*
------------------------------------------------------
|            DELETE  /api/item/:id         |
------------------------------------------------------
*/


describe('delete item', ()=> { //
    beforeAll(async () => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "testError"});
            });
        })
})



//204
deleteItem("Error",tis[0],tis[0].id,tis[0].supplierId)



})


/*
------------------------------------------------------
|            GET        getItemBySupSKUID              |
------------------------------------------------------
*/


describe('get item skuid an supplier', ()=> { //

    beforeAll(async () => {
        mockDAO.get.mockReset();
        mockDAO.get.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "testError"});
            });
        })
})



//204
getItemBySupSKUID("error",tis[0],tis[0].SKUId, tis[0].supplierId);



})





/*
------------------------------------------------------
|            GET        getItemBySupId              |
------------------------------------------------------
*/


describe('get item id and supplier', ()=> { //
    beforeAll(async () => {
        mockDAO.get.mockReset();
        mockDAO.get.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "testError"});
            });
        })
})



//204
getItemBySupId("error",Error,tis[0].id, tis[0].supplierId);



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


function modyfyItem(name,expected,id,supplierId,json){


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
expect(error).toBeInstanceOf(expected);
}
})

}