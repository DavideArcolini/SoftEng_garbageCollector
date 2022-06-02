"use strict";

/* --------- IMPORT MODULES --------- */
const SKUDAO                = require("../db/skuDAO");
const TestDescriptorsDAO    = require("../db/testDescriptorsDAO");
const PositionDAO           = require("../db/positionDAO");
const SKUitemDAO            = require("../db/skuItemDAO");

/* --------- ERROR MESSAGES --------- */
const ERROR_422 = {code: 422, message: 'Unprocessable Entity'};
const MESSG_200 = {code: 200, message: 'Ok'}
const MESSG_201 = {code: 201, message: 'Created'};
const MESSG_204 = {code: 204, message: 'No Content'};
const ERROR_404 = {code: 404, message: 'Not Found'};

/**
 * CLASS:   SKU
 * =================
 * METHOD: 
 *          - getStoredSKUs()        --> API: GET /api/skus
 *          - getStoredSKUById()     --> API: GET /api/skus/:id
 *          - newSKU()               --> API: POST /api/sku
 *          - editSKU()              --> API: PUT /api/sku/:id
 *          - addOrEditPositionSKU() --> API: PUT /api/sku/:id/position
 *          - deleteSKU()            --> API: DELETE /api/skus/:id
 */
class SKUController {

    /**
     * Constructor of the class
     * @param {DAO Object} generalPurposeDAO 
     */
    constructor (generalPurposeDAO) {
        this.skuDAO             = new SKUDAO(generalPurposeDAO);
        this.testDescriptorsDAO = new TestDescriptorsDAO(generalPurposeDAO);
        this.positionDAO        = new PositionDAO(generalPurposeDAO);
        this.skuItemDAO         = new SKUitemDAO(generalPurposeDAO);
    }

    /** 
     *          + ------------ +
     *          |   SERVICES   |
     *          + ------------ +
    */

