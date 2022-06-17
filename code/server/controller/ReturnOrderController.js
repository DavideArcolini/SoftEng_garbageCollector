"use strict";

/* --------- IMPORT MODULES --------- */
const dayjs         = require( 'dayjs');


/* --------- ERROR MESSAGES --------- */
const ERROR_422 = {code: 422, message: 'Unprocessable Entity'};
const MESSG_200 = {code: 200, message: 'Ok'}
const MESSG_201 = {code: 201, message: 'Created'};
const MESSG_204 = {code: 204, message: 'No Content'};
const ERROR_404 = {code: 404, message: 'Not Found'};

class ReturnOrderController {
    constructor(reoDAO, roDAO) {
        this.reoDAO = reoDAO;
        this.roDAO = roDAO;
    }   

    /**
     * CHANGE1 - ISSUE 24: products[i].itemId is now defined
     * DELIVERY_2022-06-22
     * ------------------------------------------------------------
     * @param {String} returnDate 
     * @param {Number} restockOrderId 
     * @param {Array} products 
     * @returns 201 on success
     */
    createReturnOrder = async (returnDate, restockOrderId, products) => {
        try {

            /* checking restock order associated to restockOrderId */
            let restockOrder = await this.roDAO.getRestockOrderById(restockOrderId);
            if (restockOrder[0] === undefined) {
                return ERROR_404;
            }
            
            /* storing new return order in DB */
            await this.reoDAO.createReturnOrder(returnDate, restockOrderId, products);
            return {
                code: 201
            }

        } catch(error) {
            throw error;
        }   
    }
        
    /**
     * CHANGE1 - ISSUE 24: products[i].itemId is now defined
     * DELIVERY_2022-06-22
     * ------------------------------------------------------------
     * @param {Number} id 
     * @returns an Object corresponding to the return order associated to id
     */
    getReturnOrderById = async (id) => {
        try{
            
            /* retrieving list of return orders objects as they are in DB */
            let response = await this.reoDAO.getReturnOrderById(id);
            if (response.length === 0){
               return ERROR_404;
            }
            
            /* creating result object */
            let result = {id: response[0].id, returnDate: response[0].returnDate, restockOrderId: response[0].restockOrderId};
            let products = response.map( (x)=>{
                delete x.id
                delete x.returnDate
                delete x.restockOrderId
                return x;
            });
            result = {...result , products : products };   

            return {
                code: 200,
                message: result
            }
        } catch(error) {
            throw error;
        }
    }

    /**
     * CHANGE1 - ISSUE 24: products[i].itemId is now defined
     * DELIVERY_2022-06-22
     * ------------------------------------------------------------
     * @returns Array of return orders on success
     */
    getReturnOrders = async () =>{
        try {
            
            /* retrieving return orders as they are in DB */
            let result = await this.reoDAO.getReturnOrders();
                
            /* compacting products */
            await Promise.all(result.map(async (x) => {
                    x.products = await this.reoDAO.getSkuItemsOfReturnOrder(x.id)
            }));

            return result;
        } catch(error) {
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