"use strict";

/* --------- IMPORT MODULES --------- */
const SKUitemDAO    = require("../db/skuItemDAO");
const SKUDAO        = require("../db/skuDAO");

/* --------- ERROR MESSAGES --------- */
const MESSG_200 = {code: 200, message: 'Ok'}
const MESSG_201 = {code: 201, message: 'Created'};
const MESSG_204 = {code: 204, message: 'No Content'};
const ERROR_404 = {code: 404, message: 'Not Found'};



/**
 * CLASS:   SKUITEMS
 * =================
 * METHOD: 
 *          - getSKUitems()         --> API: GET /api/skuitems 
 *          - getSKUitemsBySKUId()  --> API: GET /api/skuitems/sku/:id
 *          - getSKUitemsByRFID()   --> API: GET /api/skuitems/:rfid
 *          - newSKUitem()          --> API: POST /api/skuitem
 *          - editSKUitem()         --> API: PUT /api/skuitems/:rfid
 *          - deleteSKUitem()       --> API: DELETE /api/skuitems/:rfid
 */
class SKUitemController {

    /**
     * Constructor of the class
     * @param {DAO Object} generalPurposeDAO 
     */
    constructor (skuItemDAO, skuDAO) {
        this.skuItemDAO = skuItemDAO;
        this.skuDAO     = skuDAO;
    }

    /** 
     *          + ------------ +
     *          |   SERVICES   |
     *          + ------------ +
    */

    /**
     * Return an array containing all SKU items.
     * -----------------------------------------
     *          API: GET /api/skuitems
     * =========================================
     */
    getSKUitems = async () => {

        /* retrieve SKUitems from DB */
        try {
            const skuitems = await this.skuItemDAO.getSKUitems();
            return {
                code: 200,
                message: skuitems
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Return an array containing all SKU items for a certain SKUId 
     * with Available = 1.
     * --------------------------------------------------------------
     *               API: GET /api/skuitems/sku/:id
     * ==============================================================
     * @param {request.params} params
     */
    getSKUitemsBySKUId = async (params) => {

        const targetID = params.id;

        try {
            /* check if SKUid exists in DB */
            const sku = await this.skuDAO.getSKUByID(targetID);
            if (sku === undefined) {
                return ERROR_404;
            }

            /* retrieving skuitems from DB */
            const skuitems = await this.skuItemDAO.getSKUitemsBySKUid(targetID);
            return {
                code: 200,
                message: skuitems
            };
        } catch (error) {
            throw error;
        }
    }
   

    /**
     * Return a SKU item, given its RFID.
     * --------------------------------------
     *     API: GET /api/skuitems/:rfid
     * ======================================
     * @param {request.params} params 
     */
    getSKUitemsByRFID = async (params) => {

        const targetRFID = params.rfid;

        try {
            /* retrieve skuitem from DB */
            const skuitem = await this.skuItemDAO.getSKUitemByRFID(targetRFID);
            return (skuitem === undefined) ? ERROR_404 : {code: 200, message: skuitem};
        } catch (error) {
            throw error;
        }
    }


    /**
     * Creates a new SKU item with Available = 0.
     * ---------------------------------------------------------
     *                 API: POST /api/skuitem
     * =========================================================
     * @param {request.body} body 
     */
    newSKUitem = async (body) => {

        try {
            /* checking if SKUid actually exists */
            const sku = await this.skuDAO.getSKUByID(body.SKUId);
            if (sku === undefined) {
                return ERROR_404;
            }

            /* creating new skuitem in the DB */
            await this.skuItemDAO.newSkuItem(body);
            return MESSG_201;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Modify RFID, available and date of stock fields of an existing SKU Item.
     * ------------------------------------------------------------------------
     *                    API: PUT /api/skuitems/:rfid
     * ========================================================================
     * @param {request.params} params 
     * @param {request.body} body
     */
    editSKUitem = async (params, body) => {

        const targetRFID = params.rfid;
        const data = body;

        try {
            /* check if SKUitem exists */
            const skuitem = await this.skuItemDAO.getSKUitemByRFID(targetRFID);
            if (skuitem === undefined) {
                return ERROR_404;
            }

            /* update SKUitem */
            await this.skuItemDAO.updateSKUitem(targetRFID, data);
            return MESSG_200;
        } catch (error) {
            throw error;
        }
    }
    

    /**
     * Delete a SKU item receiving his rfid.
     * ------------------------------------------
     *      API: DELETE /api/skuitems/:rfid
     * ==========================================
     * @param {request.params} params 
     */
    deleteSKUitem = async (params) => {

        let targetRFID = params.rfid;

        try {
            /* accessing DB through DAO */
            await this.skuItemDAO.deleteSKUitem(targetRFID);
            return MESSG_204;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = SKUitemController;