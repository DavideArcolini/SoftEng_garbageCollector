"use strict";

/* SOME ERROR MESSAGES HERE */
const ERROR_400 = {error: 'Bad request'};
const ERROR_404 = {error: '404 Not Found'};
const ERROR_422 = {error: 'Unprocessable Entity'};
const ERROR_500 = {error: 'Internal Server Error'};
const ERROR_503 = {error: 'Service Unavailable'};

/**
 * 
 * @param {DAO} dao 
 * @param {integer} idSKU 
 * @returns an array containing the ids of the Test Descriptors associated to the idSKU passed as parameters
 */
async function retrieveTestDescriptor(dao, idSKU) {
    const query_RetrieveTestDescriptor_SQL = "SELECT TD.id FROM TEST_DESCRIPTORS TD WHERE TD.idSKU == ?";
    var result_RetrieveTestDescriptor_SQL = await dao.all(query_RetrieveTestDescriptor_SQL, [idSKU], (error) => {
        if (error) {
            return [ -1 ];
        }
    });

    var result = [];
    result_RetrieveTestDescriptor_SQL.map((element) => {
        result.push(element.id);
    })

    return result;
}

class SKUController {

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
     * Get all the SKUs in the database.
     * ---------------------------------
     *        API: GET /api/skus
     * =================================
     * @param {callback} request 
     * @param {callback} response 
     */
    getStoredSKUs = async (request, response) => {
        
        /* CHECKING INPUT */
        if (Object.keys(request.body).length !== 0) {       
            return response.status(400).json(ERROR_400);
        }

        /* QUERYING SKU DATABASE */
        const query_RetrieveSKU_SQL = "SELECT * FROM SKUS";
        let result_RetrieveSKU_SQL = await this.dao.all(query_RetrieveSKU_SQL, (error, rows) => {
            if (error) {
                return response.status(500).json(ERROR_500);
            } 
        });

        /* QUERYING TEST DESCRIPTOR DATABASE */
        for (let item of result_RetrieveSKU_SQL) {
            item.testDescriptors = await retrieveTestDescriptor(this.dao, item.id);
            if (item.testDescriptors === [ -1 ]) {
                return response.status(500).json(ERROR_500);
            }
        }

        /* RETURNING RESULT */
        return response.status(200).json(result_RetrieveSKU_SQL);
    }

    /**
     * Retrieve an SKU given its identifier ID
     * ------------------------------------------
     *          API: GET /api/skus/:id
     * ==========================================
     * @param {callback} request 
     * @param {callback} response 
     */
    getStoredSKUById = async (request, response) => {

        let target_id = request.params.id;

        /* CHECK INPUT */
        if (Object.keys(request.body).length !== 0) {           /* BODY SHOULD BE EMPTY */
            return response.status(422).json(ERROR_422);
        } else if (/^[0-9]+$/.test(target_id) === false) {      /* HEADER PARAMETER SHOULD BE A NUMBER */
            return response.status(422).json(ERROR_422);
        }

        /* QUERYING SKU DATABASE */
        const query_RetrieveSKU_SQL = "SELECT * FROM SKUS WHERE SKUS.id == ?";
        let result_RetrieveSKU_SQL = await this.dao.all(query_RetrieveSKU_SQL, [target_id], (error, rows) => {
            if (error) {
                return response.status(500).json(error_500);
            }
        });

        /* CHECKING RESULT */
        if (result_RetrieveSKU_SQL.length === 0) {
            return response.status(404).json(ERROR_404);
        } 

        /* QUERYING TEST DESCRIPTOR DATABASE */
        result_RetrieveSKU_SQL[0].testDescriptors = await retrieveTestDescriptor(this.dao, result_RetrieveSKU_SQL[0].id);
        if (result_RetrieveSKU_SQL[0].testDescriptors === [ -1 ]) {
            return response.status(500).json(ERROR_500);
        }

        return response.status(200).json(result_RetrieveSKU_SQL[0]);
    }

