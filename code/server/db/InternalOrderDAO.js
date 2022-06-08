/**
 *                         DAO: InternalOrderDAO
 * =====================================================================
 * Data Access Objects (DAOs) are used by controllers in order to access
 * the database in a more structural and modular fashion. 
 * ---------------------------------------------------------------------
 * In particular, InternalOrderDAO is the DAO of the class InternalOrderUController.
 * It has a constructor, which creates the SKUDAO object starting 
 * from a general purpose DAO, which implements the functions:
 *      - run() to execute a query without results returned
 *      - get() to execute a query with a single result returned
 *      - all() to execute a query with an array of results returned.
 */

 'use strict'

 class InternalOrderDAO {
 
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
      * Retrieves all the products object associated to the internal order in the DB
      * ----------------------------------------------------------------------
      * @returns an Array object containing all products objects in the DB.
    */
         getProductsOfInternalOrder = async (id) => {

            const querySQL = "SELECT id, SKUId, description, price, COUNT(*) as qty FROM INTERNAL_ORDERS WHERE id==? GROUP BY id, SKUId, description, price ";
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
          getSkuItemsOfInternalOrder = async (id) => {

            const querySQL =  "SELECT SKUId, description, price, RFID FROM INTERNAL_ORDERS WHERE id==?";
            return this.dao.all(
                querySQL,id
            ).then((result)=>{
                return result;
            }).catch((error)=>{
                throw new Error(error.message);
            })
        }
     /**
      * Retrieves all the InternalOrders object in the DB
      * ----------------------------------------------------------------------
      * @returns an Array object containing all InternalOrders objects in the DB.
      */


     getInternalOrders = async () => {

        const querySQL = "SELECT id, issueDate, state, customerId FROM INTERNAL_ORDERS GROUP BY id, issueDate, state, customerId";
        return this.dao.all(
            querySQL
        ).then((result)=>{
            return result;
        }).catch((error)=>{
            throw new Error(error.message);
        })
    }


      /**
      * Retrieves all the InternalOrders issued object in the DB
      * ----------------------------------------------------------------------
      * @returns an Array object containing all InternalOrders issued objects in the DB.
      */
          getInternalOrdersIssued = async () => {

            const querySQL = "SELECT id, issueDate, state, customerId FROM INTERNAL_ORDERS WHERE state==? GROUP BY id, issueDate, state, customerId";
            return this.dao.all(
                querySQL,["ISSUED"]
            ).then((result)=>{
                return result;
            }).catch((error)=>{
               
                throw new Error(error.message);
            })
        }

              /**
      * Retrieves all the InternalOrders accepted object in the DB
      * ----------------------------------------------------------------------
      * @returns an Array object containing all InternalOrders accepted objects in the DB.
      */
               getInternalOrdersAccepted = async () => {

                const querySQL = "SELECT id, issueDate, state, customerId FROM INTERNAL_ORDERS WHERE state==? GROUP BY id, issueDate, state, customerId ";
                return this.dao.all(
                    querySQL,["ACCEPTED"]
                ).then((result)=>{
                    return result;
                }).catch((error)=>{
                    throw new Error(error.message);
                })
            }
    

    /**
      * Retrieves internal order object by its ID in the DB
      * ----------------------------------------------------------------------
      * @returns an object containing the Internal Order associated to the ID in the DB.
    */
 
     getInternalOrderById = async (id) => {
         const querySQL = "SELECT id, issueDate, state, customerId, SKUId, description, price, COUNT(*) as qty FROM INTERNAL_ORDERS WHERE id==? GROUP BY id, issueDate, state, customerId, SKUId, description, price ";
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
      * @param {Date} issueDate
      * @param {Number} supplierId
      * @param {products} Array  
      */
      createInternalOrder = async (issueDate,products,customerId) => {
        /*  assign the ID to the new Internal order*/
        try{
        let querySQL = "SELECT MAX(id) as id FROM INTERNAL_ORDERS"
        let max_id = await this.dao.get(querySQL);
        let id=1;
        if(max_id !==undefined && max_id.id!==null)
            id = max_id.id+1;
      
            for (let prod of products)
            {
            
                await Promise.all([...Array(parseInt(prod.qty))].map(async () => {
                   /*sql = `SELECT *
                            FROM SKUS
                            WHERE id==?`
                    let result = await this.dao.all(sql,[prod.SKUId]);
                    if(result.length===0){
                        return {message: "Not Found"};
                    }*/
                    querySQL = "INSERT INTO INTERNAL_ORDERS(id, issueDate, state, customerId, SKUId, description, price) VALUES(?,?,?,?,?,?,?)"
                    await this.dao.run(querySQL,[id, issueDate,"ISSUED", customerId, prod.SKUId, prod.description, prod.price])
                }));

            }

            return id;
        }catch(error){
           
            throw new Error(error.message);

        }
     }
 
     /**
      * Update a internal order's state given its ID
      * --------------------------------
      * @param {Number} id 
      * @param {String} newState
      */
     modifyInternalOrderState = async (id, newState) => {
         const querySQL = "UPDATE INTERNAL_ORDERS SET state=? WHERE id==?";
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
      * Update a internal order's skuItems given its ID
      * --------------------------------
      * @param {Number} id 
      * @param {Object} skuItems
      */
      setSkuItems = async (id, products) => {
        try{
            for (const prod of products) {
                
               let sql =  "SELECT MIN(key) as min_id  FROM INTERNAL_ORDERS WHERE id==? AND SKUId==? AND RFID IS NULL ";

                /*get the skuID that has not a skuItem associated yet */
                let pid= await this.dao.get(sql,[id,prod.SkuID]);
                
                /* update the record associated to the skuItem */
                sql = "UPDATE INTERNAL_ORDERS SET RFID=? WHERE SKUId==? AND id==? AND key == ?";
                await this.dao.run(sql,[prod.RFID, prod.SkuID, id, pid.min_id])
               
            }
    
            return id;
        }catch(error){
            throw new Error(error.message);
        };
    }


 
     /**
      * Remove the Restock Order Object corresponding to the given ID from DB
      * -----------------------------------------------------------
      * @param {Number} id 
      */
      deleteInternalOrder = async (id) => {
         const querySQL = "DELETE FROM INTERNAL_ORDERS WHERE id==?";
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
 
 module.exports = InternalOrderDAO;