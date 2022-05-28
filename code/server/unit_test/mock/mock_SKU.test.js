/**
 *      MOCKING CLASS: SKU
 * ===========================
 * 
*/

'use strict'

/* ------------ MODULE IMPORT ------------ */
const dao                   = require('../test_DB/mock_dao');
const SKUController         = require('../../controller/SKUController');

/* ------------ INITIALIZATION ------------ */
const skuController     = new SKUController(dao);



/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |            T E S T    R E S U L T S              |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/

/*
* -----------------------------------------
*         retrieveMOCKDescriptor
* =========================================
*/
retrieveMOCKDescriptor_MOCK(
    'Error with database',
    {SKUid: 1},
    TypeError,
    1,
    0
);
retrieveMOCKDescriptor_MOCK(
    'No MOCK descriptors associated to SKU',
    {SKUid: 999},
    [],
    0,
    1
);
retrieveMOCKDescriptor_MOCK(
    'retrieved MOCK descriptors associated to SKU',
    {SKUid: 1},
    [1, 2],
    0,
    0
);

/*
* -----------------------------------------
*          API: GET /api/skus
* =========================================
*/
getStoredSKUs_MOCK(
    '[200] OK',
    {
        code: 200, 
        message: [
            {
                id: 1,
                description: "a new sku",
                weight: 100,
                volume: 50,
                notes: "first SKU",
                position: "800234523412",
                availableQuantity: 50,
                price: 10.99,
                testDescriptors: [1, 2, 3]
            },
            {
                id :2,
                description: "another sku",
                weight: 101,
                volume: 60,
                notes: "second SKU",
                position: "800234543412",
                availableQuantity: 55,
                price: 10.99,
                testDescriptors: [1, 2, 3]
            }
        ]
    },
    0, 
    0
);
getStoredSKUs_MOCK(
    'TypeError: SELECT from table SKUS failed',
    TypeError,
    1, 
    0
);
getStoredSKUs_MOCK(
    '[500]: retrieveMOCKDescriptor failed',
    TypeError,
    0, 
    1
);

/*
* -----------------------------------------
*          API: GET /api/skus/:id
* =========================================
*/
getStoredSKUById_MOCK(
    '[200] OK',
    {id: 1},
    {
        code: 200,
        message: {
            id: 1,
            description: "a new sku",
            weight: 100,
            volume: 50,
            notes: "first SKU",
            position: "800234523412",
            availableQuantity: 50,
            price: 10.99,
            testDescriptors: [ 1, 2, 3 ]
        }
    },
    0, 
    0, 
    0
);
getStoredSKUById_MOCK(
    '[404] Not Found',
    {id: 99999},
    {
        code: 404,
        message: 'Not Found'
    },
    0, 
    1, 
    0
);
getStoredSKUById_MOCK(
    '[500] retrieveMOCKDescriptor failed',
    {id: 1},
    TypeError,
    0, 
    0, 
    1
);
getStoredSKUById_MOCK(
    'TypeError: SELECT from table SKUS failed',
    {id: 1},
    TypeError,
    1, 
    0, 
    0
);


/*
* -----------------------------------------
*             API: POST /api/sku
* =========================================
*/
newSKU_MOCK(
    '[201] Created',
    {
        description: "a new sku",
        weight: 100,
        volume: 50,
        notes: "first SKU",
        price: 10.99,
        availableQuantity: 50
    },
    {
        code: 201,
        message: "CREATED"
    },
    0
);
newSKU_MOCK(
    'TypeError: INSERT into table SKUS failed',
    {
        description: "a new sku",
        weight: 100,
        volume: 50,
        notes: "first SKU",
        price: 10.99,
        availableQuantity: 50
    },
    TypeError,
    1
);

