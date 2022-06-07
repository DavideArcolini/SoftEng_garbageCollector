"use strict";

/* --------- IMPORT MODULES --------- */
const dayjs         = require( 'dayjs');
const { testEditRestockWrongOrderSkuItems } = require('../acceptanceTest/utils-restockorder');
const reoDAO         = require("../db/ReturnOrderDAO");
const roDAO          = require("../db/RestockOrderDAO");


/* --------- ERROR MESSAGES --------- */
const ERROR_422 = {code: 422, message: 'Unprocessable Entity'};
const MESSG_200 = {code: 200, message: 'Ok'}
const MESSG_201 = {code: 201, message: 'Created'};
const MESSG_204 = {code: 204, message: 'No Content'};
const ERROR_404 = {code: 404, message: 'Not Found'};

class ReturnOrderController {
    constructor(generalPurposeDAO) {
        this.reoDAO = new reoDAO(generalPurposeDAO);
        this.roDAO  = new roDAO(generalPurposeDAO); 
    }

    createReturnOrder = async (returnDate,restockOrderId,products) => {
       /* if (returnDate===undefined || restockOrderId===undefined ) { 
            return ERROR_422;         
          }*/
        try{
            
           let restockOrder = await this.roDAO.getRestockOrderById(restockOrderId);
            if(restockOrder[0]===undefined){
                return ERROR_404;
            }
            
            
            await this.reoDAO.createReturnOrder(returnDate,restockOrderId,products);
            
            return {
                code: 201
            }
    }catch(error){
        
        throw error;
    }
        
        
    }
        
        
        
    





    getReturnOrderById = async (id) => {
        
        try{
           
            let response = await this.reoDAO.getReturnOrderById(id);
            if(response==null || response[0]==null){
               return ERROR_404;
            }
        
            let result = {id: response[0].id, returnDate: response[0].returnDate, restockOrderId: response[0].restockOrderId};
        
            let products = response.map( (x)=>{
            
                delete x.id
                delete x.returnDate
                delete x.restockOrderId
                return x;
                
            }) ;
                result = {...result , products : products };   
            return {
                code: 200,
                message: result
            }
        }catch(error){
        
            throw error;
        }

    }
    getReturnOrders = async () =>{
        try{
           
                let result = await this.reoDAO.getReturnOrders();
                
                await Promise.all(result.map(async (x) => {
                        x.products = await this.reoDAO.getSkuItemsOfReturnOrder(x.id)
                }));

                return result;
            }catch(error){
            
                throw error;
            }
    }
   
    deleteReturnOrder = async (id) => {
    
        try{
        await this.reoDAO.deleteReturnOrder(id);
        return {
            code: 204
        }
        }catch(error){
            
            throw error;
        }
    }
    

    

}

module.exports = ReturnOrderController;