"use strict";

/* --------- ERROR MESSAGES --------- */
const ERROR_404 = {error: '404 Not Found'};
const ERROR_500 = {error: 'Internal Server Error'};
const ERROR_503 = {error: 'Service Unavailable'};

/**
 * CLASS:   POSITION
 * =================
 * METHOD: 
 *          - getPositions()    --> API: GET /api/positions 
 *          - newPositions()    --> API: POST /api/position
 *          - editPosition()    --> API: PUT /api/position/:positionID
 *          - editPositionID()  --> API: PUT /api/position/:positionID/changeID
 *          - deletePosition()  --> API: DELETE /api/position/:id
 */
class PositionController {

    /**
     * Constructor of the class
     * @param {DAO Object} input_dao 
     */
    constructor (input_dao) {
        this.dao = input_dao;
        this.dao.new;
    }


    /** 
     *          + ------- +
     *          |   API   |
     *          + ------- +
    */

    /**
     * Return an array containing all positions.
     * -----------------------------------------
     *         API: GET /api/positions 
     * =========================================
     * @param {callback} request 
     * @param {callback} response 
     */
    getPositions = async (request, response) => {

        /**
         *  QUERYING DATABASE
         *  -----------------
         *  Database fails --> return: ERROR_500 (generic error)
         *  Exception is raised (e.g. table POSITIONS does not exists) --> ERROR_500 (generic error)
         */
        try {
            const query_SQL = "SELECT * FROM POSITIONS";
            let result_SQL = await this.dao.all(query_SQL, (error, rows) => {
                if (error) {
                    return response.status(500).json(ERROR_500);
                } 
            });

            /* RETURNING RESULT */
            return response.status(200).json(result_SQL);
        } catch (error) {
            console.log(error);
            return response.status(500).json(ERROR_500);
        }
        
    }
   

    /**
     * Create a new Position object and store it in the database
     * ---------------------------------------------------------
     *                 API: POST /api/position
     * =========================================================
     * @param {callback} request 
     * @param {callback} response 
     */
    newPosition = async (request, response) => {
        
        const data = request.body;

        /**
         *  QUERYING DATABASE
         *  -----------------
         *  Database fails --> return: ERROR_503 (generic error)
         *  exception is raised (e.g. positionID already exists) --> ERROR_503 (generic error)
         */
        try {
            const query_SQL = "INSERT INTO POSITIONS (POSITIONID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES (?, ?, ?, ?, ?, ?, 0, 0)";
            
            await this.dao.run(query_SQL, [data.positionID, data.aisleID, data.row, data.col, data.maxWeight, data.maxVolume], (error) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });

            /* RETURNING RESULT */
            return response.status(201).json();
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
    }

    /**
     * Modify a position identified by positionID
     * ------------------------------------------
     *      API: PUT /api/position/:positionID
     * ==========================================
     * @param {callback} request 
     * @param {callback} response 
     */
    editPosition = async (request, response) => {

        const target_id = request.params.positionID;
        const data = request.body;

        /**
         *  QUERYING DATABASE
         *  -----------------
         *  database fails --> return: ERROR_503 (generic error)
         *  no item found --> return: ERROR_404 (not found)
         *  Exception is raised --> return: ERROR_503 (generic error)
         */
        try {
            const query_SQL = "SELECT * FROM POSITIONS WHERE POSITIONS.positionID == ?";
            let result_SQL = await this.dao.all(query_SQL, [target_id], (error, rows) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });
            if (result_SQL.length === 0) {
                return response.status(404).json(ERROR_404);
            }
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }

        /* -------------- CHECKING CONSTRAINTS IF POSITION IS ASSOCIATED TO SKU -------------- */
        const query_retrieveSKU_SQL = "SELECT * FROM SKUS WHERE SKUS.position == ?";
        const result_retrieveSKU_SQL = await this.dao.all(query_retrieveSKU_SQL, [target_id], (error) => {
            if (error) {
                return response.status(503).json(ERROR_503);
            }
        });
        if (result_retrieveSKU_SQL.length !== 0) {

            /* RETRIEVING VOLUME AND WEIGHT PARAMETERS */
            const weight = result_retrieveSKU_SQL[0].weight;
            const volume = result_retrieveSKU_SQL[0].volume;
            const availableQuantity = result_retrieveSKU_SQL[0].availableQuantity;

            if ((weight * availableQuantity) > data.newMaxWeight || (volume * availableQuantity) > data.newMaxVolume) {
                console.log("[DEBUG] some constraints are failed");
                return response.status(503).json(ERROR_503);
            }
        }
        