/*
* -----------------------------------------
*             API: POST /api/sku
* =========================================
*/
editSKU_MOCK(
    '[200] OK',
    {id: 1},
    {
        newDescription: "a new sku",
        newWeight: 100,
        newVolume: 50,
        newNotes: "first SKU",
        newPrice: 10.99,
        newAvailableQuantity: 1
    },
    {
        code: 200,
        message: "OK"
    },
    [0, 0, 0, 0],   /* triggerDatabaseError         */
    [0, 0],         /* triggerNotFoundError         */
    0               /* triggerNonExistingPosition   */
);
editSKU_MOCK(
    '[200] OK (SKU.position: null)',
    {id: 1},
    {
        newDescription: "a new sku",
        newWeight: 100,
        newVolume: 50,
        newNotes: "first SKU",
        newPrice: 10.99,
        newAvailableQuantity: 1
    },
    {
        code: 200,
        message: "OK"
    },
    [0, 0, 0, 0],   /* triggerDatabaseError         */
    [0, 0],         /* triggerNotFoundError         */
    1               /* triggerNonExistingPosition   */
);
editSKU_MOCK(
    '[404] Not Found: SKU not existing',
    {id: 99999},
    {
        newDescription: "a new sku",
        newWeight: 100,
        newVolume: 50,
        newNotes: "first SKU",
        newPrice: 10.99,
        newAvailableQuantity: 50
    },
    {
        code: 404,
        message: "Not Found"
    },
    [0, 0, 0, 0],   /* triggerDatabaseError         */
    [1, 0],         /* triggerNotFoundError         */
    0               /* triggerNonExistingPosition   */
);
editSKU_MOCK(
    'TypeError: SKU associated with a non existing position',
    {id: 1},
    {
        newDescription: "a new sku",
        newWeight: 100,
        newVolume: 50,
        newNotes: "first SKU",
        newPrice: 10.99,
        newAvailableQuantity: 50
    },
    TypeError,
    [0, 0, 0, 0],   /* triggerDatabaseError         */
    [0, 1],         /* triggerNotFoundError         */
    0               /* triggerNonExistingPosition   */
);
editSKU_MOCK(
    'TypeError: UPDATE table SKUS failed',
    {id: 1},
    {
        newDescription: "a new sku",
        newWeight: 100,
        newVolume: 50,
        newNotes: "first SKU",
        newPrice: 10.99,
        newAvailableQuantity: 1
    },
    TypeError,
    [0, 0, 1, 0],   /* triggerDatabaseError         */
    [0, 0],         /* triggerNotFoundError         */
    1               /* triggerNonExistingPosition   */
);
editSKU_MOCK(
    'TypeError: SELECT from table SKUS failed',
    {id: 1},
    {
        newDescription: "a new sku",
        newWeight: 100,
        newVolume: 50,
        newNotes: "first SKU",
        newPrice: 10.99,
        newAvailableQuantity: 50
    },
    TypeError,
    [1, 0, 0, 0],   /* triggerDatabaseError         */
    [0, 0],         /* triggerNotFoundError         */
    0               /* triggerNonExistingPosition   */
);
editSKU_MOCK(
    'TypeError: SELECT from table POSITIONS failed',
    {id: 1},
    {
        newDescription: "a new sku",
        newWeight: 100,
        newVolume: 50,
        newNotes: "first SKU",
        newPrice: 10.99,
        newAvailableQuantity: 50
    },
    TypeError,
    [0, 1, 0, 0],   /* triggerDatabaseError         */
    [0, 0],         /* triggerNotFoundError         */
    0               /* triggerNonExistingPosition   */
);
editSKU_MOCK(
    'TypeError: UPDATE table SKUS failed',
    {id: 1},
    {
        newDescription: "a new sku",
        newWeight: 100,
        newVolume: 50,
        newNotes: "first SKU",
        newPrice: 10.99,
        newAvailableQuantity: 1
    },
    TypeError,
    [0, 0, 1, 0],   /* triggerDatabaseError         */
    [0, 0],         /* triggerNotFoundError         */
    0               /* triggerNonExistingPosition   */
);
editSKU_MOCK(
    'TypeError: UPDATE table POSITIONS failed',
    {id: 1},
    {
        newDescription: "a new sku",
        newWeight: 100,
        newVolume: 50,
        newNotes: "first SKU",
        newPrice: 10.99,
        newAvailableQuantity: 1
    },
    TypeError,
    [0, 0, 0, 1],   /* triggerDatabaseError         */
    [0, 0],         /* triggerNotFoundError         */
    0               /* triggerNonExistingPosition   */
);
editSKU_MOCK(
    'TypeError: weight/volume constraints failed',
    {id: 1},
    {
        newDescription: "a new sku",
        newWeight: 9999,
        newVolume: 9999,
        newNotes: "first SKU",
        newPrice: 10.99,
        newAvailableQuantity: 9999
    },
    {
        code: 422,
        message: "Unprocessable Entity"
    },
    [0, 0, 0, 0],   /* triggerDatabaseError         */
    [0, 0],         /* triggerNotFoundError         */
    0               /* triggerNonExistingPosition   */
);


