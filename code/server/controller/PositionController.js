"use strict";

/* --------- ERROR MESSAGES --------- */
const MESSG_200 = {code: 200, message: 'Ok'}
const MESSG_201 = {code: 201, message: 'Created'};
const MESSG_204 = {code: 204, message: 'No Content'};
const ERROR_404 = {code: 404, message: 'Not Found'};
const ERROR_422 = {code: 422, message: 'Unprocessable Entity'};

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
     * @param {Object} generalPurposeDAO 
     */
    constructor (positionDAO, skuDAO) {
        this.positionDAO    = positionDAO;
        this.skuDAO         = skuDAO;
    }


    /** 
     *          + ------------ +
     *          |   SERVICES   |
     *          + ------------ +
    */

    /**
     * Return an array containing all positions.
     * -----------------------------------------
     *         API: GET /api/positions 
     * =========================================
     */
    getPositions = async () => {

        try {
            /* access the DB through positionDAO */
            const positions = await this.positionDAO.getPositions();
            return {
                code: 200,
                message: positions
            };
        } catch (error) {
            throw error;
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
        
        const newPositionObject = body;

        /* access the DB through positionDAO object */
        try {
            await this.positionDAO.newPosition(newPositionObject);
            return MESSG_201;
        } catch (error) {
            throw error;
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

        const targetID = params.positionID;

        try {
            
            /* checking if position exists */
            const position = await this.positionDAO.getPositionByID(targetID);
            if (position === undefined) {
                return ERROR_404;
            }

            /* checking if position is associated to SKU */
            const sku = await this.skuDAO.getSKUByPositionID(targetID);
            if (sku !== undefined) {

                /* position IS associated to SKU --> check constraints */
                const weight = sku.weight;
                const volume = sku.volume;
                const availableQuantity = sku.availableQuantity;
                if ((weight * availableQuantity) > body.newMaxWeight || (volume * availableQuantity) > body.newMaxVolume) {
                    // console.log((weight * availableQuantity) > body.newMaxWeight);
                    // console.log((volume * availableQuantity) > body.newMaxVolume);

                    return ERROR_422;
                }
            }

            /* computing new positionID given the new parameters */
            const newPositionID = body.newAisleID + body.newRow + body.newCol;

            /* updating position by positionID */
            body.newPositionID = newPositionID;
            await this.positionDAO.updatePositionByPositionID(targetID, body);

            return MESSG_200;
            
        } catch (error) {
            throw error;
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

        const targetID = params.positionID;
        const newPositionID = body.newPositionID;

        try {

            /* checking if position exists */
            const position = await this.positionDAO.getPositionByID(targetID);
            if (position === undefined) {
                return ERROR_404;
            }

            /* updating corresponding position */
            await this.positionDAO.updatePositionID(targetID, newPositionID);

            /* fetch SKU with the old positionID in order to updated it */
            const sku = await this.skuDAO.getSKUByPositionID(targetID);
            if (sku !== undefined) {

                /* update SKU's positionID */
                await this.skuDAO.updateSKUpositionID(sku.id, newPositionID);
            }

            return MESSG_200;

        } catch (error) {
            throw error;   
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

        let targetID = params.positionID;

        try {
            
            /* removing Position from DB */
            await this.positionDAO.removePosition(targetID);

            /* update corresponding SKU */
            const sku = await this.skuDAO.getSKUByPositionID(targetID);
            if (sku !== undefined) {
                await this.skuDAO.updateSKUpositionID(sku.id, null);
            }

            return MESSG_204;

        } catch (error) {
            throw error;
        }
    }
}

module.exports = PositionController;