/**
 *      TESTING CLASS: RETURN ORDERS
 * ===========================
 * 
*/

'use strict'

/* ------------ MODULE IMPORT ------------ */
const dao = require("../test_DB/mock_dao");
const REOController = require("../../controller/ReturnOrderController");
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
 describe('get return order by id', () => {
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

    
    test('get return order by id', async() => {
        let res = await REO.getReturnOrderById(3);
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
        expect(res).toEqual({message: "Not Found"});
    })
    test('get return order failed', async()=>{
      dao.all.mockReset();
      dao.all.mockImplementation(() => {
        throw new TypeError();
      });
      try{
        res = await REO.getReturnOrderById(1);
      }catch (error) {
        expect(error).toBeInstanceOf(TypeError);
      }
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

    test('triggering error', async () => {
      dao.all.mockReset();
      dao.all.mockImplementation(async () => {
        throw new TypeError();
      });

      try {
        let res = await REO.getReturnOrders();
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
      }
    });
    
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
        
  
        let res = await REO.createReturnOrder(returnDate,1,products);
        expect(res).toEqual(2);
  
        res =await REO.createReturnOrder(returnDate,1,products);
        expect(res).toEqual(3);
      
    })
    test('creation failed', async () => {
      let returnDate = "2021/11/29 09:33";
        
      let restockOrderId = 1;
      // should raise an error
      try {
        let res = await REO.createReturnOrder(returnDate,undefined,restockOrderId);
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
      }
    })

    test('database error', async () => {
      let returnDate = "2021/11/29 09:33";
      const products= [{SKUId:12,description:"a product",price:10.99,RFID: '12345678901234567890123456789038'},
                      {SKUId:180,description: "another product",price:11.99,RFID: '12345678901234567890123456789038'}];
      let customerId = 1;

      dao.run.mockReset();
      dao.run.mockImplementation(() => {
        throw new TypeError();
      });

      try {
        await REO.createReturnOrder(returnDate, customerId, products);
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
      }
    });
      

    
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
        expect(res).toEqual(1);
  
        res = await REO.deleteReturnOrder(2);
        expect(res).toEqual(2);
      
    })
    test('delete return order failed', async()=>{
      dao.run.mockReset();
      dao.run.mockImplementation(() => {
        throw new TypeError();
      });
      try{
        res = await REO.deleteReturnOrder(1);
      }catch (error) {
        expect(error).toBeInstanceOf(TypeError);
      }
    })


    
  });