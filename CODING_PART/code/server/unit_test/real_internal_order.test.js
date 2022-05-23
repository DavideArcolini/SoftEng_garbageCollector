const dao = require("./mockDB/testDao");
const IOController = require("../controller/InternalOrderController");
const IO = new IOController(dao);

/**
 * API:
 *            GET /api/internalOrders/:id
 * =================================================
 */
 function getInternalOrderById(req,expected){
    describe('get internal order by id',()=>{
      
      beforeEach(async() => {
        await IO.dao.dropTableIO();
        await IO.dao.newTableIO();
        await IO.createInternalOrder('2022/5/12 17:44', [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ], 1)
        
      })

    test('get internal order by id',async()=>{
        let res = await IO.getInternalOrderById(req);
        expect(res).toEqual(expected);
    })
  });
}

getInternalOrderById(1,{
    id: 1,
    issueDate: '2022/5/12 17:44',
    state: 'ISSUED',
    customerId: 1,
    products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
  });

  getInternalOrderById(100,{message: "Not Found"});

   /**
  * API:
  *                GET /api/internalOrders
  * =================================================
  */
    function getInternalOrders(expected){
        describe('get internal orders',()=>{
          
          beforeEach(async() => {
            await IO.dao.dropTableIO();
            await IO.dao.newTableIO();
            await IO.createInternalOrder('2022/5/12 17:44', [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ], 1);
            await IO.createInternalOrder('2022/5/12 17:44', [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ], 1);
            await IO.createInternalOrder('2022/5/12 17:44', [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ], 1);
            await IO.modifyInternalOrderState(1,'COMPLETED',[{SkuID:1,RFID:"12345678901234567890123456789016"}]);
          })
    
        test('get internal orders',async()=>{
            let res = await IO.getInternalOrders();
            expect(res).toEqual(expected);
        })
      });
    }
    
    getInternalOrders([
        {
            id: 1,
            issueDate: '2022/5/12 17:44',
            state: 'COMPLETED',
            customerId: 1,
            products: [ { SKUId: 1, description: null, price: 0.01, RFID:"12345678901234567890123456789016" } ],
          },
          {
            id: 2,
            issueDate: '2022/5/12 17:44',
            state: 'ISSUED',
            customerId: 1,
            products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
          },
          {
            id: 3,
            issueDate: '2022/5/12 17:44',
            state: 'ISSUED',
            customerId: 1,
            products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
          }
    ])
    
/**
 * API:
 *                GET /api/internalOrdersIssued
 * =================================================
 */
 function getInternalOrdersIssued(expected){
    describe('get internal orders issued',()=>{
      
      beforeEach(async() => {
        await IO.dao.dropTableIO();
        await IO.dao.newTableIO();
        await IO.createInternalOrder('2022/5/12 17:44', [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ], 1);
        await IO.createInternalOrder('2022/5/12 17:44', [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ], 1);
        await IO.createInternalOrder('2022/5/12 17:44', [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ], 1);
        
      })

    test('get internal orders issued',async()=>{
        let res = await IO.getInternalOrdersIssued();
        expect(res).toEqual(expected);
    })
  });
}

getInternalOrdersIssued([
    {
        id: 1,
        issueDate: '2022/5/12 17:44',
        state: 'ISSUED',
        customerId: 1,
        products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
      },
      {
        id: 2,
        issueDate: '2022/5/12 17:44',
        state: 'ISSUED',
        customerId: 1,
        products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
      },
      {
        id: 3,
        issueDate: '2022/5/12 17:44',
        state: 'ISSUED',
        customerId: 1,
        products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
      }
])

/**
  * API:
  *                GET /api/internalOrdersAccepted
  * =================================================
  */
 function getInternalOrdersAccepted(expected){
    describe('get internal orders accepted',()=>{
      
      beforeEach(async() => {
        await IO.dao.dropTableIO();
        await IO.dao.newTableIO();
        await IO.createInternalOrder('2022/5/12 17:44', [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ], 1);
        await IO.createInternalOrder('2022/5/12 17:44', [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ], 1);
        await IO.createInternalOrder('2022/5/12 17:44', [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ], 1);
        await IO.modifyInternalOrderState(1,'ACCEPTED',null);
        await IO.modifyInternalOrderState(2,'ACCEPTED',null);
        await IO.modifyInternalOrderState(3,'ACCEPTED',null);
      })

    test('get internal orders accepted',async()=>{
        let res = await IO.getInternalOrdersAccepted();
        expect(res).toEqual(expected);
    })
  });
}

getInternalOrdersAccepted([
    {
        id: 1,
        issueDate: '2022/5/12 17:44',
        state: 'ACCEPTED',
        customerId: 1,
        products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
      },
      {
        id: 2,
        issueDate: '2022/5/12 17:44',
        state: 'ACCEPTED',
        customerId: 1,
        products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
      },
      {
        id: 3,
        issueDate: '2022/5/12 17:44',
        state: 'ACCEPTED',
        customerId: 1,
        products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
      }
])

/**
 * API:
 *             POST /api/internalOrders
 * =================================================
 */
 function createInternalOrder(issueDate,products,customerId,expected){
    describe('create internal order',()=>{
      
      beforeEach(async() => {
        await IO.dao.dropTableIO();
        await IO.dao.newTableIO();
       
        
      })

    test('create internal order',async()=>{
        let res = await IO.createInternalOrder(issueDate,products,customerId);
        res = await IO.getInternalOrderById(res);
        expect(res).toEqual(expected);
    })
  });
}

createInternalOrder('2022/5/12 17:44', [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ], 1,{
    id: 1,
    issueDate: '2022/5/12 17:44',
    state: 'ISSUED',
    customerId: 1,
    products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
  });
  createInternalOrder('2022/5/12 17:44', [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ], 1,{
    id: 1,
    issueDate: '2022/5/12 17:44',
    state: 'ISSUED',
    customerId: 1,
    products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
  });

/**
 * API:
 *            PUT /api/internalOrders/:id
 * =================================================
 */
 function modifyInternalOrderState(id,newState,products,expected){
    describe('modify internal order state',()=>{
      
      beforeEach(async() => {
        await IO.dao.dropTableIO();
        await IO.dao.newTableIO();
        await IO.createInternalOrder('2022/5/12 17:44', [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ], 1);
        await IO.createInternalOrder('2022/5/12 17:44', [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ], 1);
        
      })

    test('modify internal order state',async()=>{
        let res = await IO.modifyInternalOrderState(id,newState,products);
        expect(res).toEqual(expected);
    })
  });
}

modifyInternalOrderState(1,'ACCEPTED',null,1);
modifyInternalOrderState(2,'COMPLETED',[{SkuID:1,RFID:"12345678901234567890123456789016"}],2);
modifyInternalOrderState(5,'REFUSED',null,{message: "Not Found"});

/**
 * API:
 *                DELETE /api/internalOrders/:id
 * =================================================
 */
 function deleteInternalOrder(req){
    describe('delete internal order',()=>{
      
      beforeEach(async() => {
        await IO.dao.dropTableIO();
        await IO.dao.newTableIO();
        await IO.createInternalOrder('2022/5/12 17:44', [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ], 1);
        await IO.createInternalOrder('2022/5/12 17:44', [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ], 1);
        
      })

    test('delete internal order',async()=>{
        let res = await IO.deleteInternalOrder(req);
        res= await IO.getInternalOrderById(req);
        expect(res).toEqual({message: "Not Found"});
    })
  });
}

deleteInternalOrder(1);
deleteInternalOrder(2);