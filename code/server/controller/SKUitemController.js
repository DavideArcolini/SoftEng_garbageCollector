"use strict";

const ERROR_404 = "Not Found";


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
     * Return an array containing all SKU items.
     * -----------------------------------------
     *          API: GET /api/skuitems
     * =========================================
     */
    getSKUitems = async () => {

        /* QUERYING DATABASE */
        let result_SQL;
        try {
            const query_SQL = "SELECT * FROM SKUITEMS";
            result_SQL = await this.dao.all(query_SQL);
        } catch (error) {
            // console.log(error);
            throw new TypeError('Internal Server Error');
        }
        
        /* RETURNING RESULT */
        return {
            code: 200,
            message: result_SQL
        };
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

        const target_id = params.id;

        /* CHECK IF SKU EXISTS */
        try {
            const query_retrieveSKU_SQL = "SELECT * FROM SKUS WHERE SKUS.id == ?";
            let result_retrieveSKU_SQL = await this.dao.all(query_retrieveSKU_SQL, [target_id]);
            if (result_retrieveSKU_SQL.length === 0) {
                return {
                    code: 404,
                    message: ERROR_404
                };
            }
        } catch (error) {
            // console.log(error);
            throw new TypeError('Internal Server Error');
        }
        

        /* QUERYING DATABASE */
        let result_SQL;
        try {
            const query_SQL = "SELECT * FROM SKUITEMS WHERE SKUITEMS.SKUId == ? AND SKUITEMS.Available == 1";
            result_SQL = await this.dao.all(query_SQL, [target_id]);
        } catch (error) {
            // console.log(error);
            throw new TypeError('Internal Server Error');
        }
        
        /* RETURNING RESULT */
        return {
            code: 200,
            message: result_SQL
        };
    }
   

    /**
     * Return a SKU item, given its RFID.
     * --------------------------------------
     *     API: GET /api/skuitems/:rfid
     * ======================================
     * @param {request.params} params 
     */
    getSKUitemsByRFID = async (params) => {

        const target_rfid = params.rfid;

        /* QUERYING DATABASE */
        let result_SQL;
        try {
            const query_SQL = "SELECT * FROM SKUITEMS WHERE SKUITEMS.RFID == ?";
            result_SQL = await this.dao.all(query_SQL, [target_rfid]);
        } catch (error) {
            // console.log(error);
            throw new TypeError('Internal Server Error');
        }

        /* RETURNING RESULT */
        return (result_SQL.length === 0) ? {code: 404, message: ERROR_404} : {code: 200, message: result_SQL};
    }


    /**
     * Creates a new SKU item with Available = 0.
     * ---------------------------------------------------------
     *                 API: POST /api/skuitem
     * =========================================================
     * @param {request.body} body 
     */
    newSKUitem = async (body) => {

        /* CHECKING IF SKU ACTUALLY EXISTS */
        try {
            const query_retrieveSKU_SQL = "SELECT * FROM SKUS WHERE SKUS.id == ?";
            let result_retrieveSKU_SQL = await this.dao.all(query_retrieveSKU_SQL, [body.SKUId]);
            if (result_retrieveSKU_SQL.length === 0) {
                return {
                    code: 404,
                    message: ERROR_404
                };
            }
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }

        /* QUERYING DATABASE */
        try {
            const query_SQL = "INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
            await this.dao.run(query_SQL, [body.RFID, body.SKUId, ((body.DateOfStock === undefined) ? "" : body.DateOfStock)]);
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }
        
        /* RETURNING RESULT */
        return {
            code: 201,
            message: "CREATED"
        };
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

        const target_rfid = params.rfid;
        const data = body;

        /* QUERYING DATABASE */
        try {
            const query_SQL = "SELECT * FROM SKUITEMS WHERE SKUITEMS.RFID == ?";
            let result_SQL = await this.dao.all(query_SQL, [target_rfid]);
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
        

        /* IF EVERYTHING IS FINE, UPDATE THE NEW SKUItem */
        try {
            const update_SQL = "UPDATE SKUITEMS \
                                SET RFID = ?, Available = ?, DateOfStock = ? \
                                WHERE SKUITEMS.RFID==?";
            await this.dao.run(update_SQL, [data.newRFID, data.newAvailable, data.newDateOfStock, target_rfid]);
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }
        
        /* RETURN RESULT ON SUCCESS */
        return {
            code: 200,
            message: "OK"
        };
    }
    

    /**
     * Delete a SKU item receiving his rfid.
     * ------------------------------------------
     *      API: DELETE /api/skuitems/:rfid
     * ==========================================
     * @param {request.params} params 
     */
    deleteSKUitem = async (params) => {

        let target_rfid = params.rfid;

        /* QUERYING DATABASE */
        try {
            const query_SQL = "DELETE FROM SKUITEMS WHERE SKUITEMS.RFID == ?";
            await this.dao.run(query_SQL, [target_rfid]);
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }
        
        /* RETURNING RESULT ON SUCCESS */
        return {
            code: 204,
            message: "NO CONTENT"
        };
    }

}

module.exports = SKUitemController;