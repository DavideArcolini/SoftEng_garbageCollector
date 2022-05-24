/**
 *      TESTING CLASS: RESTOCK ORDERS
 * ===========================
 * 
*/

'use strict'

/* ------------ MODULE IMPORT ------------ */
const dao = require("../test_DB/mock_dao");
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

/**
 * API:
 *         GET /api/restockOrders/:id
 * =================================================
 */
describe('get restock order by id', () => {
    beforeEach( () => {
        dao.all.mockReset();
        dao.all.mockReturnValueOnce([
            {
              id: 2,
              issueDate: '2022/5/12 17:44',
              state: 'COMPLETEDRETURN',
              supplierId: 7,
              SKUId: 1,
              description: null,
              price: 0.01,
              deliveryDate: '2022/5/12 17:46',
              qty: 1,
              RFID: '00000000000000000000000000000001'
            }
          ]).mockReturnValueOnce([
            {
               
                SKUId: 1,
                RFID: '00000000000000000000000000000001'
              }
          ]).mockReturnValueOnce([
            {
              id: 33,
              issueDate: '2021/11/29 09:33',
              state: 'ISSUED',
              supplierId: 1,
              SKUId: 12,
              description: 'a product',
              price: 10.99,
              deliveryDate: null,
              qty: 3
            },
            {
              id: 33,
              issueDate: '2021/11/29 09:33',
              state: 'ISSUED',
              supplierId: 1,
              SKUId: 180,
              description: 'another product',
              price: 11.99,
              deliveryDate: null,
              qty: 2
            }
          ]).mockReturnValueOnce([])
    })

    
    test('get restock order by id', async() => {
        let res = await RO.getRestockOrderById(2);
        console.log(res)
        expect(res).toEqual({
            id: 2,
            issueDate: '2022/5/12 17:44',
            state: 'COMPLETEDRETURN',
            supplierId: 7,
            transportNote: { deliveryDate: '2022/5/12 17:46' },
            products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
            skuItems: [ { SKUId: 1, RFID: '00000000000000000000000000000001' } ]
          });
        res = await RO.getRestockOrderById(33);
        console.log(res)
        expect(res).toEqual({
            id: 33,
            issueDate: '2021/11/29 09:33',
            state: 'ISSUED',
            supplierId: 1,
            products: [
              { SKUId: 12, description: 'a product', price: 10.99, qty: 3 },
              {
                SKUId: 180,
                description: 'another product',
                price: 11.99,
                qty: 2
              }
            ],
            skuItems: []
          });
    })
    
});

/**
 * API:
 *              GET /api/restockOrders
 * =================================================
 */

describe('get restock orders', () => {
    beforeEach( () => {
        dao.all.mockReset();
        dao.all.mockReturnValueOnce([
            {
              id: 2,
              issueDate: '2022/5/12 17:44',
              state: 'COMPLETEDRETURN',
              supplierId: 7,
              deliveryDate: '2022/5/12 17:46',
            },{
                id: 33,
                issueDate: '2021/11/29 09:33',
                state: 'ISSUED',
                supplierId: 1,
                deliveryDate: null,
              }
          ]).mockReturnValueOnce(
            [{
              id: 2,
              SKUId: 12,
              description: 'a product',
              price: 10.99,
              qty: 3
            }]
          ).mockReturnValueOnce([
            {
               
                SKUId: 1,
                RFID: '00000000000000000000000000000001'
              }
          ]).mockReturnValueOnce([
            {
              id: 33,
              SKUId: 12,
              description: 'a product',
              price: 10.99,
              qty: 3
            }
          ]).mockReturnValueOnce([
            {
               
              SKUId: 1,
              RFID: '00000000000000000000000000000001'
            }
          ])
    })

    
    test('get restock orders', async() => {
        let res = await RO.getRestockOrders();
        console.log(res.length)
        expect(res.length).toEqual([{
          id: 2,
          issueDate: '2022/5/12 17:44',
          state: 'COMPLETEDRETURN',
          supplierId: 1,
          products: [
            { SKUId: 12, description: 'a product', price: 10.99, qty: 3 }
          ],
          skuItems: [ { SKUId: 1, RFID: '00000000000000000000000000000001' } ]
          },
          {
            id: 33,
            issueDate: '2021/11/29 09:33',
            state: 'ISSUED',
            supplierId: 1,
            products: [
              { SKUId: 12, description: 'a product', price: 10.99, qty: 3 }
            ],
            skuItems: [ { SKUId: 1, RFID: '00000000000000000000000000000001' } ]
          }].length);
        
    })
    
});

