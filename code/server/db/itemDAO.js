/**
 *                         DAO: ItemDAO
 * =====================================================================
 * Data Access Objects (DAOs) are used by controllers in order to access
 * the database in a more structural and modular fashion. 
 * ---------------------------------------------------------------------
 * In particular, ItemsDAO is the DAO of the class 
 * ItemController.
 * It has a constructor, which creates the ItemsDAO object 
 * starting from a general purpose DAO, which implements the functions:
 *      - run() to execute a query without results returned
 *      - get() to execute a query with a single result returned
 *      - all() to execute a query with an array of results returned.
 */

 'use strict'

 class ItemDAO {
 
     /**
      * CONSTRUCTOR: ItemsDAO
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
      * Retrieves the Items 
      * ------------------------------------------------------------------------
      * @returns an Array object containing all Items 
    */

     getItems= async () => {
        const querySQL = "SELECT * FROM ITEMS";
        return this.dao.all(
            querySQL,
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }


     /**
      * Retrieves the Item with a particular ID
      * ------------------------------------------------------------------------
      * @returns an object with the same id
    */
      getItemById = async (id) => {
        const querySQL = "SELECT * FROM ITEMS WHERE id=(?)"
        return await this.dao.get(
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
      * Insert itemObject into DB
      * ------------------------------------------------------------------------
      * @returns nothing
    */
        createItem  = async (itemObject) => {
        const querySQL = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
        return await this.dao.run(
            querySQL,
            [
                itemObject.id,
                itemObject.description,
                itemObject.price,
                itemObject.SKUid,
                itemObject.supplierId
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }




    /**
      * Update itemObject in DB
      * ------------------------------------------------------------------------
      * @returns nothing 
      *          
    */
    modifyItem  = async (id,itemObject) => {
    const querySQL = `UPDATE ITEMS SET description=(?), price=(?) WHERE id==?`;
    return this.dao.run(
        querySQL,
        [
            itemObject.newPrice,
            itemObject.newDescription,
            id
        ]
    ).then((result) => {
        return result;
    }).catch((error) => {
        throw new Error(error.message);
    });
}




    /**
      * Delete itemObject in DB
      * ------------------------------------------------------------------------
      * @returns nothing 
      *          
    */
     deleteItem  = async (id) => {
        const querySQL ="DELETE FROM ITEMS WHERE id=(?)";
        return this.dao.run(
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


    //needed for modify
    getItemBySupSKUID=async (SKUid,supplierId)=>{
        const querySQL = "SELECT * FROM ITEMS WHERE SKUId=(?) and supplierId=(?)"
        return this.dao.get(
            querySQL,
            [
                SKUid,
                supplierId
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }


    getItemBySupId = async (id,supplierId) => {
        const querySQL = "SELECT * FROM ITEMS WHERE id=(?) and supplierId=(?)"
        return this.dao.get(
            querySQL,
            [
                id,
                supplierId
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }





 }
 module.exports = ItemDAO;