/**
 *                         DAO: ReturnOrderDAO
 * =====================================================================
 * Data Access Objects (DAOs) are used by controllers in order to access
 * the database in a more structural and modular fashion. 
 * ---------------------------------------------------------------------
 * In particular, ReturnOrderDAO is the DAO of the class ReturnOrderUController.
 * It has a constructor, which creates the SKUDAO object starting 
 * from a general purpose DAO, which implements the functions:
 *      - run() to execute a query without results returned
 *      - get() to execute a query with a single result returned
 *      - all() to execute a query with an array of results returned.
 */

 'use strict'

 class ReturnOrderDAO {
 
     /**
      * CONSTRUCTOR: SKUDAO
      * ---------------------------------
      * @param {Object} generalPurposeDAO 
      */
      constructor (generalPurposeDAO) {
         this.dao = generalPurposeDAO;
     }
 
     /*
         + -------------------- +
         |        METHODS       |
         + -------------------- +
     */

     
    /**
     * Retrieves all the skuItems object associated to the return order in the DB
     * ------------------------------------------------------------
     * CHANGE1 - ISSUE 24: products[i].itemId is now defined
     * DELIVERY_2022-06-22
     * ----------------------------------------------------------------------
     * @returns an Array object containing all skuItems objects in the DB.
    */
    getSkuItemsOfReturnOrder = async (id) => {
        const querySQL =  "SELECT SKUId, description, price, RFID, itemId FROM RETURN_ORDERS WHERE id == ? ";
        return this.dao.all(
            querySQL, 
            [
                id
            ]
        ).then((result)=>{
            return result;
        }).catch((error)=>{
            throw new Error(error.message);
        })
    }


     /**
      * Retrieves all the ReturnOrders object in the DB
      * ------------------------------------------------------------
      * CHANGE1 - ISSUE 24: products[i].itemId is now defined
      * DELIVERY_2022-06-22
      * ----------------------------------------------------------------------
      * @returns an Array object containing all ReturnOrders objects in the DB.
      */
    getReturnOrders = async () => {
        const querySQL = "SELECT id, returnDate, restockOrderId FROM RETURN_ORDERS GROUP BY id, returnDate, restockOrderId";
        return await this.dao.all(
            querySQL
        ).then((result)=>{
            return result;
        }).catch((error)=>{
            throw new Error(error.message);
        })
    }



    /**
     * Retrieves return order object by its ID in the DB
     * ------------------------------------------------------------
     * CHANGE1 - ISSUE 24: products[i].itemId is now defined
     * DELIVERY_2022-06-22
     * ----------------------------------------------------------------------
     * @returns an object containing the Return Order associated to the ID in the DB.
    */
    getReturnOrderById = async (id) => {
        const querySQL = "SELECT id, returnDate, restockOrderId, SKUId, description, price, RFID, itemId FROM RETURN_ORDERS WHERE id==? GROUP BY id, returnDate, restockOrderId, SKUId, description, price, RFID, itemId";
        return this.dao.all(
            querySQL,
            [
                id
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }
 

     /**
      * Create a new Internal Order in the DB
      * --------------------------
      * CHANGE1 - ISSUE 24: products[i].itemId is now defined
      * DELIVERY_2022-06-22
      * --------------------------
      * @param {Date} issueDate
      * @param {Number} supplierId
      * @param {products} Array  
      */
    createReturnOrder = async (returnDate,restockOrderId,products)  => {
        try {

            /*  assign the ID to the new Return order*/
            let querySQL = "SELECT MAX(id) as id FROM RETURN_ORDERS";
            let max_id = await this.dao.get(querySQL);
            let id = 1;
            if (max_id !== undefined && max_id.id !== null) {
                id = max_id.id+1;
            }
            
            /* storing products */
            querySQL = "INSERT INTO RETURN_ORDERS(id, returnDate, restockOrderId, SKUId, description, price, RFID, itemId) VALUES(?,?,?,?,?,?,?,?)"
            for (const prod of products) {       
                await this.dao.run(querySQL,[id, returnDate,  restockOrderId, prod.SKUId, prod.description, prod.price, prod.RFID, prod.itemId]);
            }
            return id;

        } catch(error) {
            throw new Error(error.message);
        }
    }
 
    

 
     /**
      * Remove the Return Order Object corresponding to the given ID from DB
      * -----------------------------------------------------------
      * @param {Number} id 
      */
      deleteReturnOrder = async (id) => {
         const querySQL = "DELETE FROM RETURN_ORDERS WHERE id==?";
         return this.dao.run(
             querySQL,
             [
                 id
             ]
         ).then((result) => {
            
             return result
         }).catch((error) => {
             throw new Error(error.message);
         });
     }
 }
 
 module.exports = ReturnOrderDAO;