/*
* -----------------------------------------
*       API: PUT /api/sku/:id/position
* =========================================
*/
addOrEditPositionSKU_MOCK(
    '[200] OK',
    {id: 1},
    {position: "800234523412"},
    {
        code: 200,
        message: "OK"
    },
    [0, 0, 0, 0, 0, 0],     /* triggerDatabaseError         */
    [0, 0],                 /* triggerNotFoundError         */
    [0, 0],                 /* triggerNonExistingPosition   */
    0                       /* triggerConstraintError       */
);
addOrEditPositionSKU_MOCK(
    '[422] position is already assigned to a sku',
    {id: 1},
    {position: "800234523412"},
    {
        code: 422,
        message: "Unprocessable Entity"
    },
    [0, 0, 0, 0, 0, 0],     /* triggerDatabaseError         */
    [0, 0],                 /* triggerNotFoundError         */
    [1, 0],                 /* triggerNonExistingPosition   */
    0                       /* triggerConstraintError       */
);
addOrEditPositionSKU_MOCK(
    'TypeError: SELECT from table SKUS failed (sku.position)',
    {id: 1},
    {position: "999999999999"},
    TypeError,
    [1, 0, 0, 0, 0, 0],     /* triggerDatabaseError         */
    [0, 0],                 /* triggerNotFoundError         */
    [0, 0],                 /* triggerNonExistingPosition   */
    0                       /* triggerConstraintError       */
);
addOrEditPositionSKU_MOCK(
    'TypeError: SELECT from table SKUS failed (sku.id)',
    {id: 1},
    {position: "800234523412"},
    TypeError,
    [0, 1, 0, 0, 0, 0],     /* triggerDatabaseError         */
    [0, 0],                 /* triggerNotFoundError         */
    [0, 0],                 /* triggerNonExistingPosition   */
    0                       /* triggerConstraintError       */
);
addOrEditPositionSKU_MOCK(
    '[404]: SKU does not exist',
    {id: 99999},
    {position: "800234523412"},
    {
        code: 404,
        message: "Not Found"
    },
    [0, 0, 0, 0, 0, 0],     /* triggerDatabaseError         */
    [1, 0],                 /* triggerNotFoundError         */
    [0, 0],                 /* triggerNonExistingPosition   */
    0                       /* triggerConstraintError       */
);
addOrEditPositionSKU_MOCK(
    '[200]: OK (SKU.position !== null)',
    {id: 1},
    {position: "800234523412"},
    {
        code: 200,
        message: "OK"
    },
    [0, 0, 0, 0, 0, 0],     /* triggerDatabaseError         */
    [0, 0],                 /* triggerNotFoundError         */
    [0, 1],                 /* triggerNonExistingPosition   */
    0                       /* triggerConstraintError       */
);
addOrEditPositionSKU_MOCK(
    'TypeError: UPDATE table position failed (SKU.position !== null)',
    {id: 1},
    {position: "800234523412"},
    TypeError,
    [0, 0, 0, 0, 0, 1],     /* triggerDatabaseError         */
    [0, 0],                 /* triggerNotFoundError         */
    [0, 1],                 /* triggerNonExistingPosition   */
    0                       /* triggerConstraintError       */
);
addOrEditPositionSKU_MOCK(
    'TypeError: SELECT from table POSITIONS failed (position.positionID)',
    {id: 1},
    {position: "800234523412"},
    TypeError,
    [0, 0, 1, 0, 0, 0],     /* triggerDatabaseError         */
    [0, 0],                 /* triggerNotFoundError         */
    0,                      /* triggerNonExistingPosition   */
    0                       /* triggerConstraintError       */
);
addOrEditPositionSKU_MOCK(
    '[404]: positionID does not exist',
    {id: 1},
    {position: "999999999999"},
    {
        code: 404,
        message: "Not Found"
    },
    [0, 0, 0, 0, 0, 0],     /* triggerDatabaseError         */
    [0, 1],                 /* triggerNotFoundError         */
    0,                      /* triggerNonExistingPosition   */
    0                       /* triggerConstraintError       */
);
addOrEditPositionSKU_MOCK(
    '[422]: SKU does not satisfy position constraints',
    {id: 1},
    {position: "800234523412"},
    {
        code: 422,
        message: "Unprocessable Entity"
    },
    [0, 0, 0, 0, 0, 0],     /* triggerDatabaseError         */
    [0, 0],                 /* triggerNotFoundError         */
    0,                      /* triggerNonExistingPosition   */
    1                       /* triggerConstraintError       */
);
addOrEditPositionSKU_MOCK(
    'TypeError: UPDATE table SKUS failed',
    {id: 1},
    {position: "800234523412"},
    TypeError,
    [0, 0, 0, 1, 0, 0],     /* triggerDatabaseError         */
    [0, 0],                 /* triggerNotFoundError         */
    0,                      /* triggerNonExistingPosition   */
    0                       /* triggerConstraintError       */
);
addOrEditPositionSKU_MOCK(
    'TypeError: UPDATE table POSITIONS failed',
    {id: 1},
    {position: "800234523412"},
    TypeError,
    [0, 0, 0, 0, 1, 0],     /* triggerDatabaseError         */
    [0, 0],                 /* triggerNotFoundError         */
    [0, 0],                 /* triggerNonExistingPosition   */
    0                       /* triggerConstraintError       */
);
addOrEditPositionSKU_MOCK(
    'TypeError: UPDATE table POSITIONS failed',
    {id: 1},
    {position: "800234523412"},
    TypeError,
    [0, 0, 0, 0, 0, 1],     /* triggerDatabaseError         */
    [0, 0],                 /* triggerNotFoundError         */
    [0, 1],                      /* triggerNonExistingPosition   */
    0                       /* triggerConstraintError       */
);


