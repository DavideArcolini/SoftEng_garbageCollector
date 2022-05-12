"use strict";

/* SOME ERROR MESSAGES HERE */
const ERROR_400 = {error: 'Bad request'};
const ERROR_404 = {error: '404 Not Found'};
const ERROR_422 = {error: 'Unprocessable Entity'};
const ERROR_500 = {error: 'Internal Server Error'};
const ERROR_503 = {error: 'Service Unavailable'};

class SKUitemController {

    /**
     * Constructor of the class
     * @param {DAO Object} input_dao 
     */
    constructor (input_dao) {
        this.dao = input_dao;
        this.dao.new;
    }




    /* API */

    /**
     * Return an array containing all SKU items.
     * -----------------------------------------
     *          API: GET /api/skuitems
     * =========================================
     * @param {callback} request 
     * @param {callback} resolve 
     */
    getSKUitems = async (request, resolve) => {
        
        /* CHECKING INPUT */
        if (Object.keys(request.body).length !== 0) {       /* BODY SHOULD BE EMPTY */
            return resolve.status(400).json(ERROR_400);
        }

        /* QUERYING DATABASE */
        const query_SQL = "SELECT * FROM SKUITEMS";
        let result_SQL = await this.dao.all(query_SQL, (error, rows) => {
            if (error) {
                return resolve.status(500).json(ERROR_500);
            } 
        });

        /* RETURNING RESULT */
        return resolve.status(200).json(result_SQL);
    }

    /**
     * Return an array containing all SKU items for a certain SKUId 
     * with Available = 1.
     * --------------------------------------------------------------
     *               API: GET /api/skuitems/sku/:id
     * ==============================================================
     * @param {callback} request 
     * @param {callback} resolve 
     */
    getSKUitemsBySKUId = async (request, resolve) => {

        const target_id = request.params.id;
        
        /* CHECKING INPUT */
        if (Object.keys(request.body).length !== 0) {       /* BODY SHOULD BE EMPTY */
            return resolve.status(400).json(ERROR_400);
        } else if (/^[0-9]+$/.test(target_id) === false) {  /* HEADER PARAMETER SHOULD BE A NUMBER */
            return resolve.status(400).json(ERROR_400);
        }

        /* CHECK IF SKU EXISTS */
        const query_retrieveSKU_SQL = "SELECT * FROM SKUS WHERE SKUS.id == ?";
        let result_retrieveSKU_SQL = await this.dao.all(query_retrieveSKU_SQL, [target_id], (error) => {
            if (error) {
                return resolve.status(500).json(ERROR_500);
            }
        });
        if (result_retrieveSKU_SQL.length == 0) {
            return resolve.status(404).json(ERROR_404);
        }

        /* QUERYING DATABASE */
        const query_SQL = "SELECT * FROM SKUITEMS WHERE SKUITEMS.SKUId == ? AND SKUITEMS.Available == 1";
        let result_SQL = await this.dao.all(query_SQL, [target_id], (error, rows) => {
            if (error) {
                return resolve.status(500).json(ERROR_500);
            } 
        });

        /* RETURNING RESULT */
        return resolve.status(200).json(result_SQL);
    }
   

    /**
     * Return a SKU item, given its RFID.
     * --------------------------------------
     *     API: GET /api/skuitems/:rfid
     * ======================================
     * @param {callback} request 
     * @param {callback} resolve 
     */
    getSKUitemsByRFID = async (request, resolve) => {

        const target_rfid = request.params.rfid;
        
        /* CHECKING INPUT */
        if (Object.keys(request.body).length !== 0) {       /* BODY SHOULD BE EMPTY */
            return resolve.status(422).json(ERROR_422);
        } else if (/^[0-9]+$/.test(target_rfid) === false || target_rfid.length !== 32) {  /* HEADER PARAMETER SHOULD BE A 32 DIGITS STRING */
            return resolve.status(422).json(ERROR_422);
        }

        /* QUERYING DATABASE */
        const query_SQL = "SELECT * FROM SKUITEMS WHERE SKUITEMS.RFID == ?";
        let result_SQL = await this.dao.all(query_SQL, [target_rfid], (error, rows) => {
            if (error) {
                return resolve.status(500).json(ERROR_500);
            } 
        });

        /* RETURNING RESULT */
        return (result_SQL.length === 0) ? resolve.status(404).json(ERROR_404) : resolve.status(200).json(result_SQL);
    }


