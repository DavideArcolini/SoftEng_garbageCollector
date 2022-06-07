/**
 *                         DAO: RestockOrderDAO
 * =====================================================================
 * Data Access Objects (DAOs) are used by controllers in order to access
 * the database in a more structural and modular fashion. 
 * ---------------------------------------------------------------------
 * In particular, RestockOrderDAO is the DAO of the class RestockOrderUController.
 * It has a constructor, which creates the SKUDAO object starting 
 * from a general purpose DAO, which implements the functions:
 *      - run() to execute a query without results returned
 *      - get() to execute a query with a single result returned
 *      - all() to execute a query with an array of results returned.
 */

 'use strict'

 class RestockOrderDAO {
 
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
      * Retrieves all the products object associated to the restock order in the DB
      * ----------------------------------------------------------------------
      * @returns an Array object containing all products objects in the DB.
    */
         getProductsOfRestockOrder = async (id) => {

            const querySQL = "SELECT id, SKUId, description, price, COUNT(*) as qty FROM RESTOCK_ORDERS WHERE id==? GROUP BY id, SKUId, description, price ";
            return this.dao.all(
                querySQL,id
            ).then((result)=>{
                result.map((x)=>{
                    delete x.id
                    return x;

            })
                return result;
            }).catch((error)=>{
                throw new Error(error.message);
            })
        }
     
         /**
      * Retrieves all the skuItems object associated to the restock order in the DB
      * ----------------------------------------------------------------------
      * @returns an Array object containing all skuItems objects in the DB.
    */
          getSkuItemsOfRestockOrder = async (id) => {

            const querySQL = "SELECT SKUId, RFID FROM RESTOCK_ORDERS WHERE id==? AND RFID IS NOT NULL";
            return this.dao.all(
                querySQL,id
            ).then((result)=>{
                return result;
            }).catch((error)=>{
                throw new Error(error.message);
            })
        }
     /**
      * Retrieves all the RestockOrders object in the DB
      * ----------------------------------------------------------------------
      * @returns an Array object containing all RestockOrders objects in the DB.
      */


     getRestockOrders = async () => {

        const querySQL = "SELECT id, issueDate, state, supplierId, deliveryDate FROM RESTOCK_ORDERS GROUP BY id";
        return this.dao.all(
            querySQL
        ).then((result)=>{
            return result;
        }).catch((error)=>{
            throw new Error(error.message);
        })
    }


      /**
      * Retrieves all the RestockOrders issued object in the DB
      * ----------------------------------------------------------------------
      * @returns an Array object containing all RestockOrders issued objects in the DB.
      */
          getRestockOrdersIssued = async () => {

            const querySQL = "SELECT id, issueDate, state, supplierId, deliveryDate FROM RESTOCK_ORDERS WHERE state==? GROUP BY id";
            return this.dao.all(
                querySQL,["ISSUED"]
            ).then((result)=>{
                return result;
            }).catch((error)=>{
                throw new Error(error.message);
            })
        }

    /**
      * Retrieves restock order object by its ID in the DB
      * ----------------------------------------------------------------------
      * @returns an object containing the Restock Order associated to the ID in the DB.
    */
 
     getRestockOrderById = async (id) => {
         const querySQL = "SELECT id, issueDate, state, supplierId, SKUId, description, price, deliveryDate, COUNT(*) as qty FROM RESTOCK_ORDERS WHERE id==? GROUP BY id, issueDate, state, supplierId, SKUId, description, price ";
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
      * Create a new Restock Order in the DB
      * --------------------------
      * @param {Date} issueDate
      * @param {Number} supplierId
      * @param {products} Array  
      */
     createRestockOrder = async (issueDate,supplierId,products) => {
        /*  assign the ID to the new restock order*/
        try{
        let querySQL = "SELECT MAX(id) as id FROM RESTOCK_ORDERS"
        let max_id = await this.dao.get(querySQL);
        let id=1;
        if(max_id !==undefined && max_id.id!==null)
            id = max_id.id+1;
      
        
            products.forEach(async (prod)=>
            {
                await Promise.all([...Array(parseInt(prod.qty))].map(async () => {
                    querySQL = "INSERT INTO RESTOCK_ORDERS(id, issueDate, state, supplierId, SKUId, description, price) VALUES(?,?,?,?,?,?,?)";
                    /* add a new row for every product */
                    await this.dao.run(querySQL,[id, issueDate, "ISSUED", supplierId, prod.SKUId, prod.description, prod.price])
                }));

            })
            
            return id;
        }
        catch(error){
           
            throw new Error(error.message);

        }
     }
 
     /**
      * Update a restock order's state given its ID
      * --------------------------------
      * @param {Number} id 
      * @param {String} newState
      */
     modifyRestockOrderState = async (id, newState) => {
         const querySQL = "UPDATE RESTOCK_ORDERS SET state=? WHERE id==?";
         return this.dao.run(
             querySQL,
             [
                 newState, 
                 id
             ]
         ).then((result) => {
             return result
         }).catch((error) => {
            
             throw new Error(error.message);
         });
     }
 
 
     /**
      * Update a restock order's skuItems given its ID
      * --------------------------------
      * @param {Number} id 
      * @param {Object} skuItems
      */
      setSkuItems = async (id, skuItems) => {
        try{
            for (const s of skuItems) {
                
               let sql = `
                    SELECT MIN(key) as min_id 
                    FROM RESTOCK_ORDERS 
                    WHERE id = (?) AND SKUId = (?) AND RFID IS NULL `

                /*get the skuID that has not a skuItem associated yet */
                let pid= await this.dao.get(sql,[id,s.SKUId]);
                
                /* update the record associated to the skuItem */
                sql = `
                    UPDATE RESTOCK_ORDERS 
                    SET RFID = (?) 
                    WHERE SKUId = (?) AND id = (?) AND key = (?)`
                await this.dao.run(sql,[s.rfid, s.SKUId, id, pid.min_id])
               
            }
    
            return id;
        }catch(error){
            throw new Error(error.message);
        };
    }

    /**
      * add a transport note given its ID
      * --------------------------------
      * @param {Number} id 
      * @param {Object} transportNote
      */
          addTransportNote = async (id, transportNote) => {
            const querySQL = "UPDATE RESTOCK_ORDERS SET deliveryDate=? WHERE id==?";
                
            return this.dao.run(
                querySQL,
                [
                    transportNote.deliveryDate,
                    id
                ]
            ).then((result) => {
                return result
            }).catch((error) => {
                
                throw new Error(error.message);
            });
        }
 
     /**
      * Remove the Restock Order Object corresponding to the given ID from DB
      * -----------------------------------------------------------
      * @param {Number} id 
      */
      deleteRestockOrder = async (id) => {
         const querySQL = "DELETE FROM RESTOCK_ORDERS WHERE id==?";
         return this.dao.run(
             querySQL,
             [
                 id
             ]
         ).then((result) => {
             console.log("DELETED RO")
             return result
         }).catch((error) => {
             throw new Error(error.message);
         });
     }
 }
 
 module.exports = RestockOrderDAO;