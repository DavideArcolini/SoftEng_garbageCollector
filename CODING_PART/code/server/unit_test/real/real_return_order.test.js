/**
 *      TESTING CLASS: RETURN ORDERS 
 * ==================================
 * 
*/
'use strict'

/* ------------ MODULE IMPORT ------------ */
const TestDAO = require("../test_DB/TestDAO");
const dao = new TestDAO();
/* ------------ INITIALIZATION ------------ */
const REOController = require("../../controller/ReturnOrderController");
const REO = new REOController(dao);

/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |           RETURN ORDERS                          |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/

/**
 * API:
 *              GET /api/returnOrders/:id
 * =================================================
 */
 function getReturnOrderById(req,expected){
    describe('get return order by id',()=>{
      
      beforeEach(async() => {
        await REO.dao.dropTableRTO();
        await REO.dao.newTableRTO();
        await REO.createReturnOrder('2021/11/29 09:33', 1, [
            {
              SKUId: 12,
              description: 'a product',
              price: 10.99,
              RFID: '12345678901234567890123456789016'
            },
            {
              SKUId: 180,
              description: 'another product',
              price: 11.99,
              RFID: '12345678901234567890123456789038'
            }
          ]);

        
      })

    test('get return order by id',async()=>{
        let res = await REO.getReturnOrderById(req);
        expect(res).toEqual(expected);
    })
  });
}

getReturnOrderById(1,{
    id: 1,
    returnDate: '2021/11/29 09:33',
    restockOrderId: 1,
    products: [
      {
        SKUId: 12,
        description: 'a product',
        price: 10.99,
        RFID: '12345678901234567890123456789016'
      },
      {
        SKUId: 180,
        description: 'another product',
        price: 11.99,
        RFID: '12345678901234567890123456789038'
      }
    ]
  });
getReturnOrderById(5,{message:"Not Found"});




/**
 * API:
 *                GET /api/returnOrders
 * =================================================
 */
 function getReturnOrders(expected){
    describe('get return orders',()=>{
      
      beforeEach(async() => {
        await REO.dao.dropTableRTO();
        await REO.dao.newTableRTO();
        await REO.createReturnOrder('2021/11/29 09:33', 1, [
            {
              SKUId: 12,
              description: 'a product',
              price: 10.99,
              RFID: '12345678901234567890123456789016'
            },
            {
              SKUId: 180,
              description: 'another product',
              price: 11.99,
              RFID: '12345678901234567890123456789038'
            }
          ]);
          await REO.createReturnOrder('2021/11/29 09:33', 1, [
            {
              SKUId: 12,
              description: 'a product',
              price: 10.99,
              RFID: '12345678901234567890123456789016'
            },
            {
              SKUId: 180,
              description: 'another product',
              price: 11.99,
              RFID: '12345678901234567890123456789038'
            }
          ]);
          
        

      })

    test('get return orders',async()=>{
        let res = await REO.getReturnOrders();
        expect(res).toEqual(expected);
    })
  });
}

getReturnOrders([
    {
        id: 1,
        returnDate: '2021/11/29 09:33',
        restockOrderId: 1,
        products: [
          {
            SKUId: 12,
            description: 'a product',
            price: 10.99,
            RFID: '12345678901234567890123456789016'
          },
          {
            SKUId: 180,
            description: 'another product',
            price: 11.99,
            RFID: '12345678901234567890123456789038'
          }
        ]
      },
      {
        id: 2,
        returnDate: '2021/11/29 09:33',
        restockOrderId: 1,
        products: [
          {
            SKUId: 12,
            description: 'a product',
            price: 10.99,
            RFID: '12345678901234567890123456789016'
          },
          {
            SKUId: 180,
            description: 'another product',
            price: 11.99,
            RFID: '12345678901234567890123456789038'
          }
        ]
      }
])

/**
 * API:
 *              POST /api/returnOrder
 * =================================================
 */
 function createReturnOrder(returnDate,restockOrderId,products,expected){
    describe('create return order',()=>{
      
      beforeEach(async() => {
        await REO.dao.dropTableRTO();
        await REO.dao.newTableRTO();
        
      })

    test('create return order',async()=>{
        let res = await REO.createReturnOrder(returnDate,restockOrderId,products);
        res = await REO.getReturnOrderById(res);
        expect(res).toEqual(expected);

    })
  });
}
createReturnOrder('2021/11/29 09:33', 1, [
    {
      SKUId: 12,
      description: 'a product',
      price: 10.99,
      RFID: '12345678901234567890123456789016'
    },
    {
      SKUId: 180,
      description: 'another product',
      price: 11.99,
      RFID: '12345678901234567890123456789038'
    }
  ], {
    id: 1,
    returnDate: '2021/11/29 09:33',
    restockOrderId: 1,
    products: [
      {
        SKUId: 12,
        description: 'a product',
        price: 10.99,
        RFID: '12345678901234567890123456789016'
      },
      {
        SKUId: 180,
        description: 'another product',
        price: 11.99,
        RFID: '12345678901234567890123456789038'
      }
    ]
  });
  createReturnOrder('2021/11/29 09:33', 1, [
    {
      SKUId: 12,
      description: 'a product',
      price: 10.99,
      RFID: '12345678901234567890123456789016'
    },
    {
      SKUId: 180,
      description: 'another product',
      price: 11.99,
      RFID: '12345678901234567890123456789038'
    }
  ], {
    id: 1,
    returnDate: '2021/11/29 09:33',
    restockOrderId: 1,
    products: [
      {
        SKUId: 12,
        description: 'a product',
        price: 10.99,
        RFID: '12345678901234567890123456789016'
      },
      {
        SKUId: 180,
        description: 'another product',
        price: 11.99,
        RFID: '12345678901234567890123456789038'
      }
    ]
  });

  /**
 * API:
 *            DELETE /api/returnOrder/:id
 * =================================================
 */

   function deleteReturnOrder(req){
    describe('delete return order',()=>{
      
      beforeEach(async() => {
        await REO.dao.dropTableRTO();
        await REO.dao.newTableRTO();
        await REO.createReturnOrder('2021/11/29 09:33', 1, [
            {
              SKUId: 12,
              description: 'a product',
              price: 10.99,
              RFID: '12345678901234567890123456789016'
            },
            {
              SKUId: 180,
              description: 'another product',
              price: 11.99,
              RFID: '12345678901234567890123456789038'
            }
          ]);
          await REO.createReturnOrder('2021/11/29 09:33', 1, [
            {
              SKUId: 12,
              description: 'a product',
              price: 10.99,
              RFID: '12345678901234567890123456789016'
            },
            {
              SKUId: 180,
              description: 'another product',
              price: 11.99,
              RFID: '12345678901234567890123456789038'
            }
          ]);

        
      })

    test('delete return order',async()=>{
        let res = await REO.deleteReturnOrder(req);
        res = await REO.getReturnOrderById(req);
        expect(res).toEqual({message: "Not Found"});
    })
  });
}

deleteReturnOrder(1);
deleteReturnOrder(2);