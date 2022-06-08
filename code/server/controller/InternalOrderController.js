"use strict";

/* --------- IMPORT MODULES --------- */
const dayjs         = require( 'dayjs');
const { testEditRestockWrongOrderSkuItems, testEditRestockOrderTransportNoteNotFound } = require('../acceptanceTest/utils-restockorder');
const ioDAO         = require("../db/InternalOrderDAO");


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
 *          - getInternalOrders()                --> API: GET /api/restockOrders
 *          - getRestockOrdersIssued()          --> API: GET /api/restockOrdersIssued
 *          - getRestockOrderById               --> API: GET /api/restockOrders/:id
 *          - getReturnItems()                  --> API: GET /api/restockOrders/:id/returnItems
 *          - modifyRestockOrderState()         --> API: PUT /api/restockOrder/:id
 *          - setSkuItems()                     --> API: PUT /api/restockOrder/:id/skuItems
 *          - addTransportNote()                --> API: PUT /api/restockOrder/:id/transportNote
 *          - deleteRestockOrder()              --> API: DELETE /api/restockOrder/:id
*/


class InternalOrderController {
    constructor(generalPurposeDAO) {
        this.ioDAO = new ioDAO(generalPurposeDAO);
    }

    createInternalOrder = async (issueDate,products,customerId) => {
        try{

            await this.ioDAO.createInternalOrder(issueDate,products,customerId);
            return {
                code: 201
            }
        }catch(error){
            throw error;
        }
    }

    getInternalOrders = async () =>{
        try{
            let result = await this.ioDAO.getInternalOrders();
            await Promise.all(result.map(async (x) => {
                if(x.state!=="COMPLETED"){
                    x.products = await this.ioDAO.getProductsOfInternalOrder(x.id);
                    
                }else{
                    
                    x.products = await this.ioDAO.getSkuItemsOfInternalOrder(x.id);
                    
                }
            }));
            
            return result;
        }catch(error){

            throw error;
        }
}

    getInternalOrdersIssued = async () =>{
        try{
            
            let result = await this.ioDAO.getInternalOrdersIssued();
           
            await Promise.all(result.map(async (x) => {
                    x.products = await this.ioDAO.getProductsOfInternalOrder(x.id);                              
            }));
        
            return result;
        }catch(error){
            throw error;
        }
}

    getInternalOrdersAccepted = async (req, res) =>{
        try{
        
        let result = await this.ioDAO.getInternalOrdersAccepted();
        await Promise.all(result.map(async (x) => {
             
                x.products = await this.ioDAO.getSkuItemsOfInternalOrder(x.id);
               
            }));

        return result;
    }catch(error){
       
        throw error;
    }
 }

    getInternalOrderById = async (id) => {
       
        try{
            
            let response = await this.ioDAO.getInternalOrderById(id);
            if(response===undefined || response.length===0){
                return ERROR_404;
            }
            
            let result = {id: response[0].id, issueDate: response[0].issueDate, state: response[0].state,customerId: response[0].customerId};
            if(result.state!=="COMPLETED"){
            let products = response.map( (x)=>{
                
                delete x.id
                delete x.issueDate
                delete x.state
                delete x.customerId
                
                return x;
                
            }) 
            result = {...result , products : products }           
            
            } 
            else{

                
                result = {...result , products : await this.ioDAO.getSkuItemsOfInternalOrder(x.id)};
                return result;
            }
            
            return {
                code: 200,
                message: result
            };
        }catch(error){
            
            throw error;
        }
}

    modifyInternalOrderState = async(id,newState,products) => {
     
        try{
            let result = await this.ioDAO.getInternalOrderById(id);
            if(result==null || result.length===0){
               return ERROR_404;
            }

            await this.ioDAO.modifyInternalOrderState(id,newState);

            if(newState === "COMPLETED"){
                  await this.ioDAO.setSkuItems(id,products);
            }

            return {
                code: 200
            }
        }catch(error){
            
            throw error;
        }

}


deleteInternalOrder = async (id) => {
    
    try{
       await this.ioDAO.deleteInternalOrder(id);

        return {
            code: 204
        }
    }catch(error){
        
        throw error;
    }
}
  
   

    

    

}

module.exports = InternalOrderController;