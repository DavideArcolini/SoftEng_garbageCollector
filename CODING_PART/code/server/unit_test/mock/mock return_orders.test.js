/**
 *      TESTING CLASS: RETURN ORDERS
 * ===========================
 * 
*/

'use strict'

/* ------------ MODULE IMPORT ------------ */
const dao = require("../test_DB/mock_dao");
const REOController = require("../,,/controller/ReturnOrderController");
/* ------------ INITIALIZATION ------------ */
const REO = new REOController(dao);
/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |            RETURN ORDERS                         |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/

/**
 * API:
 *              GET /api/returnOrders/:id
 * =================================================
 */
 describe('get internal order by id', () => {
    beforeEach( () => {
        dao.all.mockReset();
        dao.all.mockReturnValueOnce([
            {
              id: 3,
              returnDate: '2021/11/29 09:33',
              restockOrderId: 1,
              SKUId: 12,
              description: 'a product',
              price: 10.99,
              RFID: '12345678901234567890123456789016'
            },
            {
              id: 3,
              returnDate: '2021/11/29 09:33',
              restockOrderId: 1,
              SKUId: 180,
              description: 'another product',
              price: 11.99,
              RFID: '12345678901234567890123456789038'
            }
          ]).mockReturnValueOnce(null);
    })

    
    test('get internal order by id', async() => {
        let res = await REO.getReturnOrderById(3);
        console.log(res)
        expect(res).toEqual({
            id: 3,
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
        res = await REO.getReturnOrderById(5);
        console.log(res)
        expect(res).toEqual({message: "Not Found"});
    })
    
});

/**
 * API:
 *                GET /api/returnOrders
 * =================================================
 */
 describe('get return orders', () => {
    beforeEach( () => {
        dao.all.mockReset();
        dao.all.mockReturnValueOnce([
            { id: 2, returnDate: '2021/11/29 09:33', restockOrderId: 1 },
            { id: 3, returnDate: '2021/11/29 09:33', restockOrderId: 1 }
          ]).mockReturnValueOnce(
            [
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
          ).mockReturnValueOnce([
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
          ])
    })

    
    test('get return orders', async() => {
        let res = await REO.getReturnOrders();
        console.log(res)
        expect(res).toEqual([{
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
          },{
            id: 3,
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
          }]);
        
    })
    
});

/**
 * API:
 *              POST /api/returnOrder
 * =================================================
 */
 describe('create return order', () => {
    beforeEach( () => {
        dao.get.mockReset();
        dao.get.mockReturnValueOnce({id:1}).mockReturnValueOnce({id:2});
        dao.run.mockReset();
        dao.run.mockReturnValueOnce({ id: 2 }).mockReturnValueOnce({id:3});
  
  
    })
  
    
    test('create return order', async() => {
  
        let returnDate = "2021/11/29 09:33";
        const products= [{SKUId:12,description:"a product",price:10.99,RFID: '12345678901234567890123456789038'},
                        {SKUId:180,description: "another product",price:11.99,RFID: '12345678901234567890123456789038'}];
        console.log(products);
        let customerId = 1;
  
        let res = await REO.createReturnOrder(returnDate,1,products);
        console.log(res)
        expect(res).toEqual(2);
  
        res =await REO.createReturnOrder(returnDate,1,products);
        console.log(res)
        expect(res).toEqual(3);
      
    })
    
  });

  /**
 * API:
 *            DELETE /api/returnOrder/:id
 * =================================================
 */
   describe('delete return order', () => {
    beforeEach( () => {
        dao.run.mockReset();
        dao.run.mockReturnValueOnce({ id: 1 }).mockReturnValueOnce({id:2});
  
  
    })
  
    
    test('delete return order', async() => {
  
        let res = await REO.deleteReturnOrder(1);
        console.log(res)
        expect(res).toEqual(1);
  
        res = await REO.deleteReturnOrder(2);
        console.log(res)
        expect(res).toEqual(2);
      
    })
    
  });