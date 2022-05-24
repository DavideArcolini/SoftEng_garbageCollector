/**
 *      TESTING CLASS: INTERNAL ORDERS 
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
let ID_TO_TEST= 1;
let ID_NOT_FOUND = 10000;
/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |            INTERNAL ORDERS                       |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/
  
/**
 * API:
 *             POST /api/internalOrders
 * =================================================
 */
 function createinternalOrder(req,expectedStatus){
  describe('create internal order',()=>{

  it('create internal order',async()=>{

    await agent.post('/api/internalOrders/').send(req).then(function(res){
      res.should.have.status(expectedStatus);
      //done();
 
      })
    })
  });
}
createinternalOrder({issueDate: '2022/05/12 17:44', customerId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]},201);
createinternalOrder({issueDate: '2022/05/12 17:44', customerId: 7, products: [ { SKUId: 1, description: 'a product', price: -0.01, qty: 1 } ]},422);

  
/**
 * API:
 *            GET /api/internalOrders/:id
 * =================================================
 */
 function getInternalOrderById(req,expectedStatus){
    describe('get internal order by id',()=>{
      
  
    it('get internal order by id',async()=>{
  
        await agent.get('/api/internalOrders/'+req).then(function(res){
            res.should.have.status(expectedStatus);
            //done();
        })
    })
  });
  }
  getInternalOrderById(3,200);
  getInternalOrderById(2,200);
  getInternalOrderById(ID_NOT_FOUND,404);

  

   /**
  * API:
  *                GET /api/internalOrders
  * =================================================
  */

 function getInternalOrders(expectedStatus){
  describe('get internal orders',()=>{

  it('get internal orders',async()=>{

      await agent.get('/api/internalOrders/').then(function(res){
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
getInternalOrders(200);

/**
 * API:
 *                GET /api/internalOrdersIssued
 * =================================================
 */
 function getInternalOrdersIssued(expectedStatus){
    describe('get internal orders issued',()=>{
  
    it('get internal orders issued',async()=>{
  
        await agent.get('/api/internalOrdersIssued/').then(function(res){
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
  getInternalOrdersIssued(200);
  
  /**
 * API:
 *                GET /api/internalOrdersAccepted
 * =================================================
 */
 function getInternalOrdersAccepted(expectedStatus){
    describe('get internal orders accepted',()=>{
  
    it('get internal orders accepted',async()=>{
  
        await agent.get('/api/internalOrdersAccepted/').then(function(res){
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
  getInternalOrdersAccepted(200);

/**
 * API:
 *            PUT /api/internalOrders/:id
 * =================================================
 */

 function modifyInternalOrderState(id,body, expectedStatus){
    describe('modify restock order state',()=>{
  
    it('modify restock order state',async()=>{
  
      await agent.put('/api/internalOrders/'+id).send(body).then(function(res){
        res.should.have.status(expectedStatus);
        })
      })
    });
  }
  modifyInternalOrderState(ID_TO_TEST,{newState: 'ACCEPTED'},200);
  modifyInternalOrderState(ID_NOT_FOUND,{newState: 'ACCEPTED'},404);
  modifyInternalOrderState(ID_TO_TEST,{newState: 'COMPLETED'},422);
  modifyInternalOrderState(ID_TO_TEST,{newState: 'COMPLETED', products: {SKUId: 1, rfid: "12345678901234567890123456789016"}},422);


  /**
 * API:
 *                DELETE /api/internalOrders/:id
 * =================================================
 */
   function deleteInternalOrder(id,expectedStatus){
    describe('delete internal order',()=>{
  
    it('delete internal order',async()=>{
  
      await agent.delete('/api/internalOrders/'+id).then(function(res){
        res.should.have.status(expectedStatus);
  
        })
      })
    });
  }
  deleteInternalOrder(30,204);
  