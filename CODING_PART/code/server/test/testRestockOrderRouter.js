/**
 *      TESTING CLASS: RESTOCK ORDERS 
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
 *  |            RESTOCK ORDERS                        |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/
/**
 * API:
 *          POST /api/restockOrder
 * ==========================================================
 */
 function createRestockOrder(req,expectedStatus){
  describe('create restock order',()=>{

  it('create restock order',async()=>{

    await agent.post('/api/restockOrder/').send(req).then(function(res){
      res.should.have.status(expectedStatus);
      //done();
 
      })
    })
  });
}
createRestockOrder({issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]},201);
createRestockOrder({issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: -0.01, qty: 1 } ]},422);

  

/**
 * API:
 *              GET /api/restockOrders
 * =================================================
 */
 function getRestockOrders(expectedStatus){
  describe('get restock orders',()=>{

  it('get restock orders',async()=>{

      await agent.get('/api/restockOrders/').then(function(res){
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
getRestockOrders(200);

/**
 * API:
 *         GET /api/restockOrdersIssued
 * =================================================
 */
 function getRestockOrdersIssued(expectedStatus){
  describe('get restock orders issued',()=>{

  it('get restock orders issued',async()=>{

      await agent.get('/api/restockOrdersIssued/').then(function(res){
          res.should.have.status(expectedStatus);
          res.should.to.be.json;
          res.body.should.be.a('array');
         
          //done();
      })
  })
});
}
getRestockOrdersIssued(200);
/**
 * API:
 *         GET /api/restockOrders/:id
 * =================================================
 */

 function getRestockOrderById(req,expectedStatus){
  describe('get restock order by id',()=>{
    

  it('get restock order by id',async()=>{

      await agent.get('/api/restockOrders/'+req).then(function(res){
          res.should.have.status(expectedStatus);
          //done();
      })
  })
});
}
getRestockOrderById(3,200);
getRestockOrderById(2,200);
getRestockOrderById(ID_NOT_FOUND,404);

/**
 * API:
 *          PUT /api/restockOrder/:id
 * ==========================================================
 */
 function modifyRestockOrderState(id,newState,expectedStatus){
  describe('modify restock order state',()=>{

  it('modify restock order state',async()=>{

    await agent.put('/api/restockOrder/'+id).send(newState).then(function(res){
      res.should.have.status(expectedStatus);
      })
    })
  });
}
modifyRestockOrderState(ID_TO_TEST,{newState: 'DELIVERY'},200);
modifyRestockOrderState(ID_NOT_FOUND,{newState: 'DELIVERY'},404);
modifyRestockOrderState(ID_TO_TEST,{},422);


/**
 * API:
 *          PUT /api/restockOrder/:id/transportNote
 * ==========================================================
 */

 function addTransportNote(id,transportNote,expectedStatus){
  describe('add transport note',()=>{

  it('add transport note',async()=>{

    await agent.put('/api/restockOrder/'+id+'/transportNote').send(transportNote).then(function(res){
      res.should.have.status(expectedStatus);
      })
    })
  });
}

addTransportNote(ID_TO_TEST,{transportNote: { deliveryDate: '2023/12/29' }},200);
addTransportNote(ID_TO_TEST,{transportNote: { deliveryDate: '2021/12/29' }},422);
addTransportNote(ID_NOT_FOUND,{transportNote: { deliveryDate: '2023/12/29' }},404);

/**
 * API:
 *          PUT /api/restockOrder/:id/skuItems
 * ==========================================================
 */
 function setSkuItems(id,skuItems,expectedStatus){
  describe('set skuItems',()=>{

  it('set skuItems',async()=>{

    await agent.put('/api/restockOrder/'+id+'/skuItems').send(skuItems).then(function(res){
      res.should.have.status(expectedStatus);
    
      })
    })
  });
}

setSkuItems(ID_TO_TEST,{skuItems: [{SKUId: 1, rfid: "12345678901234567890123456789016"}]},422);
modifyRestockOrderState(ID_TO_TEST,{newState: 'DELIVERED'},200);
setSkuItems(ID_TO_TEST,{skuItems: [{SKUId: 1, rfid: "12345678901234567890123456789016"}]},200);
setSkuItems(ID_NOT_FOUND,{skuItems: [{SKUId: 1, rfid: "12345678901234567890123456789016"}]},404);
/**
 * API:
 *          GET /api/restockOrders/:id/returnItems
 * ==========================================================
 */

 function getReturnItems(id,expectedStatus){
  describe('get return items',()=>{

  it('get return items',async()=>{

    await agent.get('/api/restockOrders/'+id+'/returnItems').then(function(res){
      res.should.have.status(expectedStatus);

      })
    })
  });
}

getReturnItems(ID_TO_TEST,422);
modifyRestockOrderState(ID_TO_TEST,{newState: 'COMPLETEDRETURN'},200);
getReturnItems(ID_TO_TEST,200);
getReturnItems(ID_NOT_FOUND,404);

/**
 * API:
 *          DELETE /api/restockOrder/:id
 * ==========================================================
 */
 function deleteRestockOrder(id,expectedStatus){
  describe('delete restock order',()=>{

  it('delete restock order',async()=>{

    await agent.delete('/api/restockOrder/'+id).then(function(res){
      res.should.have.status(expectedStatus);

      })
    })
  });
}
deleteRestockOrder(81,204);
deleteRestockOrder('a',422);
