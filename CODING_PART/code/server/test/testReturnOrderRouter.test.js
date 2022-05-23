/**
 *      TESTING CLASS: RETURN ORDERS 
 * ==================================
 * 
*/
'use strict'
const { expect } = require('chai');
/* ------------ MODULE IMPORT ------------ */
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();


/* ------------ INITIALIZATION ------------ */
const app = require('../server');
var agent = chai.request.agent(app);
let ID_TO_TEST= 7;
let ID_NOT_FOUND = 10000;

/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |           RETURN ORDERS                          |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/
/**
 * API:
 *              POST /api/returnOrder
 * =================================================
 */

 function createReturnOrder(req,expectedStatus){
    describe('create return order',()=>{
  
    it('create return order',async()=>{
  
      await agent.post('/api/returnOrder/').send(req).then(function(res){
        res.should.have.status(expectedStatus);
        //done();
   
        })
      })
    });
  }
  createReturnOrder({
    returnDate:"2021/11/29 09:33",
    products: [{SKUId:12,description:"a product",price:10.99, RFID:"12345678901234567890123456789016"},
                {SKUId:180,description:"another product",price:11.99,RFID:"12345678901234567890123456789038"}],
    restockOrderId : 1
},201);
  createReturnOrder({returnDate: '2022/05/12 17:44', restockOrderId: 7, products: [ { SKUId: 1, description: 'a product', price: -0.01, rfid: "12345678901234567890123456789016" } ]},422);

/**
 * API:
 *                GET /api/returnOrders
 * =================================================
 */
 function getReturnOrders(expectedStatus){
    describe('get return orders',()=>{
  
    it('get return orders',async()=>{
  
        await agent.get('/api/returnOrders/').then(function(res){
            res.should.have.status(expectedStatus);
            res.should.to.be.json;
            res.body.should.be.a('array');
            //let ID_TO_TEST = res.body[res.body.length-1].id;
            //ID_NOT_FOUND = ID_TO_TEST+10;
            //done();
        })
    })
  });
  }
getReturnOrders(200);

/**
 * API:
 *              GET /api/returnOrders/:id
 * =================================================
 */

   function getReturnOrderById(req,expectedStatus){
    describe('get return order by id',()=>{
      
  
    it('get return order by id',async()=>{
  
        await agent.get('/api/returnOrders/'+req).then(function(res){
            res.should.have.status(expectedStatus);
            
        })
    })
  });
  }

  getReturnOrderById(2,200);
  getReturnOrderById(3,200);
  getReturnOrderById(ID_NOT_FOUND,404);

    /**
 * API:
 *            DELETE /api/returnOrder/:id
 * =================================================
 */
     function deleteReturnOrder(id,expectedStatus){
        describe('delete return order',()=>{
      
        it('delete return order',async()=>{
      
          await agent.delete('/api/returnOrder/'+id).then(function(res){
            res.should.have.status(expectedStatus);
      
            })
          })
        });
      }
deleteReturnOrder(7,204);