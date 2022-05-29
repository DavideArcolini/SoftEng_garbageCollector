/**
 *                         DAO: SKUitemDAO
 * =====================================================================
 * Data Access Objects (DAOs) are used by controllers in order to access
 * the database in a more structural and modular fashion. 
 * ---------------------------------------------------------------------
 * In particular, SKUitemDAO is the DAO of the class SKUitemController.
 * It has a constructor, which creates the SKUitemDAO object starting 
 * from a general purpose DAO, which implements the functions:
 *      - run() to execute a query without results returned
 *      - get() to execute a query with a single result returned
 *      - all() to execute a query with an array of results returned.
*/

'use strict'

class SKUitemDAO {
 
     /**
      * CONSTRUCTOR: SKUitemDAO
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
      * Retrieves all the SKUitems object in the DB
      * ----------------------------------------------------------------------
      * @returns an Array object containing all SKUitems objects in the DB.
      */
    getSKUitems = async () => {
        const querySQL = "SELECT * FROM SKUITEMS";
        return this.dao.all(
            querySQL
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }
 
     /**
      * Retrieve the available SKUitems having the SKUid 
      * specified 
      * ----------------------------------------------------
      * @param {Number} SKUid 
      * @returns an Array of available SKUitems having the 
      *          SKUid specified
      */
    getSKUitemsBySKUid = async (SKUid) => {
        const querySQL = "SELECT * FROM SKUITEMS WHERE SKUITEMS.SKUid == ? AND SKUITEMS.Available == 1";
        return this.dao.all(
            querySQL,
            [
                SKUid
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        })
    }

    /**
     * Retrieve the SKUitem having the given RFID
     * ---------------------------------------------------------
     * @param {String} rfid 
     * @returns a SKUitem Object corresponding to the RFID given
     */
    getSKUitemByRFID = async (rfid) => {
        const querySQL = "SELECT * FROM SKUITEMS WHERE SKUITEMS.RFID == ?";
        return this.dao.get(
            querySQL,
            [
                rfid
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }

    /**
     * Insert a new SKUitem in the DB
     * ------------------------------
     * @param {JSON} skuItemObject 
     * @returns No Object
     */
    newSkuItem = async (skuItemObject) => {
        const querySQL = "INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
        return this.dao.run(
            querySQL, 
            [
                skuItemObject.RFID,
                skuItemObject.SKUId,
                (skuItemObject.DateOfStock === undefined) ? "" : skuItemObject.DateOfStock

            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }

    /**
     * Update a SKUitem Object
     * ---------------------------
     * @param {String} rfid 
     * @param {JSON} skuItemObject 
     * @returns No Object
     */
    updateSKUitem = async (rfid, skuItemObject) => {
        const querySQL = "UPDATE SKUITEMS SET RFID = ?, Available = ?, DateOfStock = ? WHERE SKUITEMS.RFID == ?";
        return this.dao.run(
            querySQL,
            [
                skuItemObject.newRFID,
                skuItemObject.newAvailable,
                skuItemObject.newDateOfStock,
                rfid
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }

    /**
     * Remove a SKUitem from the DB
     * ----------------------------
     * @param {String} rfid 
     * @returns No Object
     */
    deleteSKUitem = async (rfid) => {
        const querySQL = "DELETE FROM SKUITEMS WHERE SKUITEMS.RFID == ?";
        return this.dao.run(
            querySQL,
            [
                rfid
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }
}
 
module.exports = SKUitemDAO;