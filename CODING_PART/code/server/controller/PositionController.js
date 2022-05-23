"use strict";

/* --------- ERROR MESSAGES --------- */
const ERROR_404 = 'Not Found';
const ERROR_422 = 'Unprocessable Entity';
const ERROR_500 = 'Internal Server Error';
const ERROR_503 = 'Service Unavailable';

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
     */
    getPositions = async () => {

        /**
         *  QUERYING DATABASE
         *  -----------------
         *  Database fails --> return: ERROR_500 (generic error)
         *  Exception is raised (e.g. table POSITIONS does not exists) --> ERROR_500 (generic error)
         */
        try {
            const query_SQL = "SELECT * FROM POSITIONS";
            let result_SQL = await this.dao.all(query_SQL);

            /* RETURNING RESULT */
            return result_SQL;
        } catch (error) {
            // console.log(error);
            throw new TypeError('Internal Server Error');
        }
        
    }
   

    /**
     * Create a new Position object and store it in the database
     * ---------------------------------------------------------
     *                 API: POST /api/position
     * =========================================================
     * @param {request.body} body
     */
    newPosition = async (body) => {

        /**
         *  QUERYING DATABASE
         *  -----------------
         *  Database fails --> return: ERROR_503 (generic error)
         *  exception is raised (e.g. positionID already exists) --> ERROR_503 (generic error)
         */
        try {
            const query_SQL = "INSERT INTO POSITIONS (POSITIONID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES (?, ?, ?, ?, ?, ?, 0, 0)";
            await this.dao.run(query_SQL, [body.positionID, body.aisleID, body.row, body.col, body.maxWeight, body.maxVolume]);

            /* RETURNING RESULT */
            return {
                code: 201,
                message: "CREATED"
            };
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }
    }

    /**
     * Modify a position identified by positionID
     * ------------------------------------------
     *      API: PUT /api/position/:positionID
     * ==========================================
     * @param {request.params} params
     * @param {request.body} body 
     */
    editPosition = async (params, body) => {

        const target_id = params.positionID;

        /**
         *  QUERYING DATABASE
         *  -----------------
         *  database fails --> return: ERROR_503 (generic error)
         *  no item found --> return: ERROR_404 (not found)
         *  Exception is raised --> return: ERROR_503 (generic error)
         */
        try {
            const query_SQL = "SELECT * FROM POSITIONS WHERE POSITIONS.positionID == ?";
            let result_SQL = await this.dao.all(query_SQL, [target_id]);
            if (result_SQL.length === 0) {
                return {
                    code: 404,
                    message: ERROR_404
                };
            }
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }

        /* -------------- CHECKING CONSTRAINTS IF POSITION IS ASSOCIATED TO SKU -------------- */
        const query_retrieveSKU_SQL = "SELECT * FROM SKUS WHERE SKUS.position == ?";
        let result_retrieveSKU_SQL
        try {
            result_retrieveSKU_SQL = await this.dao.all(query_retrieveSKU_SQL, [target_id]);   
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }
        if (result_retrieveSKU_SQL.length !== 0) {

            /* RETRIEVING VOLUME AND WEIGHT PARAMETERS */
            const weight = result_retrieveSKU_SQL[0].weight;
            const volume = result_retrieveSKU_SQL[0].volume;
            const availableQuantity = result_retrieveSKU_SQL[0].availableQuantity;

            if ((weight * availableQuantity) > body.newMaxWeight || (volume * availableQuantity) > body.newMaxVolume) {
                return {
                    code: 422,
                    message: ERROR_422
                }
            }
        }
        
        /* COMPUTING NEW positionID GIVEN THE NEW PARAMETERS */
        const newPositionID = body.newAisleID + body.newRow + body.newCol;

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
            await this.dao.run(update_SQL, [newPositionID, body.newAisleID, body.newRow, body.newCol, body.newMaxWeight, body.newMaxVolume, body.newOccupiedWeight, body.newOccupiedVolume, target_id]);
            
            /* RETURN RESULT */
            return {
                code: 200,
                message: "OK"
            }
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }
    }


    /**
     * Modify the positionID of a position position, given its old positionID.
     * -----------------------------------------------------------------------
     *           API: PUT /api/position/:positionID/changeID
     * =======================================================================
     * @param {request.params} params
     * @param {request.body} body
     */
    editPositionID = async (params, body) => {

        const target_id = params.positionID;
        const newPositionID = body.newPositionID;

        /**
         *  QUERYING DATABASE
         *  -----------------
         *  database fails --> return: ERROR_503 (generic error)
         *  no item found --> return: ERROR_404 (not found)
         *  Exception is raised --> return: ERROR_503 (generic error)
         */
        try {
            const query_SQL = "SELECT * FROM POSITIONS WHERE POSITIONS.positionID == ?";
            let result_SQL = await this.dao.all(query_SQL, [target_id]);
            if (result_SQL.length === 0) {
                return {
                    code: 404,
                    message: ERROR_404
                }
            }
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
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
            await this.dao.run(update_SQL, [newPositionID, newAisleID, newRow, newCol, target_id]);
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }

        /* FETCH SKU WITH THE OLD POSITION AND UPDATE */
        try {
            const query_retrieveSKU_SQL = "SELECT * FROM SKUS WHERE SKUS.position == ?";
            let result_retrieveSKU_SQL = await this.dao.all(query_retrieveSKU_SQL, [target_id]);

            /* UPDATE POSITION IF THERE ACTUALLY IS A SKU ASSOCIATED WITH THE POSITION */
            if (result_retrieveSKU_SQL.length !== 0) {
                const query_updateSKU_SQL = "UPDATE SKUS    \
                                             SET position = ?  \
                                             WHERE position == ?";
                await this.dao.run(query_updateSKU_SQL, [newPositionID, target_id]);
            }
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }

        /* RETURNING RESULT ON SUCCESS */
        return {
            code: 200,
            message: "OK"
        }
    }


    /**
     * Delete a position given its identifier ID
     * ------------------------------------------
     *      DELETE /api/position/:positionID
     * ==========================================
     * @param {request.params} params 
     */
    deletePosition = async (params) => {

        let target_id = params.positionID;

        /**
         *  QUERYING DATABASE
         *  -----------------
         *  database fails --> return: ERROR_503 (generic error)
         *  Exception is raised --> return: ERROR_503 (generic error)
         */
        try {

            /* REMOVING POSITION */
            const query_SQL = "DELETE FROM POSITIONS WHERE POSITIONS.positionID == ?";
            await this.dao.run(query_SQL, [target_id]);   

            /* UPDATING SKU */
            const query_updateSKU_SQL = "UPDATE SKUS SET position = ? WHERE position == ?";
            await this.dao.run(query_updateSKU_SQL, [null, target_id]);

        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }

        /* RETURNING */
        return {
            code: 204,
            message: "NO CONTENT"
        }
    }
}

module.exports = PositionController;