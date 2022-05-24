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

 function createReturnOrder(){
    describe('create return order',()=>{

    it('create return order',async()=>{
      let req = {
        returnDate:"2021/11/29 09:33",
        products: [{SKUId:12,description:"a product",price:10.99, RFID:"12345678901234567890123456789016"},
                    {SKUId:180,description:"another product",price:11.99,RFID:"12345678901234567890123456789038"}],
        restockOrderId : 1
    };
      await agent.post('/api/returnOrder/').send(req).then(function(res){
        res.should.have.status(201);
  
        })
      })
      it('create return order',async()=>{
        let req = {
          returnDate:"2021/11/29 09:33",
          products: [{SKUId:12,description:"a product",price:10.99, RFID:"12345678901234567890123456789016"},
                      {SKUId:180,description:"another product",price:-11.99,RFID:"12345678901234567890123456789038"}],
          restockOrderId : 1
      };
        await agent.post('/api/returnOrder/').send(req).then(function(res){
          res.should.have.status(422);
    
          })
        })

        after(async()=>{

          await agent.get('/api/returnOrders/').then(async(res)=>{
            res.should.have.status(200);
            res.should.to.be.json;
            res.body.should.be.a('array');
            let id = res.body[res.body.length-1].id;
            //console.log(id);
            console.log(id+'deleted')
           await agent.delete('/api/returnOrder/'+id).then(function(res){
            res.should.have.status(204);})
           
        })
      })




    });
  }
  createReturnOrder();
  

/**
 * API:
 *                GET /api/returnOrders
 * =================================================
 */
 function getReturnOrders(expectedStatus){
    describe('get return orders',()=>{

      before(async() => {
        let req = {
          returnDate:"2021/11/29 09:33",
          products: [{SKUId:12,description:"a product",price:10.99, RFID:"12345678901234567890123456789016"},
                      {SKUId:180,description:"another product",price:11.99,RFID:"12345678901234567890123456789038"}],
          restockOrderId : 1
      };
        await agent.post('/api/returnOrder/').send(req).then(function(res){
          res.should.have.status(201);
        })
        req = {
          returnDate:"2021/11/29 09:33",
          products: [{SKUId:12,description:"a product",price:10.99, RFID:"12345678901234567890123456789016"},
                      {SKUId:180,description:"another product",price:11.99,RFID:"12345678901234567890123456789038"}],
          restockOrderId : 1
      };
        await agent.post('/api/returnOrder/').send(req).then(function(res){
          res.should.have.status(201);
        })
    });
  
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
    after(async()=>{

      await agent.get('/api/returnOrders/').then(async(res)=>{
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        let id = res.body[res.body.length-1].id;
        console.log(id+'deleted')
      await agent.delete('/api/returnOrder/'+id).then(function(res){
        res.should.have.status(204);})
        id = id-1;
        console.log(id+'deleted')
        await agent.delete('/api/returnOrder/'+id).then(function(res){
          res.should.have.status(204);})
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

   function getReturnOrderById(){
    describe('get return order by id',()=>{
      before(async() => {
        let req = {
          returnDate:"2021/11/29 09:33",
          products: [{SKUId:12,description:"a product",price:10.99, RFID:"12345678901234567890123456789016"},
                      {SKUId:180,description:"another product",price:11.99,RFID:"12345678901234567890123456789038"}],
          restockOrderId : 1
      };
        await agent.post('/api/returnOrder/').send(req).then(function(res){
          res.should.have.status(201);
        })
        req = {
          returnDate:"2021/11/29 09:33",
          products: [{SKUId:12,description:"a product",price:10.99, RFID:"12345678901234567890123456789016"},
                      {SKUId:180,description:"another product",price:11.99,RFID:"12345678901234567890123456789038"}],
          restockOrderId : 1
      };
        await agent.post('/api/returnOrder/').send(req).then(function(res){
          res.should.have.status(201);
        })
    });
      
    it('get return order by id',async()=>{
      await agent.get('/api/returnOrders/').then(async(res)=>{
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        let id = res.body[res.body.length-1].id;
        await agent.get('/api/returnOrders/'+id).then(function(res){
            res.should.have.status(200);
            
        })
    })
  })
  it('get return order by id- not found',async()=>{
    await agent.get('/api/returnOrders/').then(async(res)=>{
      res.should.have.status(200);
      res.should.to.be.json;
      res.body.should.be.a('array');
      let id = res.body[res.body.length-1].id+100;
      await agent.get('/api/returnOrders/'+id).then(function(res){
          res.should.have.status(404);
          
      })
  })
})
it('get return order by id- unprocessable',async()=>{
  let id='a';
    await agent.get('/api/returnOrders/'+id).then(function(res){
        res.should.have.status(422);
        
})
})
    after(async()=>{

      await agent.get('/api/returnOrders/').then(async(res)=>{
        res.should.have.status(200);
        res.should.to.be.json;
        res.body.should.be.a('array');
        let id = res.body[res.body.length-1].id;
        console.log(id+'deleted')
      await agent.delete('/api/returnOrder/'+id).then(function(res){
        res.should.have.status(204);})
        id = id-1;
        console.log(id+'deleted')
        await agent.delete('/api/returnOrder/'+id).then(function(res){
          res.should.have.status(204);})
    })
  })
  });
  }

  getReturnOrderById();
  

    /**
 * API:
 *            DELETE /api/returnOrder/:id
 * =================================================
 */
     function deleteReturnOrder(id,expectedStatus){
        describe('delete return order',()=>{
          before(async() => {
            let req = {
              returnDate:"2021/11/29 09:33",
              products: [{SKUId:12,description:"a product",price:10.99, RFID:"12345678901234567890123456789016"},
                          {SKUId:180,description:"another product",price:11.99,RFID:"12345678901234567890123456789038"}],
              restockOrderId : 1
          };
            await agent.post('/api/returnOrder/').send(req).then(function(res){
              res.should.have.status(201);
            })
            req = {
              returnDate:"2021/11/29 09:33",
              products: [{SKUId:12,description:"a product",price:10.99, RFID:"12345678901234567890123456789016"},
                          {SKUId:180,description:"another product",price:11.99,RFID:"12345678901234567890123456789038"}],
              restockOrderId : 1
          };
            await agent.post('/api/returnOrder/').send(req).then(function(res){
              res.should.have.status(201);
            })
        });

        it('delete return order',async()=>{
          await agent.get('/api/returnOrders/').then(async(res)=>{
            res.should.have.status(200);
            res.should.to.be.json;
            res.body.should.be.a('array');
            let id = res.body[res.body.length-1].id;
            console.log(id+'deleted')
          await agent.delete('/api/returnOrder/'+id).then(function(res){
            res.should.have.status(204);
          })
            })
          })
          it('delete return order',async()=>{
            await agent.get('/api/returnOrders/').then(async(res)=>{
              res.should.have.status(200);
              res.should.to.be.json;
              res.body.should.be.a('array');
              let id = res.body[res.body.length-1].id;
              console.log(id+'deleted')
            await agent.delete('/api/returnOrder/'+id).then(function(res){
              res.should.have.status(204);
            })
              })
            })
            it('delete return order',async()=>{
              let id='a';
              await agent.delete('/api/returnOrder/'+id).then(function(res){
                res.should.have.status(422);
              })
            })
              
        });
      }
deleteReturnOrder();