/**
 * API:
 *         GET /api/restockOrdersIssued
 * =================================================
 */
 describe('get restock orders issued', () => {
    beforeEach( () => {
        dao.all.mockReset();
        dao.all.mockReturnValueOnce([
            {
              id: 2,
              issueDate: '2022/5/12 17:44',
              state: 'ISSUED',
              supplierId: 7,
              deliveryDate: '2022/5/12 17:46',
            },{
                id: 33,
                issueDate: '2021/11/29 09:33',
                state: 'ISSUED',
                supplierId: 1,
                deliveryDate: null,
              }
          ]).mockReturnValueOnce(
            [{
                id: 2,
                SKUId: 1,
                description: null,
                price: 0.01,
                qty: 1,
              }]
          ).mockReturnValueOnce([

          ]).mockReturnValueOnce([
            {
              id: 33,
              SKUId: 12,
              description: 'a product',
              price: 10.99,
              qty: 3
            },
            {
              id: 33,
              SKUId: 180,
              description: 'another product',
              price: 11.99,
              qty: 2
            }
          ]).mockReturnValueOnce([])
    })

    
    test('get restock orders issued', async() => {
        let res = await RO.getRestockOrdersIssued();
        console.log(res)
        expect(res.length).toEqual([{
            id: 2,
            issueDate: '2022/5/12 17:44',
            state: 'ISSUED',
            supplierId: 7,
            products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
            skuItems: [ ]
          },
          {
            id: 33,
            issueDate: '2021/11/29 09:33',
            state: 'ISSUED',
            supplierId: 1,
            products: [
              { SKUId: 12, description: 'a product', price: 10.99, qty: 3 },
              {
                SKUId: 180,
                description: 'another product',
                price: 11.99,
                qty: 2
              }
            ],
            skuItems: []
          }].length);
        
    })
    
});

/**
 * API:
 *          POST /api/restockOrder
 * ==========================================================
 */

 describe('create restock order', () => {
    beforeEach( () => {
        dao.get.mockReset();
        dao.get.mockReturnValueOnce({id:1}).mockReturnValueOnce({id:2});
        dao.run.mockReset();
        dao.run.mockReturnValueOnce({ id: 2 }).mockReturnValueOnce({id:3});


    })

    
    test('create restock orders', async() => {

        let issueDate = "2021/11/29 09:33";
        const products= [{SKUId:12,description:"a product",price:10.99,qty:30},
                        {SKUId:180,description: "another product",price:11.99,qty:20}];
        console.log(products);
        let supplierId = 1;

        let res = await RO.createRestockOrder(issueDate,supplierId,products);
        console.log(res)
        expect(res).toEqual(2);

        res = await RO.createRestockOrder(issueDate,supplierId,products);
        console.log(res)
        expect(res).toEqual(3);
      
    })
    
});

/**
 * API:
 *          PUT /api/restockOrder/:id
 * ==========================================================
 */


 describe('modify restock orders state', () => {
    beforeEach( () => {
        dao.get.mockReset();
        dao.get.mockReturnValueOnce({
            id: 2,
            issueDate: '2022/5/12 17:44',
            state: 'COMPLETEDRETURN',
            supplierId: 7,
            transportNote: { deliveryDate: '2022/5/12 17:46' },
            products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
            skuItems: [ { SKUId: 1, RFID: '00000000000000000000000000000001' } ]})
        .mockReturnValueOnce({
            id: 33,
            issueDate: '2021/11/29 09:33',
            state: 'ISSUED',
            supplierId: 1,
            products: [
            { SKUId: 12, description: 'a product', price: 10.99, qty: 3 },
            {
                SKUId: 180,
                description: 'another product',
                price: 11.99,
                qty: 2
            }
            ],
            skuItems: []
        });
                dao.run.mockReset();
                dao.run.mockReturnValueOnce({ id: 2 }).mockReturnValueOnce({id:33});


            })

    
    test('modify restock orders state', async() => {

       
        let res = await RO.modifyRestockOrderState(2,'DELIVERED');
        console.log(res)
        expect(res).toEqual(2);

        res = await RO.modifyRestockOrderState(33,'DELIVERED');
        console.log(res)
        expect(res).toEqual(33);

        res = await RO.modifyRestockOrderState(50,'DELIVERED');
        console.log(res)
        expect(res).toEqual({message: "Not Found"});
      
    })
    
});

/**
 * API:
 *          DELETE /api/restockOrder/:id
 * ==========================================================
 */
 describe('delete restock order', () => {
    beforeEach( () => {
        dao.run.mockReset();
        dao.run.mockReturnValueOnce({ id: 1 }).mockReturnValueOnce({id:2});


    })

    
    test('delete restock order', async() => {

        let res = await RO.deleteRestockOrder(1);
        console.log(res)
        expect(res).toEqual(1);

        res = await RO.deleteRestockOrder(2);
        console.log(res)
        expect(res).toEqual(2);
      
    })
    
});


