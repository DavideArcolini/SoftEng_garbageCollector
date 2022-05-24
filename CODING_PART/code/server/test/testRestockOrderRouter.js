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
/**
 * API:
 *         GET /api/restockOrders/:id
 * =================================================
 */

 function getRestockOrderById(){
  describe('get restock order by id',()=>{
     before(async() => {
        await agent.post('/api/restockOrder/')
        .send({issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
        .then(function (res) {
            res.should.have.status(201);
        })
        await agent.post('/api/restockOrder/')
        .send({issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
        .then(function (res) {
            res.should.have.status(201);
        })
    });

  it('get restock order by id',async()=>{
    await agent.get('/api/restockOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id;
      await agent.get('/api/restockOrders/'+id).then(function(res){
          res.should.have.status(200);
      })

  })
})  
it('get restock order by id - NOT FOUND',async()=>{
  await agent.get('/api/restockOrders/').then(async(res)=>{
    res.should.have.status(200);
    res.should.to.be.json;
    res.body.should.be.a('array');
    let id = res.body[res.body.length-1].id+100;
    await agent.get('/api/restockOrders/'+id).then(function(res){
        res.should.have.status(404);
    })

})


})
it('get restock order by id - UNPROCESSABLE ENTITY',async()=>{

    await agent.get('/api/restockOrders/'+'a').then(function(res){
        res.should.have.status(422);
    })
  
})
    after(async()=>{

      await agent.get('/api/restockOrders/').then(async(res)=>{
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        let id = res.body[res.body.length-1].id;
        console.log(id+'deleted')
      await agent.delete('/api/restockOrder/'+id).then(function(res){
        res.should.have.status(204);})
        id = id-1;
        console.log(id+'deleted')
        await agent.delete('/api/restockOrder/'+id).then(function(res){
          res.should.have.status(204);})
    })
  })
});
}

getRestockOrderById();

 function createRestockOrder(){
  describe('create restock order',()=>{

  it('create restock order',async()=>{
    let req = {issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]};

    await agent.post('/api/restockOrder/').send(req).then(function(res){
      res.should.have.status(201);
      //done();
 
      })
    })
    it('create restock order - UNPROCESSABLE ENTITY',async()=>{
      let req = {issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: -0.01, qty: 1 } ]};

      await agent.post('/api/restockOrder/').send(req).then(function(res){
        res.should.have.status(422);
        //done();
   
        })
      })
    after(async()=>{

      await agent.get('/api/restockOrders/').then(async(res)=>{
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        let id = res.body[res.body.length-1].id;
        //console.log(id);
        console.log(id+'deleted')
       await agent.delete('/api/restockOrder/'+id).then(function(res){
        res.should.have.status(204);})
        //id = res.body[res.body.length-2].id;
       
    })
  })
  });
}
//createRestockOrder({issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]},201);
//createRestockOrder({issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: -0.01, qty: 1 } ]},422);
createRestockOrder();
  