    /**
     * Create a new SKU object and store it in
     * the database.
     * ------------------------------------------
     *            API: POST /api/sku
     * ==========================================
     * @param {callback} request 
     * @param {callback} response 
     */
    newSKU = async (request, response) => {
        
        const data = request.body;

        /* CHECKING USER INPUT */
        if (Object.keys(request.body).length === 0) {
            return response.status(422).json(ERROR_422);
        } else if (data.description === undefined || data.weight === undefined || data.volume === undefined || data.notes === undefined || data.price === undefined || data.availableQuantity === undefined) {
            return response.status(422).json(ERROR_422);
        }

        /* QUERYING DATABASE */
        const query_SQL = "INSERT INTO SKUS (DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?)";
        await this.dao.run(query_SQL, [data.description, data.weight, data.volume, data.notes, data.price, data.availableQuantity], (error) => {
            if (error) {
                return response.status(503).json(ERROR_503);
            }
        });

        /* RETURNING RESULT */
        return response.status(201).json();
    }

    /**
     * Modify an existing SKU. When a newAvailableQuantity is sent, occupiedWeight and 
     * occupiedVolume fields of the position (if the SKU is associated to a position) are 
     * modified according to the new available quantity.
     * ------------------------------------------------------------------------------------
     *                              API: PUT /api/sku/:id
     * ====================================================================================
     * @param {callback} request 
     * @param {callback} response 
     */
    editSKU = async (request, response) => {

        const target_id = request.params.id;
        const data = request.body;

        /**
         *  VALIDATING USER INPUT
         *  ---------------------
         *  CONSTRAINTS:
         *      - Request header: id should be a number --> return: ERROR_422 (Unprocessable entity)
         *      - Request body: non-empty --> return: ERROR_422 (Unprocessable entity)
         *      - Request body: all data should be defined --> return: ERROR_422 (Unprocessable entity)
         */        
        if (/^[0-9]+$/.test(target_id) === false) {      
            return response.status(422).json(ERROR_422);
        } else if (data.length === 0) {                  
            return response.status(422).json(ERROR_422);
        } else if (data.newDescription === undefined || data.newWeight === undefined || data.newVolume === undefined || data.newNotes === undefined || data.newPrice === undefined || data.newAvailableQuantity === undefined ) {
            return response.status(422).json(ERROR_422);    
        }


        /**
         *  QUERYING DATABASE
         *  -----------------
         *  Database fails --> return: ERROR_503 (service unavailable)
         *  Exception is raised (e.g. table SKUS does not exists) --> ERROR_503 (service unavailable)
         */
        var result_SQL;
        try {
            const query_SQL = "SELECT * FROM SKUS WHERE SKUS.id == ?";
            result_SQL = await this.dao.all(query_SQL, [target_id], (error, rows) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });

            /* CHECKING RESULT */
            if (result_SQL.length === 0) {
                return response.status(404).json(ERROR_404);
            }        
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
    

        /* HERE COMPUTE SOME COMPUTATIONS FOR THE POSITION */
        if (result_SQL[0].position !== null) {
            
            try {
                const query_retrievePosition_SQL = "SELECT * FROM POSITIONS WHERE POSITIONS.positionID == ?"
                var result_retrievePosition_SQL = await this.dao.all(query_retrievePosition_SQL, [result_SQL[0].position], (error) => {
                    if (error) {
                        return response.status(503).json();
                    }
                });
                if (result_retrievePosition_SQL.length === 0) {
                    return response.status(503).json(ERROR_503);
                }

                // check constraint about maxVolume and maxWeight of that position
                const maxWeight = result_retrievePosition_SQL[0].maxWeight;
                const maxVolume = result_retrievePosition_SQL[0].maxVolume;
                const newWeight = data.newWeight;
                const newVolume = data.newVolume;
                const newAvailableQuantity = data.newAvailableQuantity;

                if ((newWeight * newAvailableQuantity) > maxWeight || (newVolume * newAvailableQuantity) > maxVolume) {
                    return response.status(422).json(ERROR_422);
                }

                //          update sku and update position
                const updateSKU_SQL = "UPDATE SKUS \
                                        SET description = ?, weight = ?, volume = ?, notes = ?, position = ?, price = ?, availableQuantity = ?  \
                                        WHERE id==?";
                await this.dao.run(updateSKU_SQL, [data.newDescription, data.newWeight, data.newVolume, data.newNotes, result_SQL[0].position, data.newPrice, data.newAvailableQuantity, target_id], (error) => {
                    if (error) {
                        return response.status(503).json(ERROR_503);
                    }
                });

                const updatePosition_SQL = "UPDATE POSITIONS \
                                            SET occupiedWeight = ?, occupiedVolume = ?  \
                                            WHERE positionID==?";
                await this.dao.run(updatePosition_SQL, [(newWeight * newAvailableQuantity), (newVolume * newAvailableQuantity), result_SQL[0].position], (error) => {
                    if (error) {
                        return response.status(503).json(ERROR_503);
                    }
                });
            } catch (error) {
                console.log(error);
                return response.status(503).json(ERROR_503);
            }
        } else {
            const update_SQL = "UPDATE SKUS \
                                SET description = ?, weight = ?, volume = ?, notes = ?, price = ?, availableQuantity = ?  \
                                WHERE id==?";
            await this.dao.run(update_SQL, [data.newDescription, data.newWeight, data.newVolume, data.newNotes, data.newPrice, data.newAvailableQuantity, target_id], (error) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });
        }
        