/*
* -----------------------------------------
*       API: DELETE /api/skus/:id
* =========================================
*/
deleteSKU_MOCK(
    '[204] No Content',
    {id: 1},
    {
        code: 204,
        message: "NO CONTENT"
    },
    [0, 0],                 /* triggerDatabaseError         */
    0,                      /* triggerConstraintError       */
    0,                      /* triggerNonExistingPosition   */
    0                       /* triggerUtilityFunctionError  */
);
deleteSKU_MOCK(
    '[422] cannot delete SKU with associated MOCK descriptors',
    {id: 1},
    {
        code: 422,
        message: "Unprocessable Entity"
    },
    [0, 0],                 /* triggerDatabaseError         */
    0,                      /* triggerConstraintError       */
    0,                      /* triggerNonExistingPosition   */
    1                       /* triggerUtilityFunctionError  */
);
deleteSKU_MOCK(
    '[422] cannot delete SKU with associated SKUitems',
    {id: 1},
    {
        code: 422,
        message: "Unprocessable Entity"
    },
    [0, 0],                 /* triggerDatabaseError         */
    1,                      /* triggerConstraintError       */
    0,                      /* triggerNonExistingPosition   */
    0                       /* triggerUtilityFunctionError  */
);
deleteSKU_MOCK(
    '[204] No Content (with position updated)',
    {id: 1},
    {
        code: 204,
        message: "NO CONTENT"
    },
    [0, 0],                 /* triggerDatabaseError         */
    0,                      /* triggerConstraintError       */
    1,                      /* triggerNonExistingPosition   */
    0                       /* triggerUtilityFunctionError  */
);
deleteSKU_MOCK(
    'TypeError: UPDATE constraints failed',
    {id: 1},
    TypeError,
    [1, 0],                 /* triggerDatabaseError         */
    0,                      /* triggerConstraintError       */
    0,                      /* triggerNonExistingPosition   */
    0                       /* triggerUtilityFunctionError  */
);
deleteSKU_MOCK(
    'TypeError: DELETE from table SKUS failed',
    {id: 1},
    TypeError,
    [0, 1],                 /* triggerDatabaseError         */
    0,                      /* triggerConstraintError       */
    1,                      /* triggerNonExistingPosition   */
    0                       /* triggerUtilityFunctionError  */
);









