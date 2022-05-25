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
 function createinternalOrder(){
  describe('create internal order',()=>{

  it('create internal order',async()=>{
    let req = {issueDate: '2022/05/12 17:44', customerId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]};
    await agent.post('/api/internalOrders/').send(req).then(function(res){
      res.should.have.status(201);
      })
    })
    it('create internal order - UNPROCESSABLE',async()=>{
      let req = {issueDate: '2022/05/12 17:44', customerId: 7, products: [ { SKUId: 1, description: 'a product', price: -0.01, qty: 1 } ]};
      await agent.post('/api/internalOrders/').send(req).then(function(res){
        res.should.have.status(422);
        })
      })

      after(async()=>{

        await agent.get('/api/internalOrders/').then(async(res)=>{
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.be.a('array');
          let id = res.body[res.body.length-1].id;
         await agent.delete('/api/internalOrders/'+id).then(function(res){
          res.should.have.status(204);})
         
      })
    })

  });
  
}
createinternalOrder();


  
/**
 * API:
 *            GET /api/internalOrders/:id
 * =================================================
 */
 function getInternalOrderById(){
    describe('get internal order by id',()=>{
      
      before(async() => {
        await agent.post('/api/internalOrders/')
        .send({issueDate: '2022/05/12 17:44', customerId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
        .then(function (res) {
            res.should.have.status(201);
        })
        await agent.post('/api/internalOrders/')
        .send({issueDate: '2022/05/12 17:44', customerId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
        .then(function (res) {
            res.should.have.status(201);
        })
    });
  
    it('get internal order by id',async()=>{
      await agent.get('/api/internalOrders/').then(async(res)=>{
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        let id = res.body[res.body.length-1].id;
        await agent.get('/api/internalOrders/'+id).then(function(res){
            res.should.have.status(200);
        })
  
    })
  })  
  it('get internal order by id',async()=>{
    await agent.get('/api/internalOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id-1;
      await agent.get('/api/internalOrders/'+id).then(function(res){
          res.should.have.status(200);
      })

  })
})  
  
it('get internal order by id - NOT FOUND',async()=>{
  await agent.get('/api/internalOrders/').then(async(res)=>{
    res.should.have.status(200);
    res.should.to.be.json;
    res.body.should.be.a('array');
    let id = res.body[res.body.length-1].id+100;
    await agent.get('/api/internalOrders/'+id).then(function(res){
        res.should.have.status(404);
    })

})
})  

  it('get internal order by id - UNPROCESSABLE ENTITY',async()=>{
  
      await agent.get('/api/internalOrders/'+'a').then(function(res){
          res.should.have.status(422);
      })   
  })

  after(async()=>{

    await agent.get('/api/internalOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id;
    await agent.delete('/api/internalOrders/'+id).then(function(res){
      res.should.have.status(204);})
      id = id-1;
      await agent.delete('/api/internalOrders/'+id).then(function(res){
        res.should.have.status(204);})
  })
})


  });
  }
 getInternalOrderById()
  

   /**
  * API:
  *                GET /api/internalOrders
  * =================================================
  */

 function getInternalOrders(){
  describe('get internal orders',()=>{
    before(async() => {
      await agent.post('/api/internalOrders/')
      .send({issueDate: '2022/05/12 17:44', customerId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
      .then(function (res) {
          res.should.have.status(201);
      })
      await agent.post('/api/internalOrders/')
      .send({issueDate: '2022/05/12 17:44', customerId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
      .then(function (res) {
          res.should.have.status(201);
      })
  });

  it('get internal orders',async()=>{

      await agent.get('/api/internalOrders/').then(function(res){
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.be.a('array');
          
      })
  })
  it('get internal orders',async()=>{

    await agent.get('/api/internalOrders/').then(function(res){
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        
    })
})
after(async()=>{

  await agent.get('/api/internalOrders/').then(async(res)=>{
    res.should.have.status(200);
    res.should.to.be.json;
    res.body.should.be.a('array');
    let id = res.body[res.body.length-1].id;
  await agent.delete('/api/internalOrders/'+id).then(function(res){
    res.should.have.status(204);})
    id = id-1;
    await agent.delete('/api/internalOrders/'+id).then(function(res){
      res.should.have.status(204);})
})
})
});
}
getInternalOrders();

/**
 * API:
 *                GET /api/internalOrdersIssued
 * =================================================
 */
 function getInternalOrdersIssued(){
  describe('get internal orders issued',()=>{
    before(async() => {
      await agent.post('/api/internalOrders/')
      .send({issueDate: '2022/05/12 17:44', customerId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
      .then(function (res) {
          res.should.have.status(201);
      })
      await agent.post('/api/internalOrders/')
      .send({issueDate: '2022/05/12 17:44', customerId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
      .then(function (res) {
          res.should.have.status(201);
      })
  });

  it('get internal orders issued',async()=>{

      await agent.get('/api/internalOrdersIssued/').then(function(res){
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.be.a('array');
          
      })
  })
  it('get internal orders issued',async()=>{

    await agent.get('/api/internalOrdersIssued/').then(function(res){
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        
    })
})
after(async()=>{

  await agent.get('/api/internalOrders/').then(async(res)=>{
    res.should.have.status(200);
    res.should.to.be.json;
    res.body.should.be.a('array');
    let id = res.body[res.body.length-1].id;
  await agent.delete('/api/internalOrders/'+id).then(function(res){
    res.should.have.status(204);})
    id = id-1;
    await agent.delete('/api/internalOrders/'+id).then(function(res){
      res.should.have.status(204);})
})
})
});
}
  getInternalOrdersIssued();
  
  /**
 * API:
 *                GET /api/internalOrdersAccepted
 * =================================================
 */
 function getInternalOrdersAccepted(){
    describe('get internal orders accepted',()=>{
      before(async() => {
        await agent.post('/api/internalOrders/')
        .send({issueDate: '2022/05/12 17:44', customerId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
        .then(function (res) {
            res.should.have.status(201);
        })
        await agent.post('/api/internalOrders/')
        .send({issueDate: '2022/05/12 17:44', customerId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
        .then(function (res) {
            res.should.have.status(201);
        })
        await agent.get('/api/internalOrders/').then(async(res)=>{
          res.should.have.status(200);
          res.should.to.be.json;
          res.body.should.be.a('array');
          let id = res.body[res.body.length-1].id;
    
        await agent.put('/api/internalOrders/'+id).send({newState: 'ACCEPTED'}).then(async(res)=>{
          res.should.have.status(200);
          })
          id=id-1;
          await agent.put('/api/internalOrders/'+id).send({newState: 'ACCEPTED'}).then(function(res){
            res.should.have.status(200);
            })
        })
     
    });

    it('get internal orders accepted',async()=>{
  
        await agent.get('/api/internalOrdersAccepted/').then(function(res){
            res.should.have.status(200);
            res.should.to.be.json;
            res.body.should.be.a('array');
            
        })
    })
    after(async()=>{

      await agent.get('/api/internalOrders/').then(async(res)=>{
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        let id = res.body[res.body.length-1].id;
      await agent.delete('/api/internalOrders/'+id).then(function(res){
        res.should.have.status(204);})
        id = id-1;
        await agent.delete('/api/internalOrders/'+id).then(function(res){
          res.should.have.status(204);})
    })
    })
  });
  }
  getInternalOrdersAccepted();

/**
 * API:
 *            PUT /api/internalOrders/:id
 * =================================================
 */
 function modifyInternalOrderState(){
  describe('modify internal order state',()=>{
    before(async() => {
      await agent.post('/api/internalOrders/')
      .send({issueDate: '2022/05/12 17:44', customerId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
      .then(function (res) {
          res.should.have.status(201);
      })
  });
  it('modify internal order state accpeted',async()=>{
    await agent.get('/api/internalOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id;

    await agent.put('/api/internalOrders/'+id).send({newState: 'ACCEPTED'}).then(function(res){
      res.should.have.status(200);
      })
    })
  })

  it('modify internal order state - NOT FOUND',async()=>{
    await agent.get('/api/internalOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id+100;

    await agent.put('/api/internalOrders/'+id).send({newState: 'ACCEPTED'}).then(function(res){
      res.should.have.status(404);
      })
    })
  })

  it('modify internal order state - NOT FOUND',async()=>{
    await agent.get('/api/internalOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id+100;

    await agent.put('/api/internalOrders/'+id).send({newState: 'COMPLETED'}).then(function(res){
      res.should.have.status(422);
      })
    })
  })
  it('modify internal order state completed',async()=>{
    await agent.get('/api/internalOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id;

    await agent.put('/api/internalOrders/'+id).send({newState: 'COMPLETED', products: [{SkuID: 1, RFID: "12345678901234567890123456789016"}]}).then(function(res){
      res.should.have.status(200);
      })
    })
  })

    after(async()=>{

      await agent.get('/api/internalOrders/').then(async(res)=>{
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        let id = res.body[res.body.length-1].id;
        await agent.delete('/api/internalOrders/'+id).then(function(res){
        res.should.have.status(204);})
        
    })
  })
  });
}
  modifyInternalOrderState();


  /**
 * API:
 *                DELETE /api/internalOrders/:id
 * =================================================
 */
   function deleteInternalOrder(){
    describe('delete internal order',()=>{
      
      before(async() => {
        await agent.post('/api/internalOrders/')
        .send({issueDate: '2022/05/12 17:44', customerId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
        .then(function (res) {
            res.should.have.status(201);
        })
    });
    
    it('delete internal order',async()=>{
      await agent.get('/api/internalOrders/').then(async(res)=>{
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        let id = res.body[res.body.length-1].id;
        await agent.delete('/api/internalOrders/'+id).then(function(res){
        res.should.have.status(204);
  
        })
      })
      })
    });
  }
  deleteInternalOrder();
  