/**
 * API:
 *          PUT /api/restockOrder/:id/transportNote
 * ==========================================================
 */

 describe('put transport note', () => {
    beforeEach( () => {
        dao.get.mockReset();
        dao.get.mockReturnValueOnce({
            issueDate: '2022/5/12 21:30',
            state: 'DELIVERY',
          }).mockReturnValueOnce(null).mockReturnValueOnce({
            issueDate: '2022/5/12 21:30',
            state: 'ISSUED',
          }).mockReturnValueOnce({
            issueDate: '2022/5/12 21:30',
            state: 'DELIVERY',
          });

        dao.run.mockReset();
        dao.run.mockReturnValueOnce({ id: 1 });


            })

    
    test('put transport note', async() => {

       
        let res = await RO.addTransportNote(1,{transportNote:{deliveryDate:"2022/12/29"}});
        console.log(res)
        expect(res).toEqual(1);

        res = await RO.addTransportNote(33,{transportNote:{deliveryDate:"2022/12/29"}});
        console.log()
        expect(res).toEqual({message: "Not Found"});

        res = await RO.addTransportNote(1,{transportNote:{deliveryDate:"2022/12/29"}});
        console.log(res)
        expect(res).toEqual({unprocessable: "Cannot put transport note"});
      
       /* res = await RO.addTransportNote(1,{transportNote:{deliveryDate:"2020/12/29"}});
        console.log(res)
        expect(res).toEqual({unprocessable: "Cannot put transport note"});*/
    })
    
});

/**
 * API:
 *          PUT /api/restockOrder/:id/skuItems
 * ==========================================================
 */
 describe('put skuItems', () => {
    beforeEach( () => {
        dao.get.mockReset();
        dao.get.mockReturnValueOnce({
            state: 'DELIVERED',
          }).mockReturnValueOnce({min_id:1}).mockReturnValueOnce(null)
          .mockReturnValueOnce({
            state: 'ISSUED',
          })

        dao.run.mockReset();
        dao.run.mockReturnValueOnce({ id: 1 });


            })

    
    test('put skuItems', async() => {

       
        let res = await RO.setSkuItems(1, [{SKUId:1,rfid:"12345678901234567890123456789016"}]);
        console.log(res)
        expect(res).toEqual(1);

        res = await RO.setSkuItems(33, [{SKUId:1,rfid:"12345678901234567890123456789016"}]);
        console.log()
        expect(res).toEqual({message: "Not Found"});

        res = await RO.setSkuItems(1,[{SKUId:1,rfid:"12345678901234567890123456789016"}]);
        console.log(res)
        expect(res).toEqual({unprocessable: "Cannot put skuItems"});
      
       /* res = await RO.addTransportNote(1,{transportNote:{deliveryDate:"2020/12/29"}});
        console.log(res)
        expect(res).toEqual({unprocessable: "Cannot put transport note"});*/
    })
    
});

/**
 * API:
 *          GET /api/restockOrders/:id/returnItems
 * ==========================================================
 */
 describe('get return Items', () => {
    beforeEach( () => {
        dao.get.mockReset();
        dao.get.mockReturnValueOnce(            
            {
                id: 7,
                issueDate: '2022/5/12 20:38',
                state: 'COMPLETEDRETURN',
                supplierId: 7,
                transportNote: { deliveryDate: null },
                products: [ { SKUId: 3, description: 'a product', price: 0.01, qty: 1 } ],
                skuItems: [{SKUId:3, rfid:"12345678901234567890123456789016"}]
              }).mockReturnValueOnce(null)
              .mockReturnValueOnce({
                id: 7,
                issueDate: '2022/5/12 20:38',
                state: 'DELIVERED',
                supplierId: 7,
                transportNote: { deliveryDate: null },
                products: [ { SKUId: 3, description: 'a product', price: 0.01, qty: 1 } ],
                skuItems: [{SKUId:3, rfid:"12345678901234567890123456789016"}]
              });
            dao.all.mockReset();
            dao.all.mockReturnValueOnce([{SKUId:3, rfid:"12345678901234567890123456789016"}])
            .mockReturnValueOnce( [
                {
                    Result: false
                },
                {
    
                    Result: true
                },
            ]
        );
    });

    
    test('get return Items', async() => {

       
        let res = await RO.getReturnItems(7);
        console.log(res)
        expect(res).toEqual([{SKUId:3, rfid:"12345678901234567890123456789016"}]);

        res = await RO.getReturnItems(33);
        console.log()
        expect(res).toEqual({message: "Not Found"});

        res = await RO.getReturnItems(1);
        console.log(res)
        expect(res).toEqual({unprocessable: "Cannot get return Items"});

    })
    
});