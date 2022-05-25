/**
 *      TESTING CLASS: RESTOCK ORDERS 
 * ==================================
 * 
*/
'use strict'

/* ------------ MODULE IMPORT ------------ */
const TestDAO = require("../test_DB/TestDAO");
const dao = new TestDAO();
const ROController = require("../../controller/RestockOrderController");
/* ------------ INITIALIZATION ------------ */
const RO = new ROController(dao);

/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |            RESTOCK ORDERS                        |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/
function getRestockOrderById(req,expected){
    describe('get restok order by id',()=>{
      
      beforeAll(async() => {
        //await RO.dao.dropTableRO();
        await RO.dao.deleteAllRestockOrders();
        //await RO.dao.newTableRO();
        await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ])
        
      })

    test('get restock order by id',async()=>{
        let res = await RO.getRestockOrderById(req);
        expect(res).toEqual(expected);
    })

    afterAll(async()=>{
      await RO.dao.deleteAllRestockOrders();
    })
    
  });
}

getRestockOrderById(1,{
    id: 1,
    issueDate: '2022/5/12 17:44',
    state: 'ISSUED',
    supplierId: 7,
    products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
    skuItems: []
  });

  getRestockOrderById(100,{message: "Not Found"});

/**
 * API:
 *              GET /api/restockOrders
 * =================================================
 */


function getRestockOrders(expected){
    describe('get restok orders',()=>{
      
      beforeAll(async() => {
        await RO.dao.deleteAllRestockOrders();
        //await RO.dao.newTableRO();
        await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ]);
        await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ]);
        await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ]);
      })

    test('get restock orders',async()=>{
        let res = await RO.getRestockOrders();
        expect(res).toEqual(expected);
    })
    afterAll(async()=>{
      await RO.dao.deleteAllRestockOrders();
    })
  });
}

getRestockOrders([
  {
    id: 1,
    issueDate: '2022/5/12 17:44',
    state: 'ISSUED',
    supplierId: 7,
    products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
    skuItems: []
  },
  {
    id: 2,
    issueDate: '2022/5/12 17:44',
    state: 'ISSUED',
    supplierId: 7,
    products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
    skuItems: []
  },
  {
    id: 3,
    issueDate: '2022/5/12 17:44',
    state: 'ISSUED',
    supplierId: 7,
    products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
    skuItems: []
  }
])


/**
 * API:
 *         GET /api/restockOrdersIssued
 * =================================================
 */
 function getRestockOrdersIssued(expected){
  describe('get restok orders issued',()=>{
    
    beforeAll(async() => {
      //await RO.dao.dropTableRO();
      //await RO.dao.newTableRO();
      await RO.dao.deleteAllRestockOrders();
      await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ]);
      await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ]);
      await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ]);
      
    })

  test('get restock orders',async()=>{
      let res = await RO.getRestockOrdersIssued();
      expect(res).toEqual(expected);
  })
  afterAll(async()=>{
    await RO.dao.deleteAllRestockOrders();
  })
});
}

getRestockOrdersIssued([
{
  id: 1,
  issueDate: '2022/5/12 17:44',
  state: 'ISSUED',
  supplierId: 7,
  products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
  skuItems: []
},
{
  id: 2,
  issueDate: '2022/5/12 17:44',
  state: 'ISSUED',
  supplierId: 7,
  products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
  skuItems: []
},
{
  id: 3,
  issueDate: '2022/5/12 17:44',
  state: 'ISSUED',
  supplierId: 7,
  products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
  skuItems: []
}
]);

/**
 * API:
 *          POST /api/restockOrder
 * ==========================================================
 */

 function createRestockOrder(issueDate,supplierId,products,expected){
  describe('create restock order',()=>{
    
    beforeAll(async() => {
      //await RO.dao.dropTableRO();
      //await RO.dao.newTableRO();
      await RO.dao.deleteAllRestockOrders();
    })

  test('create restock order',async()=>{
      let res = await RO.createRestockOrder(issueDate,supplierId,products);
      expect(res).toEqual(expected);
  })
  afterAll(async()=>{
    await RO.dao.deleteAllRestockOrders();
  })
});
}



createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],1);
createRestockOrder('2022/5/12 17:44',7, [
  { SKUId: 12, description: 'a product', price: 10.99, qty: 3 },
  {
    SKUId: 180,
    description: 'another product',
    price: 11.99,
    qty: 2
  }
],1);
/**
 * API:
 *          PUT /api/restockOrder/:id
 * ==========================================================
 */

 function modifyRestockOrderState(id,newState,expected){
  describe('modify restock order state',()=>{
    
    beforeAll(async() => {
      //await RO.dao.dropTableRO();
      //await RO.dao.newTableRO();
      await RO.dao.deleteAllRestockOrders();
      await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ]);
      await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ]);
      await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ]);
    })

  test('modify restock order state',async()=>{
      let res = await RO.modifyRestockOrderState(id,newState);
      expect(res).toEqual(expected);
  })
  afterAll(async()=>{
    await RO.dao.deleteAllRestockOrders();
  })
   
});
}


modifyRestockOrderState(1,'DELIVERED',1);

modifyRestockOrderState(1,'COMPLETEDRETURN',1);


/**
 * API:
 *          DELETE /api/restockOrder/:id
 * ==========================================================
 */
 function deleteRestockOrder(id){
  describe('delete restock order',()=>{
    
    beforeAll(async() => {
      //await RO.dao.dropTableRO();
      //await RO.dao.newTableRO();
      await RO.dao.deleteAllRestockOrders();
      await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ]);
      await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ]);
    })

  test('delete restock order',async()=>{
      let res = await RO.deleteRestockOrder(id);
      res = await RO.getRestockOrderById(id);
      expect(res).toEqual({message: "Not Found"});
  })
  afterAll(async()=>{
    await RO.dao.deleteAllRestockOrders();
  })
  
});
}
deleteRestockOrder(1);
deleteRestockOrder(2);

/**
 * API:
 *          PUT /api/restockOrder/:id/transportNote
 * ==========================================================
 */
 function addTransportNote(id,transportNote,expected){
  describe('add transport note',()=>{
    
    beforeAll(async() => {
      //await RO.dao.dropTableRO();
      //await RO.dao.newTableRO();
      await RO.dao.deleteAllRestockOrders();
      await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ]);
      await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ]);
      await RO.modifyRestockOrderState(1,'DELIVERY');
    })

  test('add transport note',async()=>{
      let res = await RO.addTransportNote(id,transportNote);
      expect(res).toEqual(expected);
  })
  afterAll(async()=>{
    await RO.dao.deleteAllRestockOrders();
  })
});
}
addTransportNote(1,{transportNote:{deliveryDate:"2021/12/29"}},1);
addTransportNote(5,{transportNote:{deliveryDate:"2021/12/29"}},{message: "Not Found"});
addTransportNote(2,{transportNote:{deliveryDate:"2021/12/29"}},{unprocessable: "Cannot put transport note"});

/**
 * API:
 *          PUT /api/restockOrder/:id/skuItems
 * ==========================================================
 */
 function addSkuItems(id,skuItems,expected){
  describe('add sku Items',()=>{
    
    beforeAll(async() => {
     // await RO.dao.dropTableRO();
      //await RO.dao.newTableRO();
      await RO.dao.deleteAllRestockOrders();
      await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 }, { SKUId: 12, description: null, price: 0.01, qty: 1 } ]);
      await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ]);
      await RO.modifyRestockOrderState(1,'DELIVERED');
    })

  test('add sku Items',async()=>{
      let res = await RO.setSkuItems(id,skuItems);
      expect(res).toEqual(expected);
  })
  afterAll(async()=>{
    await RO.dao.deleteAllRestockOrders();
  })
});
}
addSkuItems(1,[{SKUId: 1, rfid:"12345678901234567890123456789016"},{SKUId: 12, rfid: "12345678901234567890123456789017"}],1);
addSkuItems(2,[{SKUId: 1, rfid:"12345678901234567890123456789016"},{SKUId: 12, rfid: "12345678901234567890123456789017"}],{unprocessable: "Cannot put skuItems"});
addSkuItems(5,[{SKUId: 1, rfid:"12345678901234567890123456789016"},{SKUId: 12, rfid: "12345678901234567890123456789017"}],{message: "Not Found"});