    /**
     * Get all the SKUs in the database.
     * ---------------------------------
     *        API: GET /api/skus
     * =================================
     */
    getStoredSKUs = async () => {

        try {
            /* retrieve SKUs from DB */
            const skus = await this.skuDAO.getSKUs();

            /* add TestDescriptors to SKUs */
            for (let s of skus) {
                s.testDescriptors = await this.testDescriptorsDAO.getTDIDbySKUid(s.id);
            }
            return {
                code: 200,
                message: skus
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * Retrieve an SKU given its identifier ID
     * ------------------------------------------
     *          API: GET /api/skus/:id
     * ==========================================
     * @param {request.params} params
     */
    getStoredSKUById = async (params) => {

        let targetID = params.id;

        try {
            /* retrieving SKU given id from DB */
            const sku = await this.skuDAO.getSKUByID(targetID);
            if (sku === undefined) {
                return ERROR_404;
            }

            /* add TestDescriptors to SKU */
            sku.testDescriptors = await this.testDescriptorsDAO.getTDIDbySKUid(targetID);

            return {
                code: 200,
                message: sku
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Create a new SKU object and store it in
     * the database.
     * ------------------------------------------
     *            API: POST /api/sku
     * ==========================================
     * @param {request.body} body
     */
    newSKU = async (body) => {

        try {
            /* creating new SKU */
            await this.skuDAO.newSKU(body);
            return MESSG_201;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Modify an existing SKU. When a newAvailableQuantity is sent, occupiedWeight and 
     * occupiedVolume fields of the position (if the SKU is associated to a position) are 
     * modified according to the new available quantity.
     * ------------------------------------------------------------------------------------
     *                              API: PUT /api/sku/:id
     * ====================================================================================
     * @param {request.params} params 
     * @param {request.body} body 
     */
    editSKU = async (params, body) => {

        const targetID = params.id;
        const data = body;

        try {
            /* checking if SKU exists */
            const sku = await this.skuDAO.getSKUByID(targetID);
            if (sku === undefined) {
                return ERROR_404;
            }

            /* check if SKU has associated position */
            if (sku.position !== null) {

                /* check if position actually exists in DB (should exists, if not: some errors happened before, thrown an error) */
                const position = await this.positionDAO.getPositionByID(sku.position);
                if (position === undefined) {
                    throw new Error('Service Unavailable');
                }

                /* check constraints about maxVolume and maxWeight of that position */
                if ((data.newWeight * data.newAvailableQuantity) > position.maxWeight || (data.newVolume * data.newAvailableQuantity) > position.maxVolume) {
                    return ERROR_422;
                }

                /* update Position in DB */
                await this.positionDAO.updatePositionQuantity(sku.position, (data.newWeight * data.newAvailableQuantity), (data.newVolume * data.newAvailableQuantity));
            }

            /* update SKU in DB */
            await this.skuDAO.updateSKU(targetID, data);

            return MESSG_200;
        } catch (error) {
            throw error;
        }
    }


    /**
     * Add or modify position of a SKU. When a SKU is associated to a position, 
     * occupiedWeight and occupiedVolume fields of the position are modified according to 
     * the available quantity.
     * ------------------------------------------------------------------------------------
     *                          API: PUT /api/sku/:id/position
     * ====================================================================================
     * @param {request.params} params 
     * @param {request.body} body 
     */
    addOrEditPositionSKU = async (params, body) => {

        const targetID = params.id;
        const positionID = body.position;

        var needToEdit = false;
        var oldPositionID = null;


        try {
            /* check if position has already been assigned to another SKU */
            const check = await this.skuDAO.getSKUByPositionID(positionID);
            if (check !== undefined) {
                return ERROR_422;
            }

            /* retrieve SKU from DB */
            const sku = await this.skuDAO.getSKUByID(targetID);
            if (sku === undefined) {
                return ERROR_404;
            } else if (sku.position !== null) {

                /* SKU has already a position */
                needToEdit = true;
                oldPositionID = sku.position;
            }

            /* retrieving position from DB */
            const position = await this.positionDAO.getPositionByID(positionID);
            if (position === undefined) {
                return ERROR_404;
            }

            /* check constraints on maxWeight and maxVolume */
            const newOccupiedWeight = position.occupiedWeight + (sku.weight * sku.availableQuantity);
            const newOccupiedVolume = position.occupiedVolume + (sku.volume * sku.availableQuantity)
            if (newOccupiedWeight > position.maxWeight || newOccupiedVolume > position.maxVolume) {
                return ERROR_422;
            }

            /* update SKU new position */
            await this.skuDAO.updateSKUpositionID(targetID, positionID);

            /* update Position quantity */
            await this.positionDAO.updatePositionQuantity(positionID, newOccupiedWeight, newOccupiedVolume);

            /* update old Position quantity */
            if (needToEdit) {
                await this.positionDAO.updatePositionQuantity(oldPositionID, 0, 0);
            }

            return MESSG_200;
            
        } catch (error) {
            throw error;
        }
    }

    /**
     * Delete an SKU given its identifier ID
     * ------------------------------------------
     *        API: DELETE /api/skus/:id
     * ==========================================
     * @param {request.params} params
     */
    deleteSKU = async (params) => {

        let targetID = params.id;

        try {
            /* check if SKU is associated to SKUitems */
            const skuitems = await this.skuItemDAO.getSKUitemsBySKUid(targetID);
            if (skuitems.length != 0) {
                return ERROR_422;
            }

            /* check if SKU is associated to TestDescriptors */
            const testDescriptors = await this.testDescriptorsDAO.getTDIDbySKUid(targetID);
            if (testDescriptors.length != 0) {
                return ERROR_422;
            }

            /* retrieving SKU from DB (update position) */
            const sku = await this.skuDAO.getSKUByID(targetID);
            if (sku !== undefined && sku.position !== null) {
                await this.positionDAO.updatePositionQuantity(sku.position, 0, 0);
            }

            /* removing SKU */
            await this.skuDAO.deleteSKU(targetID);

            return MESSG_204;

        } catch (error) {
            throw error;
        }
    }

}

module.exports = SKUController;