        /*  RETURN RESULT ON SUCCESS */
        return response.status(200).json();
    }


    /**
     * Add or modify position of a SKU. When a SKU is associated to a position, 
     * occupiedWeight and occupiedVolume fields of the position are modified according to 
     * the available quantity.
     * ------------------------------------------------------------------------------------
     *                          API: PUT /api/sku/:id/position
     * ====================================================================================
     * @param {callback} request 
     * @param {callback} response 
     */
    addOrEditPositionSKU = async (request, response) => {

        const target_id = request.params.id;
        const positionID = request.body.position;

        var needToEdit = false;
        var oldPositionID = null;

        /**
         *  VALIDATING USER INPUT
         *  ---------------------
         *  CONSTRAINTS:
         *      - Request header: id should be a number --> return: ERROR_422 (Unprocessable entity)
         *      - Request body: non-empty --> return: ERROR_422 (Unprocessable entity)
         *      - Request body: all data should be defined --> return: ERROR_422 (Unprocessable entity)
         *      - Request body: length of parameters --> return: ERROR_422 (Unprocessable entity)
         */       
        if (/^[0-9]+$/.test(target_id) === false) {    
            return response.status(422).json(ERROR_422);
        } else if (request.body.length === 0) {                    
            return response.status(422).json(ERROR_422);
        } else if (positionID === undefined || positionID.length !== 12) {
            return response.status(422).json(ERROR_422);    
        }

        /* CHECK CONSTRAINT: position is already assigned to a sku? */
        try {
            const query_positionAssigned_SQL = "SELECT * FROM SKUS WHERE SKUS.position == ?";
            const result_positionAssigned_SQL = await this.dao.all(query_positionAssigned_SQL, [positionID], (error) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });
            if (result_positionAssigned_SQL.length !== 0) {
                console.log("[DEBUG] Oh no");
                return response.status(422).json(ERROR_422);
            }
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
        

        /* QUERYING DATABASE TO RETRIEVE SKU */
        var resultSKU_SQL = null;
        try {
            const querySKU_SQL = "SELECT * FROM SKUS WHERE SKUS.id == ?";
            resultSKU_SQL = await this.dao.all(querySKU_SQL, [target_id], (error, rows) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });
            if (resultSKU_SQL.length === 0) {                              
                return response.status(404).json(ERROR_404);
            }

            /* CHECK IF IT HAS A POSITION ALREADY */
            if (resultSKU_SQL[0].position !== null) {
                needToEdit = true;
                oldPositionID = resultSKU_SQL[0].position;
            }

        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
        

        /* QUERYING DATABASE TO RETRIEVE POSITION */
        var resultPosition_SQL = null;
        try {
            const queryPosition_SQL = "SELECT * FROM POSITIONS WHERE POSITIONS.positionID == ?";
            resultPosition_SQL = await this.dao.all(queryPosition_SQL, [positionID], (error, rows) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });
            if (resultPosition_SQL.length === 0) {                              
                return response.status(404).json(ERROR_404);
            }
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
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
            return response.status(422).json(ERROR_422);
        }

        /* IF EVERYTHING IS FINE, UPDATE THE NEW POSITION, RESET THE OLD POSITION AND UPDATE THE SKU */
        try {
            const updateSKU_SQL = "UPDATE SKUS \
                                   SET position = ?  \
                                   WHERE id==?";
            await this.dao.run(updateSKU_SQL, [positionID, target_id], (error) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
        

        try {
            const updatePosition_SQL = "UPDATE POSITIONS \
                                        SET occupiedWeight = ?, occupiedVolume = ? \
                                        WHERE positionID == ?";
            await this.dao.run(updatePosition_SQL, [(occupiedWeight + (skuWeight * availableQuantity)), (occupiedVolume + (skuVolume * availableQuantity)), positionID], (error) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
        

        if (needToEdit === true) {
            try {
                const resetPosition_SQL = "UPDATE POSITIONS \
                                           SET occupiedWeight = 0, occupiedVolume = 0 \
                                           WHERE positionID == ?";
                await this.dao.run(resetPosition_SQL, [oldPositionID], (error) => {
                    if (error) {
                        return response.status(503).json(ERROR_503);
                    }
                });
            } catch (error) {
                console.log(error);
                return response.status(503).json(ERROR_503);
            }
        }

        /* RETURN RESULT ON SUCCESS */
        return response.status(200).json();
    }


    /**
     * Delete an SKU given its identifier ID
     * ------------------------------------------
     *        API: DELETE /api/skus/:id
     * ==========================================
     * @param {callback} request 
     * @param {callback} response 
     */
    deleteSKU = async (request, response) => {

        let target_id = request.params.id;

        /**
         *  VALIDATING USER INPUT
         *  ---------------------
         *  CONSTRAINTS:
         *      - Request header: id should be a number --> return: ERROR_422 (Unprocessable entity)
         *      - Request body: empty --> return: ERROR_422 (Unprocessable entity)
         */ 
        if (Object.keys(request.body).length !== 0) {           
            return response.status(422).json(ERROR_422);
        } else if (/^[0-9]+$/.test(target_id) === false) {      /* HEADER PARAMETER SHOULD BE A NUMBER */
            return response.status(422).json(ERROR_422);
        }

        /* ------------ CHECK IF SKU IS ASSOCIATED TO SKUITEMS OR TESTDESCRIPTOR ----------------*/
        /**
         *  QUERYING DATABASE
         *  -----------------
         *  Database fails --> return: ERROR_503 (service unavailable)
         *  Exception is raised (e.g. table SKUS does not exists) --> ERROR_503 (service unavailable)
         */
        try {

            const query_retrieveSKU_SQL = "SELECT * FROM SKUS WHERE SKUS.id == ?";
            const result_retrieveSKU_SQL = await this.dao.all(query_retrieveSKU_SQL, [target_id], (error) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });

            /* CHECKING TEST DESCRIPTOR */
            if (result_retrieveSKU_SQL[0].testDescriptors !== null) {
                return response.status(422).json(ERROR_422);
            }

            /* CHECKING POSITION AND UPDATE */
            if (result_retrieveSKU_SQL[0].position !== null) {
                const query_updatePosition_SQL = "UPDATE POSITIONS SET occupiedWeight = 0, occupiedVolume = 0 WHERE positionID == ?";
                await this.dao.run(query_updatePosition_SQL, [result_retrieveSKU_SQL[0].position], (error) => {
                    if (error) {
                        return response.status(503).json(ERROR_503);
                    }
                })
            }

            /* CHECKING SKUITEMS */
            const query_retrieveSKUitem_SQL = "SELECT * FROM SKUITEMS WHERE SKUITEMS.SKUId == ?";
            const result_retrieveSKUitem_SQL = await this.dao.all(query_retrieveSKUitem_SQL, [target_id], (error) => {
                if (error) {
                    return response.status(503).json(ERROR_503);
                }
            });
            if (result_retrieveSKUitem_SQL.length !== 0) {
                return response.status(422).json(ERROR_422);
            }
        } catch (error) {
            console.log(error);
            return response.status(503).json(ERROR_503);
        }
        
        /* -------------- REMOVING SKU FROM THE LIST -------------- */
        const query_SQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
        await this.dao.run(query_SQL, [target_id], (error) => {
            if (error) {
                return response.status(503).json(ERROR_503);
            }
        });

        /* RETURNING */
        return response.status(204).json();
    }

}

module.exports = SKUController;