/**
 * API:
 *              GET /api/restockOrders
 * =================================================
 */
 function getRestockOrders(expectedStatus){
  describe('get restock orders',()=>{

    before(async() => {
      await agent.post('/api/restockOrder/')
      .send({issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
      .then(function (res) {
          res.should.have.status(201);
      })
      await agent.post('/api/restockOrder/')
      .send({issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
      .then(function (res) {
          res.should.have.status(201);
      })
  });


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
  after(async()=>{

    await agent.get('/api/restockOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id;
      console.log(id+'deleted')
     await agent.delete('/api/restockOrder/'+id).then(function(res){
      res.should.have.status(204);})
      id = id-1;
      console.log(id+'deleted')
      await agent.delete('/api/restockOrder/'+id).then(function(res){
        res.should.have.status(204);})
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

    before(async() => {
      await agent.post('/api/restockOrder/')
      .send({issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
      .then(function (res) {
          res.should.have.status(201);
      })
      await agent.post('/api/restockOrder/')
      .send({issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
      .then(function (res) {
          res.should.have.status(201);
      })
  });

  it('get restock orders issued',async()=>{

      await agent.get('/api/restockOrdersIssued/').then(function(res){
          res.should.have.status(expectedStatus);
          res.should.to.be.json;
          res.body.should.be.a('array');
         
          //done();
      })
  })
  after(async()=>{

    await agent.get('/api/restockOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id;
      console.log(id+'deleted')
     await agent.delete('/api/restockOrder/'+id).then(function(res){
      res.should.have.status(204);})
      id = id-1;
      console.log(id+'deleted')
      await agent.delete('/api/restockOrder/'+id).then(function(res){
        res.should.have.status(204);})
  })
})
});
}
getRestockOrdersIssued(200);


/**
 * API:
 *          PUT /api/restockOrder/:id
 * ==========================================================
 **/
 function modifyRestockOrderState(){
  describe('modify restock order state',()=>{
    before(async() => {
      await agent.post('/api/restockOrder/')
      .send({issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
      .then(function (res) {
          res.should.have.status(201);
      })
  });
  it('modify restock order state',async()=>{
    await agent.get('/api/restockOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id;

    await agent.put('/api/restockOrder/'+id).send({newState: 'DELIVERY'}).then(function(res){
      res.should.have.status(200);
      })
    })
  })

  it('modify restock order state - NOT FOUND',async()=>{
    await agent.get('/api/restockOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id+100;

    await agent.put('/api/restockOrder/'+id).send({newState: 'DELIVERY'}).then(function(res){
      res.should.have.status(404);
      })
    })
  })

  it('modify restock order state',async()=>{
    await agent.get('/api/restockOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id;

    await agent.put('/api/restockOrder/'+id).send({newState: 'UNDEFINED'}).then(function(res){
      res.should.have.status(422);
      })
    })
  })

    after(async()=>{

      await agent.get('/api/restockOrders/').then(async(res)=>{
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        let id = res.body[res.body.length-1].id;
        await agent.delete('/api/restockOrder/'+id).then(function(res){
        res.should.have.status(204);})
        
    })
  })
  });
}
modifyRestockOrderState();


/**
 * API:
 *          PUT /api/restockOrder/:id/transportNote
 * ==========================================================
 */

 function addTransportNote(){
  describe('add transport note',()=>{
    before(async() => {
      await agent.post('/api/restockOrder/')
      .send({issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
      .then(function (res) {
          res.should.have.status(201);
      })
      await agent.get('/api/restockOrders/').then(async(res)=>{
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        let id = res.body[res.body.length-1].id;
  
      await agent.put('/api/restockOrder/'+id).send({newState: 'DELIVERY'}).then(function(res){
        res.should.have.status(200);
        })
      })
   
  });

  it('add transport note',async()=>{
    await agent.get('/api/restockOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id;
    await agent.put('/api/restockOrder/'+id+'/transportNote').send({transportNote: { deliveryDate: '2023/12/29' }}).then(function(res){
      res.should.have.status(200);
      })
    })
  })
  it('add transport note - NOT FOUND',async()=>{
    await agent.get('/api/restockOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id+100;
    await agent.put('/api/restockOrder/'+id+'/transportNote').send({transportNote: { deliveryDate: '2023/12/29' }}).then(function(res){
      res.should.have.status(404);
      })
    })
  })

  it('add transport note - UNPROCESSABLE',async()=>{
    await agent.get('/api/restockOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id;
    await agent.put('/api/restockOrder/'+id+'/transportNote').send({transportNote: { deliveryDate: '2021/12/29' }}).then(function(res){
      res.should.have.status(422);
      })
    })
  })
    after(async()=>{

      await agent.get('/api/restockOrders/').then(async(res)=>{
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        let id = res.body[res.body.length-1].id;
      await agent.delete('/api/restockOrder/'+id).then(function(res){
        res.should.have.status(204);})
        
    })
  })
  });
}

addTransportNote();


/**
 * API:
 *          PUT /api/restockOrder/:id/skuItems
 * ==========================================================
 */
 function setSkuItems(){
  describe('set skuItems',()=>{
    before(async() => {
      await agent.post('/api/restockOrder/')
      .send({issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
      .then(function (res) {
          res.should.have.status(201);
      })
      await agent.get('/api/restockOrders/').then(async(res)=>{
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        let id = res.body[res.body.length-1].id;
  
      await agent.put('/api/restockOrder/'+id).send({newState: 'DELIVERED'}).then(function(res){
        res.should.have.status(200);
        })
      })
     

  });
  it('set skuItems',async()=>{
    await agent.get('/api/restockOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id;
      await agent.put('/api/restockOrder/'+id+'/skuItems').send({skuItems: [{SKUId: 1, rfid: "12345678901234567890123456789016"}]}).then(function(res){
      res.should.have.status(200);
    
      })
    })
   })

   it('set skuItems-NOT FOUND',async()=>{
    await agent.get('/api/restockOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id+100;
    await agent.put('/api/restockOrder/'+id+'/skuItems').send({skuItems: [{SKUId: 1, rfid: "12345678901234567890123456789016"}]}).then(function(res){
      res.should.have.status(404);
    
      })
    })
   })

   it('set skuItems- UNPROCESSABLE',async()=>{
    await agent.get('/api/restockOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id;
      await agent.put('/api/restockOrder/'+id).send({newState: 'DELIVERY'}).then(async(res)=>{
        res.should.have.status(200);
      await agent.put('/api/restockOrder/'+id+'/skuItems').send({skuItems: [{SKUId: 1, rfid: "12345678901234567890123456789016"}]}).then(function(res){
      res.should.have.status(422);
      })
      })
    })
   })

    after(async()=>{

      await agent.get('/api/restockOrders/').then(async(res)=>{
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        let id = res.body[res.body.length-1].id;
      await agent.delete('/api/restockOrder/'+id).then(function(res){
        res.should.have.status(204);})
        
    })
  })
  });
}
setSkuItems();
/**
 * API:
 *          GET /api/restockOrders/:id/returnItems
 * ==========================================================
 */

 function getReturnItems(){
  describe('get return items',()=>{

    before(async() => {
      await agent.post('/api/restockOrder/')
      .send({issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
      .then(function (res) {
          res.should.have.status(201);
      })
      await agent.get('/api/restockOrders/').then(async(res)=>{
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        let id = res.body[res.body.length-1].id;
  
      await agent.put('/api/restockOrder/'+id).send({newState: 'COMPLETEDRETURN'}).then(function(res){
        res.should.have.status(200);
        })
      })
  });

 
  it('get return items - NOT FOUND',async()=>{
    await agent.get('/api/restockOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id+100;
      await agent.get('/api/restockOrders/'+id+'/returnItems').then(function(res){
      res.should.have.status(404);

      })
    })
  })
  it('get return items',async()=>{
    await agent.get('/api/restockOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id;
      await agent.get('/api/restockOrders/'+id+'/returnItems').then(function(res){
      res.should.have.status(200);

      })
    })
  })
  it('get return items - UNPROCESSABLE',async()=>{
    await agent.get('/api/restockOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id;
      await agent.put('/api/restockOrder/'+id).send({newState: 'DELIVERY'}).then(async(res)=>{
        res.should.have.status(200);
      await agent.get('/api/restockOrders/'+id+'/returnItems').then(function(res){
      res.should.have.status(422);
      })
      })
    })
  })

    after(async()=>{

      await agent.get('/api/restockOrders/').then(async(res)=>{
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        let id = res.body[res.body.length-1].id;
        await agent.delete('/api/restockOrder/'+id).then(function(res){
        res.should.have.status(204);})
        
    })
  })
  });
}

getReturnItems();

/**
 * API:
 *          DELETE /api/restockOrder/:id
 * ==========================================================
 */
 function deleteRestockOrder(){
  describe('delete restock order',()=>{
    before(async() => {
      await agent.post('/api/restockOrder/')
      .send({issueDate: '2022/05/12 17:44', supplierId: 7, products: [ { SKUId: 1, description: 'a product', price: 0.01, qty: 1 } ]})
      .then(function (res) {
          res.should.have.status(201);
      })
  });
  it('delete restock order',async()=>{
    await agent.get('/api/restockOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id;
    await agent.delete('/api/restockOrder/'+id).then(function(res){
      res.should.have.status(204);
    })
    })
  })
  it('delete restock order - UNPROCESSABLE',async()=>{
    let id = 'a';
    await agent.delete('/api/restockOrder/'+id).then(function(res){
      res.should.have.status(422);
    })
    })
});
}
deleteRestockOrder();