/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |          T E S T    F U N C T I O N S            |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/
function retrieveMOCKDescriptor_MOCK(describe_NAME, request, expectedResult, triggerDatabaseError, triggerEmpty) {
    describe('MOCK: retrieveMOCKDescriptor()', () => {
        beforeEach(() => {
            dao.all.mockReset();
            dao.all.mockImplementation(() => {
                if (triggerDatabaseError) {
                    throw new TypeError();
                } else {
                    if (triggerEmpty) {
                        return [];
                    } else {
                        return [
                            {
                                id: 1,
                                name: "MOCK descriptor 1",
                                procedureDescription: "This MOCK is described by...",
                                idSKU: 1
                    
                            },
                            {
                                id :2,
                                name: "MOCK descriptor 2",
                                procedureDescription: "This MOCK is described by...",
                                idSKU: 2
                            }
                        ];
                    }
                }
            });
        });

        test(describe_NAME, async () => {
            try {
                const result = await skuController.retrieveTestDescriptor(dao, request);
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });
    });
}

/**
 * Get all the SKUs in the database.
 * -----------------------------------------
 *         API: GET /api/skus
 * =========================================
 * @param {String} describe_NAME specific description of the MOCK run
 * @param {Array} expectedResult JSON Array containing the result of the query
 * @param {Boolean} triggerDatabaseError boolean value that indicates if the dao.all mock implementation should return an error
 * @param {Boolean} triggerUtilityFunctionError boolean value indicating the result of the utility function retrieveMOCKDescriptor
*/
function getStoredSKUs_MOCK(describe_NAME, expectedResult, triggerDatabaseError, triggerUtilityFunctionError) {
    describe('MOCK: getStoredSKUs()', () => {

        /* preparing mock database for MOCKing */
        beforeEach(() => {
            skuController.retrieveTestDescriptor = jest.fn().mockImplementation(() => {
                if (triggerUtilityFunctionError) {
                    throw new TypeError;
                } else {
                    return [1, 2, 3];
                }
            });
            dao.all.mockReset();
            dao.all.mockImplementation(() => {
                if (triggerDatabaseError) {
                    throw new TypeError('Internal Server Error');
                } else {
                    return [
                        {
                            id: 1,
                            description: "a new sku",
                            weight: 100,
                            volume: 50,
                            notes: "first SKU",
                            position: "800234523412",
                            availableQuantity: 50,
                            price: 10.99
                        },
                        {
                            id :2,
                            description: "another sku",
                            weight: 101,
                            volume: 60,
                            notes: "second SKU",
                            position: "800234543412",
                            availableQuantity: 55,
                            price: 10.99
                        }
                    ];
                }
            });
        });

        /* MOCKing the mock database created */
        test(describe_NAME, async () => {
            try {
                const result = await skuController.getStoredSKUs();
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });
    });
}

/**
 * Retrieve an SKU given its identifier ID
 * -----------------------------------------
 *         API: GET /api/skus/:id
 * =========================================
 * @param {String} describe_NAME specific description of the MOCK run
 * @param {JSON} params JSON Object containing the :id specified
 * @param {Array} expectedResult JSON Array containing the result of the query
 * @param {Boolean} triggerDatabaseError boolean value that indicates if the dao.all mock implementation should return an error
 * @param {Boolean} triggerNotFoundError Boolean value indicating if the :positionID is present in the DB
 * @param {Boolean} triggerUtilityFunctionError boolean value indicating the result of the utility function retrieveMOCKDescriptor
*/
function getStoredSKUById_MOCK(describe_NAME, params, expectedResult, triggerDatabaseError, triggerNotFoundError, triggerUtilityFunctionError) {
    describe('MOCK: getStoredSKUById()', () => {

        /* preparing mock database for MOCKing */
        beforeEach(() => {
            skuController.retrieveTestDescriptor = jest.fn().mockImplementation(() => {
                if (triggerUtilityFunctionError) {
                    throw new TypeError();
                } else {
                    return [1, 2, 3];
                }
            });
            dao.all.mockReset();
            dao.all.mockImplementation(() => {
                if (triggerDatabaseError) {
                    throw new TypeError('Internal Server Error');
                } else {
                    if (triggerNotFoundError) {
                        return [];
                    }
                    return [
                        {
                            id: 1,
                            description: "a new sku",
                            weight: 100,
                            volume: 50,
                            notes: "first SKU",
                            position: "800234523412",
                            availableQuantity: 50,
                            price: 10.99
                        }
                    ];
                }
            });
        });

        /* MOCKing the mock database created */
        test(describe_NAME, async () => {
            try {
                const result = await skuController.getStoredSKUById(params);
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });
    });
}

/**
 * Create a new SKU object and store it in the database.
 * -----------------------------------------------------
 *                API: POST /api/sku
 * =====================================================
 * @param {String} describe_NAME specific description of the MOCK run
 * @param {JSON} request JSON Object containing the SKUitem to add to the DB
 * @param {Array} expectedResult JSON Array containing the result of the query
 * @param {Boolean} triggerDatabaseError boolean value that indicates if the dao.all mock implementation should return an error
*/
function newSKU_MOCK(describe_NAME, request, expectedResult, triggerDatabaseError) {
    describe('MOCK: newSKU()', () => {

        /* preparing mock database for MOCKing */
        beforeEach(() => {
            dao.run.mockReset();
            dao.run.mockImplementation(() => {
                if (triggerDatabaseError) {
                    throw new TypeError('Service Unavailable');
                } else {
                    return;
                }
            });
        });

        /* MOCKing the mock database created */
        test(describe_NAME, async () => {
            try {
                const result = await skuController.newSKU(request);
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });

    });
}

/**
 * Modify an existing SKU. When a newAvailableQuantity is sent, occupiedWeight and 
 * occupiedVolume fields of the position (if the SKU is associated to a position) are 
 * modified according to the new available quantity.
 * -----------------------------------------------------
 *                 API: PUT /api/sku/:id
 * =====================================================
 * @param {String} describe_NAME specific description of the MOCK run
 * @param {JSON} params JSON Object containing the :id specified
 * @param {JSON} request JSON Object containing the SKUitem to add to the DB
 * @param {Array} expectedResult JSON Array containing the result of the query
 * @param {Array} triggerDatabaseError boolean values that indicate if the dao.all mock implementation should return an error
 * @param {Array} triggerNotFoundError Boolean values indicating if the :positionID is present in the DB
 * @param {Boolean} triggerNonExistingPosition Boolean value indicating if the SKU is associated to a position 
*/
function editSKU_MOCK(describe_NAME, params, request, expectedResult, triggerDatabaseError, triggerNotFoundError, triggerNonExistingPosition) {
    describe('MOCK: editSKU()', () => {

        /* preparing mock database for MOCKing */
        beforeEach(() => {
            dao.all.mockReset();
            dao.run.mockReset();

            dao.all.mockImplementationOnce(() => {
                if (triggerDatabaseError[0]) {
                    throw new TypeError('Service Unavailable');
                } else {
                    if (triggerNotFoundError[0]) {
                        return [];
                    } else {
                        if (triggerNonExistingPosition) {
                            return [
                                {
                                    id: 1,
                                    description: "a new sku",
                                    weight: 100,
                                    volume: 50,
                                    notes: "first SKU",
                                    position: null,
                                    availableQuantity: 50,
                                    price: 10.99
                                }
                            ];
                        } else {
                            return [
                                {
                                    id: 1,
                                    description: "a new sku",
                                    weight: 100,
                                    volume: 50,
                                    notes: "first SKU",
                                    position: "800234523412",
                                    availableQuantity: 50,
                                    price: 10.99
                                }
                            ];
                        }
                    }
                }
            }).mockImplementationOnce(() => {
                if (triggerDatabaseError[1]) {
                    throw new TypeError('Service Unavailable');
                } else {
                    if (triggerNotFoundError[1]) {
                        return [];
                    } else {
                        return [
                            {
                                positionID: "800234543412",
                                aisleID: "8002",
                                row: "3454",
                                col: "3412",
                                maxWeight: 1000,
                                maxVolume: 1000,
                                occupiedWeight: 300,
                                occupiedVolume: 150
                            }
                        ];
                    }
                } 
            });

            dao.run.mockImplementationOnce(() => {
                if (triggerDatabaseError[2]) {
                    throw new TypeError('Service Unavailable');
                }
                return;
            }).mockImplementationOnce(() => {
                if (triggerDatabaseError[3]) {
                    throw new TypeError('Service Unavailable');
                }
                return;
            });
        });
       
        /* MOCKing the mock database created */
        test(describe_NAME, async () => {
            try {
                const result = await skuController.editSKU(params, request);
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });
    });
}

/**
 * Add or modify position of a SKU. When a SKU is associated to a position,
 * occupiedWeight and occupiedVolume fields of the position are modified according to 
 * the available quantity.
 * -----------------------------------------------------
 *           API: PUT /api/sku/:id/position
 * =====================================================
 * @param {String} describe_NAME specific description of the MOCK run
 * @param {JSON} params JSON Object containing the :id specified
 * @param {JSON} request JSON Object containing the SKUitem to add to the DB
 * @param {Array} expectedResult JSON Array containing the result of the query
 * @param {Array} triggerDatabaseError boolean values that indicate if the dao.all mock implementation should return an error
 * @param {Array} triggerNotFoundError Boolean values indicating if the :positionID is present in the DB
 * @param {Boolean} triggerNonExistingPosition Boolean value indicating if the SKU is associated to a position 
 * @param {Boolean} triggerConstraintError Boolean value indicating if the SKU does not satisfy position constraints
*/
function addOrEditPositionSKU_MOCK(describe_NAME, params, request, expectedResult, triggerDatabaseError, triggerNotFoundError, triggerNonExistingPosition, triggerConstraintError) {
    describe('MOCK: addOrEditPositionSKU()', () => {

        /* preparing mock database for MOCKing */
        beforeEach(() => {
            dao.all.mockReset();
            dao.run.mockReset();

            dao.all.mockImplementationOnce(() => {
                if (triggerDatabaseError[0]) {
                    throw new TypeError('Service Unavailable');
                } else {
                    if (triggerNonExistingPosition[0]) {   
                        return [
                            {
                                id: 1,
                                description: "a new sku",
                                weight: 100,
                                volume: 50,
                                notes: "first SKU",
                                position: "800234523412",
                                availableQuantity: 50,
                                price: 10.99
                            }
                        ];
                    } else {
                        return [];
                    }
                }
            }).mockImplementationOnce(() => {
                if (triggerDatabaseError[1]) {
                    throw new TypeError('Service Unavailable');
                } else {
                    if (triggerNotFoundError[0]) {
                        return [];
                    } else {
                        if (triggerNonExistingPosition[1]) {
                            if (triggerConstraintError) {
                                return [
                                    {
                                        id: 1,
                                        description: "a new sku",
                                        weight: 999,
                                        volume: 999,
                                        notes: "first SKU",
                                        position: "800234523412",
                                        availableQuantity: 999,
                                        price: 10.99
                                    }
                                ];
                            } else {
                                return [
                                    {
                                        id: 1,
                                        description: "a new sku",
                                        weight: 20,
                                        volume: 20,
                                        notes: "first SKU",
                                        position: "800234523412",
                                        availableQuantity: 1,
                                        price: 10.99
                                    }
                                ];
                            }
                            
                        } else {
                            if (triggerConstraintError) {
                                return [
                                    {
                                        id: 1,
                                        description: "a new sku",
                                        weight: 999,
                                        volume: 999,
                                        notes: "first SKU",
                                        position: null,
                                        availableQuantity: 999,
                                        price: 10.99
                                    }
                                ];
                            } else {
                                return [
                                    {
                                        id: 1,
                                        description: "a new sku",
                                        weight: 20,
                                        volume: 20,
                                        notes: "first SKU",
                                        position: null,
                                        availableQuantity: 1,
                                        price: 10.99
                                    }
                                ];
                            }
                        }
                    }
                }
            }).mockImplementationOnce(() => {
                if (triggerDatabaseError[2]) {
                    throw new TypeError('Service Unavailable');
                } else {
                    if (triggerNotFoundError[1]) {
                        return [];
                    } else {
                        return [
                            {
                                positionID: "800234543412",
                                aisleID: "8002",
                                row: "3454",
                                col: "3412",
                                maxWeight: 1000,
                                maxVolume: 1000,
                                occupiedWeight: 300,
                                occupiedVolume: 150
                            }
                        ];
                    }
                }
            });
            
            dao.run.mockImplementationOnce(() => {
                if (triggerDatabaseError[3]) {
                    throw new TypeError('Service Unavailable');
                }
            }).mockImplementationOnce(() => {
                if (triggerDatabaseError[4]) {
                    throw new TypeError('Service Unavailable');
                }
            }).mockImplementationOnce(() => {
                if (triggerDatabaseError[5]) {
                    throw new TypeError('Service Unavailable');
                }
            });
        });
       
        /* MOCKing the mock database created */
        test(describe_NAME, async () => {
            try {
                const result = await skuController.addOrEditPositionSKU(params, request);
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });
    });
}

/**
 * Delete an SKU given its identifier ID
 * -----------------------------------------------------
 *             API: DELETE /api/skus/:id
 * =====================================================
 * @param {String} describe_NAME specific description of the MOCK run
 * @param {JSON} params JSON Object containing the :id specified
 * @param {Array} expectedResult JSON Array containing the result of the query
 * @param {Array} triggerDatabaseError boolean values that indicate if the dao.all mock implementation should return an error
 * @param {Boolean} triggerConstraintError Boolean value indicating if the SKU does not satisfy position constraints
 * @param {Boolean} triggerNonExistingPosition Boolean value indicating if the SKU is associated to a position 
 * @param {Boolean} triggerUtilityFunctionError boolean value indicating the result of the utility function retrieveMOCKDescriptor
*/
function deleteSKU_MOCK(describe_NAME, params, expectedResult, triggerDatabaseError, triggerConstraintError, triggerNonExistingPosition, triggerUtilityFunctionError) {
    describe('MOCK: deleteSKU()', () => {

        /* preparing mock database for MOCKing */
        beforeEach(() => {
            dao.all.mockReset();
            dao.run.mockReset();

            skuController.retrieveTestDescriptor = jest.fn().mockImplementation(() => {
                if (triggerUtilityFunctionError) {
                    return [1, 2, 3];
                } else {
                    return [];
                }
            });

            dao.all.mockImplementationOnce(() => {
                if (triggerDatabaseError[0]) {
                    throw new TypeError('Service Unavailable');
                } else {
                    if (triggerNonExistingPosition) {
                        return [
                            {
                                id: 1,
                                description: "a new sku",
                                weight: 100,
                                volume: 50,
                                notes: "first SKU",
                                position: null,
                                availableQuantity: 1,
                                price: 10.99
                            }
                        ];
                    } else {
                        return [
                            {
                                id: 1,
                                description: "a new sku",
                                weight: 100,
                                volume: 50,
                                notes: "first SKU",
                                position: "800234523412",
                                availableQuantity: 1,
                                price: 10.99
                            }
                        ];
                    }
                }
            }).mockImplementationOnce(() => {
                if (triggerDatabaseError[0]) {
                    throw new TypeError('Service Unavailable');
                } else {
                    if (triggerConstraintError) {
                        return [
                            {
                                RFID: "12345678901234567890123456789015",
                                SKUId: 1,
                                Available: 1,
                                DateOfStock: "2021/11/29 12:30"
                            }
                        ];
                    } else {
                        return [];
                    }
                }
            });

            dao.run.mockImplementationOnce(() => {
                if (triggerDatabaseError[1]) {
                    throw new TypeError('Service Unavailable');
                }
            }).mockImplementationOnce(() => {
                if (triggerDatabaseError[1]) {
                    throw new TypeError('Service Unavailable');
                }
            });
        });

        /* MOCKing the mock database created */
        test(describe_NAME, async () => {
            try {
                const result = await skuController.deleteSKU(params);
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });
    });
}