/**
 *                  DAO: PositionDAO
 * =====================================================================
 * Data Access Objects (DAOs) are used by controllers in order to access
 * the database in a more structural and modular fashion. 
 * ---------------------------------------------------------------------
 * In particular, PositionDAO is the DAO of the class positionController.
 * It has a constructor, which creates the PositionDAO object starting 
 * from a general purpose DAO, which implements the functions:
 *      - run() to execute a query without results returned
 *      - get() to execute a query with a single result returned
 *      - all() to execute a query with an array of results returned.
 */

'use strict'

class PositionDAO {

    /**
     * CONSTRUCTOR: PositionDAO
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
     * Retrieves all the Position object in the DB
     * ----------------------------------------------------------------------
     * @returns an Array object containing all Position objects in the DB.
     */
    getPositions = async () => {
        const querySQL = "SELECT * FROM POSITIONS";
        const result = this.dao.all(
            querySQL
        ).catch((error) => {
            throw new Error(error.message);
        });

        return result;
    }

    /**
     * Retrieves the Position object in the DB corresponding to the positionID
     * ----------------------------------------------------------------------
     * @param {String} positionID 
     * @returns a Position Object.
     */
    getPositionByID = async (positionID) => {
    
        const querySQL = "SELECT * FROM POSITIONS WHERE POSITIONS.positionID == ?";
        const result = this.dao.get(
            querySQL,
            [
                positionID
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });

        return result;
    }

    /**
     * Insert a new Position Object in the DB
     * -------------------------------------------
     * @param {JSON} positionObject 
     * @returns No object
     */
    newPosition = async (positionObject) => {
        const querySQL = "INSERT INTO POSITIONS VALUES (?, ?, ?, ?, ?, ?, 0, 0)";
        const result = this.dao.run(
            querySQL,
            [
                positionObject.positionID,
                positionObject.aisleID,
                positionObject.row,
                positionObject.col,
                positionObject.maxWeight,
                positionObject.maxVolume
            ]
        ).catch((error) => {
            throw new Error(error.message);
        });

        return result;
    }

    /**
     * Update a Position object given its positionID
     * ---------------------------------------------
     * @param {String} positionID 
     * @param {JSON} positionObject 
     */
    updatePositionByPositionID = async (positionID, positionObject) => {
        const querySQL = "UPDATE POSITIONS SET positionID = ?, aisleID = ?, row = ?, col = ?, maxWeight = ?, maxVolume = ?, occupiedWeight = ?, occupiedVolume = ? WHERE positionID == ?";
        const result = this.dao.run(
            querySQL,
            [
                positionObject.newPositionID,
                positionObject.newAisleID,
                positionObject.newRow,
                positionObject.newCol,
                positionObject.newMaxWeight,
                positionObject.newMaxVolume,
                positionObject.newOccupiedWeight,
                positionObject.newOccupiedVolume,
                positionID
            ]
        ).catch((error) => {
            throw new Error(error.message);
        });

        return result;
    }


    /**
     * Update positionID of Position Object given its positionID
     * ----------------------------------------------------------
     * @param {String} positionID 
     * @param {String} newPositionID 
     */
    updatePositionID = async (positionID, newPositionID) => {
        const querySQL = "UPDATE POSITIONS SET positionID = ?, aisleID = ?, row = ?, col = ? WHERE positionID == ?";
        const result = this.dao.run(
            querySQL,
            [
                newPositionID,
                newPositionID.slice(0, 4),
                newPositionID.slice(4, 8),
                newPositionID.slice(8, 12),
                positionID
            ]
        ).catch((error) => {
            throw new Error(error.message);
        });

        return result;
    }


    /**
     * Remove a Position Object from DB given it positionID
     * ----------------------------------------------------
     * @param {String} positionID 
     */
    removePosition = async (positionID) => {
        const querySQL = "DELETE FROM POSITIONS WHERE POSITIONS.positionID == ?"
        const result = this.dao.run(
            querySQL,
            [
                positionID
            ]
        ).catch((error) => {
            throw new Error(error.message);
        });

        return result;
    }
}

module.exports = PositionDAO;