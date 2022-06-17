"use strict";

/* --------- IMPORT MODULES --------- */
const dayjs         = require( 'dayjs');

/* --------- ERROR MESSAGES --------- */
const ERROR_422 = {code: 422, message: 'Unprocessable Entity'};
const MESSG_200 = {code: 200, message: 'Ok'}
const MESSG_201 = {code: 201, message: 'Created'};
const MESSG_204 = {code: 204, message: 'No Content'};
const ERROR_404 = {code: 404, message: 'Not Found'};

/**
 * CLASS:   Restock Orders
 * =================
 * METHOD: 
 *          - createRestockOrder()              --> API: POST /api/restockOrder
 *          - getRestockOrders()                --> API: GET /api/restockOrders
 *          - getRestockOrdersIssued()          --> API: GET /api/restockOrdersIssued
 *          - getRestockOrderById               --> API: GET /api/restockOrders/:id
 *          - getReturnItems()                  --> API: GET /api/restockOrders/:id/returnItems
 *          - modifyRestockOrderState()         --> API: PUT /api/restockOrder/:id
 *          - setSkuItems()                     --> API: PUT /api/restockOrder/:id/skuItems
 *          - addTransportNote()                --> API: PUT /api/restockOrder/:id/transportNote
 *          - deleteRestockOrder()              --> API: DELETE /api/restockOrder/:id
*/

class RestockOrderController {
    constructor(roDAO, testResultDAO) {
        this.roDAO = roDAO;
        this.testResultDAO = testResultDAO
    }

    createRestockOrder = async (issueDate,supplierId,products) => {

        try{
            
            await this.roDAO.createRestockOrder(issueDate,supplierId,products);
            return MESSG_201;
        }
        catch(error){
            return new Error();

        }  
        
    }
  
   

    getRestockOrders = async () =>{
        
        try{
            /* retrieve all Restock Orders from DB */
            const restockOrders = await this.roDAO.getRestockOrders();

            
                await Promise.all(restockOrders.map(async (x) => {
                    /*add products to restock order */
                    x.products = await this.roDAO.getProductsOfRestockOrder(x.id);
                    /*add skuItems to restock order */
                    x.skuItems = await this.roDAO.getSkuItemsOfRestockOrder(x.id);
    
                    if(x.state!=="ISSUED"){
                        x.transportNote = {"deliveryDate" : x.deliveryDate};
                    }
                    delete x.deliveryDate;
                    return x;
                }));
                return restockOrders;
            }catch(error){
    
                throw error;
            }      
        
    }

    getRestockOrdersIssued = async () =>{
        try{
            /* retrieve all Restock Orders in state ISSUED from DB */
            const restockOrdersIssued = await this.roDAO.getRestockOrdersIssued();
            
           
            await Promise.all(restockOrdersIssued.map(async (x) => {
                /*add products to restock order */
                x.products = await this.roDAO.getProductsOfRestockOrder(x.id);
                
                /*add skuItems to restock order */
                x.skuItems = await this.roDAO.getSkuItemsOfRestockOrder(x.id);

                /*if state==ISSUED there is no transportNote */
                delete x.deliveryDate;

                return x;
            }));
            return restockOrdersIssued;
        }catch(error){
            
            throw error;
        }
    }

    getRestockOrderById = async (id) => {
            try{
            /* retrieve the restock order associated to the ID */
            const restockOrder = await this.roDAO.getRestockOrderById(id);
            if(restockOrder.length===0){
                return ERROR_404;
            }
            
            let result = {id: restockOrder[0].id, issueDate: restockOrder[0].issueDate, state: restockOrder[0].state, supplierId: restockOrder[0].supplierId,  transportNote : {"deliveryDate" : restockOrder[0].deliveryDate}};
            
            /* retrieve products from restock order records*/
            let products = restockOrder.map( (x)=>{
                delete x.id
                delete x.issueDate
                delete x.state
                delete x.supplierId
                delete x.deliveryDate
                delete x.RFID
                
                return x;
                
    }) ;
            result = {...result , products : Array.from(products) };   
            /* add skuItems to the result */
            result = {...result , skuItems : await this.roDAO.getSkuItemsOfRestockOrder(id) };
            /*if state==ISSUED there is no transportNote */
            if(result.state==="ISSUED"){
                delete result.transportNote;
            }
          
            return { code:200,
                    message: result};
        }catch(error){
           
            throw error;
        }
      
    }

    deleteRestockOrder = async (id) => {

        try{
            await this.roDAO.deleteRestockOrder(id);
            return MESSG_204;
        }catch(error){
            throw new Error(error.message);
        }
    }
  
    modifyRestockOrderState = async(id,newState) => {
        
        try{
            /* check if the restock order exists */
            let result = await this.roDAO.getRestockOrderById(id)
            if(result.length===0){
                return ERROR_404;
            }
            /* modify state */
           await this.roDAO.modifyRestockOrderState(id,newState);
           return MESSG_200;

        }catch(error){
            throw error;
        }

}

    setSkuItems = async(id,skuItems) => {

        try{
            let restockOrder = await this.roDAO.getRestockOrderById(id);
            if(restockOrder.length===0){
                return ERROR_404;
            }

            if( restockOrder[0].state!=="DELIVERED") {
               
                return ERROR_422;
            }
            await this.roDAO.setSkuItems(id,skuItems);
            return MESSG_200;
        }catch(error){
            
            throw error;
        }

    }

    addTransportNote = async(id,transportNote) => {
        try{
            let restockOrder = await this.roDAO.getRestockOrderById(id);
            if(restockOrder.length===0){
                return ERROR_404;
            }
            if(restockOrder[0].state!=="DELIVERY" || dayjs(transportNote.deliveryDate).isBefore(dayjs(restockOrder[0].issueDate))) {
                return ERROR_422;
            }
            await this.roDAO.addTransportNote(id,transportNote);
            return MESSG_200;
        }catch(error){
            throw error;
        }

    }
    
    getReturnItems = async(id) => {

  
        try{
            const restockOrder = await this.roDAO.getRestockOrderById(id);
            if(restockOrder.length===0){
                return ERROR_404;
            }

            if(restockOrder[0].state!=="COMPLETEDRETURN") {
               return ERROR_422;
            }
            let skuItems = await this.roDAO.getSkuItemsOfRestockOrder(id);

            let result = await skuItems.filter(async (x)=>{
                
                let TestResults = await this.testResultDAO.getTestResults(x.RFID);

                if(TestResults!==undefined && TestResults.filter((x)=>x.Result==false).length!=0 ){
                    return x;
                }
               
            })
            return {code: 200, message: result};

        }catch(error){
            return new Error(error.message);
        }
    }



}

module.exports = RestockOrderController;