    /**
     * Creates a new SKU item with Available = 0.
     * ---------------------------------------------------------
     *                 API: POST /api/skuitem
     * =========================================================
     * @param {callback} request 
     * @param {callback} resolve 
     */
    newSKUitem = async (request, resolve) => {
        
        const data = request.body;

        /* CHECKING USER INPUT */
        if (Object.keys(request.body).length === 0) {

            /* BODY NOT EMPTY CONSTRAINT */
            return resolve.status(422).json(ERROR_422);
        } else if (data.RFID === undefined || data.SKUId === undefined) {

            /* DATA DEFINED INSIDE THE BODY CONSTRAINT */
            return resolve.status(422).json(ERROR_422);
        } else if (data.RFID.length !== 32) {

            /* PARAMETER LENGTH CONSTRAINT */
            return resolve.status(422).json(ERROR_422);
        } else if (data.newDateOfStock !== undefined && /^\d{4}\/\d{2}\/\d{2}$/.test(data.newDateOfStock) !== true &&  /^\d{4}\/\d{2}\/\d{2} \d{2}\:\d{2}$/.test(data.newDateOfStock) !== true) {

            /* PARAMETER DOMAIN CONSTRAINT */
            return resolve.status(422).json(ERROR_422);
        }

        /* CHECKING IF SKU ACTUALLY EXISTS */
        const query_retrieveSKU_SQL = "SELECT * FROM SKUS WHERE SKUS.id == ?";
        let result_retrieveSKU_SQL = await this.dao.all(query_retrieveSKU_SQL, [data.SKUId], (error) => {
            if (error) {
                return resolve.status(503).json(ERROR_503);
            }
        });
        if (result_retrieveSKU_SQL.length === 0) {
            console.log("[DEBUG] SKU.id does not exist in database");
            return resolve.status(404).json(ERROR_404);
        }

        /* CHECKING IF RFID ALREADY PRESENT IN THE DATABASE???? */

        /* QUERYING DATABASE */
        const query_SQL = "INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
        await this.dao.run(query_SQL, [data.RFID, data.SKUId, ((data.DateOfStock === undefined) ? "" : data.DateOfStock)], (error) => {
            if (error) {
                return resolve.status(503).json(ERROR_503);
            }
        });

        /* RETURNING RESULT */
        return resolve.status(201).json();
    }

    /**
     * Modify RFID, available and date of stock fields of an existing SKU Item.
     * ------------------------------------------------------------------------
     *                    API: PUT /api/skuitems/:rfid
     * ========================================================================
     * @param {callback} request 
     * @param {callback} resolve 
     */
    editSKUitem = async (request, resolve) => {

        const target_rfid = request.params.rfid;
        const data = request.body;

        /* CHECKING USER INPUT */        
        if (/^[0-9]+$/.test(target_rfid) === false || target_rfid.length !== 32) {         /* HEADER PARAMETER SHOULD BE A 32 DIGITS STRING */
            return resolve.status(422).json(ERROR_422);
        } else if (data.length === 0) {                                                 /* BODY SHOULD NOT BE EMPTY */
            return resolve.status(422).json(ERROR_422);
        } else if (data.newRFID === undefined || data.newAvailable === undefined || data.newDateOfStock === undefined) {
            return resolve.status(422).json(ERROR_422);    
        } else if (data.newDateOfStock !== undefined && /^\d{4}\/\d{2}\/\d{2}$/.test(data.newDateOfStock) !== true &&  /^\d{4}\/\d{2}\/\d{2} \d{2}\:\d{2}$/.test(data.newDateOfStock) !== true) {

            /* CHECKING DateOfSTOCK FORMAT */
            return resolve.status(422).json(ERROR_422);
        } else if (data.newAvailable !== 1 && data.newAvailable !== 0) {

            /* CHECKING Available FORMAT */
            return resolve.status(422).json(ERROR_422);
        }


        /* QUERYING DATABASE */
        const query_SQL = "SELECT * FROM SKUITEMS WHERE SKUITEMS.RFID == ?";
        let result_SQL = await this.dao.all(query_SQL, [target_rfid], (error, rows) => {
            if (error) {
                return resolve.status(503).json(ERROR_503);
            }
        });
        if (result_SQL.length === 0) {
            return resolve.status(404).json(ERROR_404);
        }

        /* IF EVERYTHING IS FINE, UPDATE THE NEW SKUItem */
        const update_SQL = "UPDATE SKUITEMS \
                            SET RFID = ?, Available = ?, DateOfStock = ? \
                            WHERE SKUITEMS.RFID==?";
        await this.dao.run(update_SQL, [data.newRFID, data.newAvailable, data.newDateOfStock, target_rfid], (error) => {
            if (error) {
                return resolve.status(500).json(ERROR_500);
            }
        })

        return resolve.status(200).json();
    }
    

    /**
     * Delete a SKU item receiving his rfid.
     * ------------------------------------------
     *      API: DELETE /api/skuitems/:rfid
     * ==========================================
     * @param {callback} request 
     * @param {callback} resolve 
     */
    deleteSKUitem = async (request, resolve) => {

        let target_rfid = request.params.rfid;

        /* CHECK INPUT */
        if (Object.keys(request.body).length !== 0) {           /* BODY SHOULD BE EMPTY */
            return resolve.status(422).json(ERROR_422);
        } else if (/^[0-9]+$/.test(target_rfid) === false || target_rfid.length !== 32) {      /* HEADER PARAMETER SHOULD BE A NUMBER */
            return resolve.status(422).json(ERROR_422);
        }

        /* QUERYING DATABASE */
        const query_SQL = "DELETE FROM SKUITEMS WHERE SKUITEMS.RFID == ?";
        await this.dao.run(query_SQL, [target_rfid], (error) => {
            if (error) {
                return resolve.status(503).json(ERROR_503);
            }
        });

        /* RETURNING */
        return resolve.status(204).json();
    }

}

module.exports = SKUitemController;