        /* COMPUTING NEW positionID GIVEN THE NEW PARAMETERS */
        const newPositionID = data.newAisleID + data.newRow + data.newCol;

        /**
         *  IF EVERYTHING IS FINE, UPDATE THE NEW POSITION  
         *  ----------------------------------------------
         *  Database fails --> return: ERROR_503 (generic error)
         *  Exception is raised --> return: ERROR_503 (generic error)
         */
        try {
            const update_SQL = "UPDATE POSITIONS \
                                SET positionID = ?, aisleID = ?, row = ?, col = ?, maxWeight = ?, maxVolume = ?, occupiedWeight = ?, occupiedVolume = ?  \
                                WHERE positionID==?";
            await this.dao.run(update_SQL, [newPositionID, data.newAisleID, data.newRow, data.newCol, data.newMaxWeight, data.newMaxVolume, data.newOccupiedWeight, data.newOccupiedVolume, target_id], (error) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });

            /* RETURN RESULT */
            return response.status(200).json();
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
    }


    /**
     * Modify the positionID of a position position, given its old positionID.
     * -----------------------------------------------------------------------
     *           API: PUT /api/position/:positionID/changeID
     * =======================================================================
     * @param {callback} request 
     * @param {callback} response 
     */
    editPositionID = async (request, response) => {

        const target_id = request.params.positionID;
        const newPositionID = request.body.newPositionID;

        /**
         *  QUERYING DATABASE
         *  -----------------
         *  database fails --> return: ERROR_503 (generic error)
         *  no item found --> return: ERROR_404 (not found)
         *  Exception is raised --> return: ERROR_503 (generic error)
         */
        try {
            const query_SQL = "SELECT * FROM POSITIONS WHERE POSITIONS.positionID == ?";
            let result_SQL = await this.dao.all(query_SQL, [target_id], (error, rows) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });
            if (result_SQL.length === 0) {
                return response.status(404).json(ERROR_404);
            }
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
        

        /* COMPUTING NEW aisleID, row and col GIVEN THE NEW positionID */
        const newAisleID = newPositionID.slice(0, 4);
        const newRow = newPositionID.slice(4, 8);
        const newCol = newPositionID.slice(8, 12);


        /* IF EVERYTHING IS FINE, UPDATE THE NEW positionID */
        try {
            const update_SQL = "UPDATE POSITIONS \
                                SET positionID = ?, aisleID = ?, row = ?, col = ? \
                                WHERE positionID==?";
            await this.dao.run(update_SQL, [newPositionID, newAisleID, newRow, newCol, target_id], (error) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });
            
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }

        /* FETCH SKU WITH THE OLD POSITION AND UPDATE */
        try {
            const query_retrieveSKU_SQL = "SELECT * FROM SKUS WHERE SKUS.position == ?";
            let result_retrieveSKU_SQL = await this.dao.all(query_retrieveSKU_SQL, [target_id], (error, rows) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });

            /* UPDATE POSITION IF THERE ACTUALLY IS A SKU ASSOCIATED WITH THE POSITION */
            if (result_retrieveSKU_SQL.length !== 0) {
                const query_updateSKU_SQL = "UPDATE SKUS    \
                                             SET position = ?  \
                                             WHERE position == ?";
                await this.dao.run(query_updateSKU_SQL, [newPositionID, target_id], (error) => {
                    if (error) {
                        return response.status(503).json(ERROR_503);
                    }
                });
            }
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }

        /* RETURNING RESULT ON SUCCESS */
        return response.status(200).json();
    }


    /**
     * Delete a position given its identifier ID
     * ------------------------------------------
     *      API: DELETE /api/position/:id
     * ==========================================
     * @param {callback} request 
     * @param {callback} response 
     */
    deletePosition = async (request, response) => {

        let target_id = request.params.positionID;

        /**
         *  QUERYING DATABASE
         *  -----------------
         *  database fails --> return: ERROR_503 (generic error)
         *  Exception is raised --> return: ERROR_503 (generic error)
         */
        try {

            /* REMOVING POSITION */
            const query_SQL = "DELETE FROM POSITIONS WHERE POSITIONS.positionID == ?";
            await this.dao.run(query_SQL, [target_id], (error) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });   

            /* UPDATING SKU */
            const query_updateSKU_SQL = "UPDATE SKUS SET position = ? WHERE position == ?";
            await this.dao.run(query_updateSKU_SQL, [null, target_id], (error) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });

            /* RETURNING */
            return response.status(204).json();
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
    }
}

module.exports = PositionController;