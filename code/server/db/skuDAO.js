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
        const result = this.dao.all(
            querySQL
        ).catch((error) => {
            throw new Error(error.message);
        });

        return result;
    }

    getSKUByID = async (id) => {
        const querySQL = "SELECT * FROM SKUS WHERE SKUS.id == ?";
        const result = this.dao.get(
            querySQL,
            [
                id
            ]
        ).catch((error) => {
            throw new Error(error.message);
        });

        return result;
    }

    /**
     * Retrieve the SKU having the positionID specified
     * ------------------------------------------------
     * @param {String} positionID 
     * @returns a SKU Object having the positionID specified
     */
    getSKUByPositionID = async (positionID) => {
        const querySQL = "SELECT * FROM SKUS WHERE SKUS.position == ?";
        const result = this.dao.get(
            querySQL, 
            [
                positionID
            ]
        ).catch((error) => {
            throw new Error(error.message);
        });

        return result;
    }

    /**
     * Create a new SKU in the DB
     * --------------------------
     * @param {JSON} skuObject 
     */
    newSKU = async (skuObject) => {
        const querySQL = "INSERT INTO SKUS (DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?)";
        return this.dao.run(
            querySQL,
            [
                skuObject.description,
                skuObject.weight,
                skuObject.volume,
                skuObject.notes,
                skuObject.price,
                skuObject.availableQuantity
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }

    /**
     * Update a SKU Object given its ID
     * --------------------------------
     * @param {Number} id 
     * @param {JSON} skuObject 
     */
    updateSKU = async (id, skuObject) => {
        const querySQL = "UPDATE SKUS SET description = ?, weight = ?, volume = ?, notes = ?, price = ?, availableQuantity = ? WHERE id == ?";
        return this.dao.run(
            querySQL,
            [
                skuObject.newDescription, 
                skuObject.newWeight, 
                skuObject.newVolume, 
                skuObject.newNotes, 
                skuObject.newPrice, 
                skuObject.newAvailableQuantity, 
                id
            ]
        ).then((result) => {
            return result
        }).catch((error) => {
            throw new Error(error.message);
        });
    }

    /**
     * Update the positionID of a SKU given its id
     * ---------------------------------------------------
     * @param {String} positionID 
     * @param {String} newPositionID 
     */
    updateSKUpositionID = async (id, newPositionID) => {
        const querySQL = "UPDATE SKUS SET position = ? WHERE id == ?";
        const result = this.dao.run(
            querySQL,
            [
                newPositionID,
                id
            ]
        ).catch((error) => {
            throw new Error(error.message);
        });

        return result;
    }

    /**
     * Remove the SKU Object corresponding to the given ID from DB
     * -----------------------------------------------------------
     * @param {Number} id 
     */
    deleteSKU = async (id) => {
        const querySQL = "DELETE FROM SKUS WHERE SKUS.ID == ?";
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

module.exports = SKUDAO;