"use strict";

/* SOME ERROR MESSAGES HERE */
const ERROR_400 = 'Bad request';
const ERROR_404 = 'Not Found';
const ERROR_422 = 'Unprocessable Entity';
const ERROR_500 = 'Internal Server Error';
const ERROR_503 = 'Service Unavailable';


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
     * @param {DAO Object} input_dao 
     */
    constructor (input_dao) {
        this.dao = input_dao;
        this.dao.new;
    }

    /**
     * 
     * @param {DAO} dao 
     * @param {integer} idSKU 
     * @returns an array containing the ids of the Test Descriptors associated to the idSKU passed as parameters
     */
    retrieveTestDescriptor = async (dao, idSKU) => {
        const query_RetrieveTestDescriptor_SQL = "SELECT TD.id FROM TEST_DESCRIPTORS TD WHERE TD.idSKU == ?";
        let result_RetrieveTestDescriptor_SQL;
        try {
            result_RetrieveTestDescriptor_SQL = await dao.all(query_RetrieveTestDescriptor_SQL, [idSKU]);
        } catch (error) {
            throw new TypeError('retrieveTestDescriptor failed')
        }

        var result = [];
        result_RetrieveTestDescriptor_SQL.map((element) => {
            result.push(element.id);
        })
        return result;
    }

    /** 
     *          + ------- +
     *          |   API   |
     *          + ------- +
    */

    /**
     * Get all the SKUs in the database.
     * ---------------------------------
     *        API: GET /api/skus
     * =================================
     */
    getStoredSKUs = async () => {

        /* QUERYING SKU DATABASE */
        const query_RetrieveSKU_SQL = "SELECT * FROM SKUS";
        let result_RetrieveSKU_SQL;
        try {
            result_RetrieveSKU_SQL = await this.dao.all(query_RetrieveSKU_SQL);
        } catch (error) {
            // console.log(error);
            throw new TypeError('Internal Server Error');
        }

        /* QUERYING TEST DESCRIPTOR DATABASE */
        for (let item of result_RetrieveSKU_SQL) {
            try {
                item.testDescriptors = await this.retrieveTestDescriptor(this.dao, item.id);
            } catch (error) {
                throw error;
            }
        }

        /* RETURNING RESULT */
        return {
            code: 200,
            message: result_RetrieveSKU_SQL
        };
    }

    /**
     * Retrieve an SKU given its identifier ID
     * ------------------------------------------
     *          API: GET /api/skus/:id
     * ==========================================
     * @param {request.params} params
     */
    getStoredSKUById = async (params) => {

        let target_id = params.id;

        /* QUERYING SKU DATABASE */
        const query_RetrieveSKU_SQL = "SELECT * FROM SKUS WHERE SKUS.id == ?";
        let result_RetrieveSKU_SQL;
        try {
            result_RetrieveSKU_SQL = await this.dao.all(query_RetrieveSKU_SQL, [target_id]);
        } catch (error) {
            // console.log(error);
            throw new TypeError('Internal Server Error');
        }

        /* CHECKING RESULT */
        if (result_RetrieveSKU_SQL.length === 0) {
            return {
                code: 404,
                message: ERROR_404
            };
        } 

        /* QUERYING TEST DESCRIPTOR DATABASE */
        try {
            result_RetrieveSKU_SQL[0].testDescriptors = await this.retrieveTestDescriptor(this.dao, result_RetrieveSKU_SQL[0].id);
        } catch (error) {
            throw error;
        }

        return {
            code: 200,
            message: result_RetrieveSKU_SQL[0]
        };
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

        /* QUERYING DATABASE */
        const query_SQL = "INSERT INTO SKUS (DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?)";
        try {
            await this.dao.run(query_SQL, [body.description, body.weight, body.volume, body.notes, body.price, body.availableQuantity]);
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

        const target_id = params.id;
        const data = body;

        /**
         *  QUERYING DATABASE
         *  -----------------
         *  Database fails --> return: ERROR_503 (service unavailable)
         *  Exception is raised (e.g. table SKUS does not exists) --> ERROR_503 (service unavailable)
         */
        var result_SQL;
        try {
            const query_SQL = "SELECT * FROM SKUS WHERE SKUS.id == ?";
            result_SQL = await this.dao.all(query_SQL, [target_id]);

            /* CHECKING RESULT */
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
    
        /* HERE COMPUTE SOME COMPUTATIONS FOR THE POSITION */
        if (result_SQL[0].position !== null) {
            
            try {
                const query_retrievePosition_SQL = "SELECT * FROM POSITIONS WHERE POSITIONS.positionID == ?"
                var result_retrievePosition_SQL = await this.dao.all(query_retrievePosition_SQL, [result_SQL[0].position]);
                if (result_retrievePosition_SQL.length === 0) {
                    throw new TypeError('Service Unavailable');

                }

                // check constraint about maxVolume and maxWeight of that position
                const maxWeight = result_retrievePosition_SQL[0].maxWeight;
                const maxVolume = result_retrievePosition_SQL[0].maxVolume;
                const newWeight = data.newWeight;
                const newVolume = data.newVolume;
                const newAvailableQuantity = data.newAvailableQuantity;

                if ((newWeight * newAvailableQuantity) > maxWeight || (newVolume * newAvailableQuantity) > maxVolume) {
                    return {
                        code: 422,
                        message: ERROR_422 
                    };
                }

                // update sku and update position
                const updateSKU_SQL = "UPDATE SKUS \
                                        SET description = ?, weight = ?, volume = ?, notes = ?, position = ?, price = ?, availableQuantity = ?  \
                                        WHERE id==?";
                try {
                    await this.dao.run(updateSKU_SQL, [data.newDescription, data.newWeight, data.newVolume, data.newNotes, result_SQL[0].position, data.newPrice, data.newAvailableQuantity, target_id]);
                } catch (error) {
                    // console.log(error);
                    throw new TypeError('Service Unavailable');
                }

                const updatePosition_SQL = "UPDATE POSITIONS \
                                            SET occupiedWeight = ?, occupiedVolume = ?  \
                                            WHERE positionID==?";
                try {
                    await this.dao.run(updatePosition_SQL, [(newWeight * newAvailableQuantity), (newVolume * newAvailableQuantity), result_SQL[0].position]);
                } catch (error) {
                    // console.log(error);
                    throw new TypeError('Service Unavailable');
                }
            } catch (error) {
                throw new TypeError('Service Unavailable');
            }
        } else {
            const update_SQL = "UPDATE SKUS \
                                SET description = ?, weight = ?, volume = ?, notes = ?, price = ?, availableQuantity = ?  \
                                WHERE id==?";
            try {
                await this.dao.run(update_SQL, [data.newDescription, data.newWeight, data.newVolume, data.newNotes, data.newPrice, data.newAvailableQuantity, target_id]);
            } catch (error) {
                // console.log(error);
                throw new TypeError('Service Unavailable');
            }
        }

        /*  RETURN RESULT ON SUCCESS */
        return {
            code: 200,
            message: "OK"
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

        const target_id = params.id;
        const positionID = body.position;

        var needToEdit = false;
        var oldPositionID = null;

        /* CHECK CONSTRAINT: position is already assigned to a sku? */
        try {
            const query_positionAssigned_SQL = "SELECT * FROM SKUS WHERE SKUS.position == ?";
            const result_positionAssigned_SQL = await this.dao.all(query_positionAssigned_SQL, [positionID]);
            if (result_positionAssigned_SQL.length !== 0) {
                return {
                    code: 422, 
                    message: ERROR_422
                };
            }
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }
        
        /* QUERYING DATABASE TO RETRIEVE SKU */
        var resultSKU_SQL = null;
        try {
            const querySKU_SQL = "SELECT * FROM SKUS WHERE SKUS.id == ?";
            resultSKU_SQL = await this.dao.all(querySKU_SQL, [target_id]);
            if (resultSKU_SQL.length === 0) {                              
                return {
                    code: 404, 
                    message: ERROR_404
                };
            }

            /* CHECK IF IT HAS A POSITION ALREADY */
            if (resultSKU_SQL[0].position !== null) {
                needToEdit = true;
                oldPositionID = resultSKU_SQL[0].position;
            }
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }
        
        /* QUERYING DATABASE TO RETRIEVE POSITION */
        var resultPosition_SQL = null;
        try {
            const queryPosition_SQL = "SELECT * FROM POSITIONS WHERE POSITIONS.positionID == ?";
            resultPosition_SQL = await this.dao.all(queryPosition_SQL, [positionID]);
            if (resultPosition_SQL.length === 0) {                              
                return {
                    code: 404,
                    message: ERROR_404
                };
            }
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }

        /* PARSING QUERY RESULT */
        const maxWeight = resultPosition_SQL[0].maxWeight;
        const maxVolume = resultPosition_SQL[0].maxVolume;
        const occupiedWeight = resultPosition_SQL[0].occupiedWeight;
        const occupiedVolume = resultPosition_SQL[0].occupiedVolume;
        const skuWeight = resultSKU_SQL[0].weight;
        const skuVolume = resultSKU_SQL[0].volume;
        const availableQuantity = resultSKU_SQL[0].availableQuantity;


        /* CHECK CONSTRAINT: volume and weight are fine? */
        if (occupiedWeight + (skuWeight * availableQuantity) > maxWeight || occupiedVolume + (skuVolume * availableQuantity) > maxVolume) {
            return {
                code: 422,
                message: ERROR_422
            };
        }

        /* IF EVERYTHING IS FINE, UPDATE THE NEW POSITION, RESET THE OLD POSITION AND UPDATE THE SKU */
        try {
            const updateSKU_SQL = "UPDATE SKUS \
                                   SET position = ?  \
                                   WHERE id==?";
            await this.dao.run(updateSKU_SQL, [positionID, target_id]);
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }
        
        try {
            const updatePosition_SQL = "UPDATE POSITIONS \
                                        SET occupiedWeight = ?, occupiedVolume = ? \
                                        WHERE positionID == ?";
            await this.dao.run(updatePosition_SQL, [(occupiedWeight + (skuWeight * availableQuantity)), (occupiedVolume + (skuVolume * availableQuantity)), positionID]);
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }
        

        if (needToEdit === true) {
            try {
                const resetPosition_SQL = "UPDATE POSITIONS \
                                           SET occupiedWeight = 0, occupiedVolume = 0 \
                                           WHERE positionID == ?";
                await this.dao.run(resetPosition_SQL, [oldPositionID]);
            } catch (error) {
                // console.log(error);
                throw new TypeError('Service Unavailable');
            }
        }

        /* RETURN RESULT ON SUCCESS */
        return {
            code: 200,
            message: "OK"
        };
    }

    /**
     * Delete an SKU given its identifier ID
     * ------------------------------------------
     *        API: DELETE /api/skus/:id
     * ==========================================
     * @param {request.params} params
     */
    deleteSKU = async (params) => {

        let target_id = params.id;

        /* ------------ CHECK IF SKU IS ASSOCIATED TO SKUITEMS OR TESTDESCRIPTOR ----------------*/
        /**
         *  QUERYING DATABASE
         *  -----------------
         *  Database fails --> return: ERROR_503 (service unavailable)
         *  Exception is raised (e.g. table SKUS does not exists) --> ERROR_503 (service unavailable)
         */
        try {

            const query_retrieveSKU_SQL = "SELECT * FROM SKUS WHERE SKUS.id == ?";
            const result_retrieveSKU_SQL = await this.dao.all(query_retrieveSKU_SQL, [target_id]);

            /* CHECKING TEST DESCRIPTOR */
            let result = await this.retrieveTestDescriptor(this.dao, result_retrieveSKU_SQL[0].id);
            if (result.length !== 0) {
                return {
                    code: 422,
                    message: ERROR_422
                };
            }

            /* CHECKING SKUITEMS */
            const query_retrieveSKUitem_SQL = "SELECT * FROM SKUITEMS WHERE SKUITEMS.SKUId == ?";
            const result_retrieveSKUitem_SQL = await this.dao.all(query_retrieveSKUitem_SQL, [target_id]);
            if (result_retrieveSKUitem_SQL.length !== 0) {
                return {
                    code: 422,
                    message: ERROR_422
                };
            }

            /* CHECKING POSITION AND UPDATE */
            if (result_retrieveSKU_SQL[0].position !== null) {
                const query_updatePosition_SQL = "UPDATE POSITIONS SET occupiedWeight = 0, occupiedVolume = 0 WHERE positionID == ?";
                await this.dao.run(query_updatePosition_SQL, [result_retrieveSKU_SQL[0].position]);
            }
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }
        
        /* -------------- REMOVING SKU FROM THE LIST -------------- */
        try {
            const query_SQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
            await this.dao.run(query_SQL, [target_id]);
        } catch (error) {
            // console.log(error);
            throw new TypeError('Service Unavailable');
        }
        

        /* RETURNING */
        return {
            code: 204, 
            message: "NO CONTENT"
        };
    }

}

module.exports = SKUController;