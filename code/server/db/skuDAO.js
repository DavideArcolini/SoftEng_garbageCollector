/**
 *                         DAO: SKUDAO
 * =====================================================================
 * Data Access Objects (DAOs) are used by controllers in order to access
 * the database in a more structural and modular fashion. 
 * ---------------------------------------------------------------------
 * In particular, SKUDAO is the DAO of the class SKUController.
 * It has a constructor, which creates the SKUDAO object starting 
 * from a general purpose DAO, which implements the functions:
 *      - run() to execute a query without results returned
 *      - get() to execute a query with a single result returned
 *      - all() to execute a query with an array of results returned.
 */

'use strict'

class SKUDAO {

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
     * Retrieves all the SKUs object in the DB
     * ----------------------------------------------------------------------
     * @returns an Array object containing all SKUs objects in the DB.
     */
    getSKUs = async () => {
        const querySQL = "SELECT * FROM SKUS";
        const skus = this.dao.all(
            querySQL
        ).catch((error) => {
            throw new Error(error.message);
        });

        return skus;
    }

    /**
     * Retrieve the SKU having the positionID specified
     * ------------------------------------------------
     * @param {String} positionID 
     * @returns a SKU Object having the positionID specified
     */
    getSKUByPositionID = async (positionID) => {
        const querySQL = "SELECT * FROM SKUS WHERE SKUS.position == ?";
        const sku = this.dao.get(
            querySQL, 
            [
                positionID
            ]
        ).catch((error) => {
            throw new Error(error.message);
        });

        return sku;
    }

    /**
     * Update the positionID of a SKU given its positionID
     * ---------------------------------------------------
     * @param {String} positionID 
     * @param {String} newPositionID 
     */
    updateSKUpositionID = async (positionID, newPositionID) => {
        const querySQL = "UPDATE SKUS SET position = ? WHERE position == ?";
        const result = this.dao.run(
            querySQL,
            [
                newPositionID,
                positionID
            ]
        ).catch((error) => {
            throw new Error(error.message);
        });

        return result;
    }
}

module.exports = SKUDAO;