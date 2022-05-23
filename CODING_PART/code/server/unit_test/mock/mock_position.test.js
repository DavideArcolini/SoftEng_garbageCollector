/**
 *      TESTING CLASS: POSITION 
 * ==================================
 * 
*/

'use strict'

/* ------------ MODULE IMPORT ------------ */
const dao                   = require('../test_DB/mock_dao');
const PositionController    = require('../../controller/PositionController');

/* ------------ INITIALIZATION ------------ */
const position              = new PositionController(dao);



/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |            T E S T    R E S U L T S              |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/

/*
* -----------------------------------------
*         API: GET /api/positions 
* =========================================
*/
getPositions_TEST(
    '[200] OK', 
    [
        {
            positionID: "800234543412",
            aisleID: "8002",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 300,
            occupiedVolume: 150
        }, 
        {
            positionID: "801234543412",
            aisleID: "8012",
            row: "3454",
            col: "3412",
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 300,
            occupiedVolume: 150
        }
    ], 
    false   /* triggerDatabaseError */
);
getPositions_TEST(
    'TypeError: Internal Server Error', 
    TypeError,
    true    /* triggerDatabaseError */
);

/**
 * ---------------------------------------------------------
 *                 API: POST /api/position
 * =========================================================
 */
newPosition_TEST(
    '[201] Created',
    {
        positionID: "800234543412",
        aisleID: "8002",
        row: "3454",
        col: "3412",
        maxWeight: 1000,
        maxVolume: 1000
    }, 
    {
        code: 201,
        message: "CREATED"
    },
    false    /* triggerDatabaseError */
);

newPosition_TEST(
    'TypeError: Internal Server Error',
    {
        positionID: "800234543412",
        aisleID: "8002",
        row: "3454",
        col: "3412",
        maxWeight: 1000,
        maxVolume: 1000
    }, 
    TypeError,
    true    /* triggerDatabaseError */
);

/*
* -----------------------------------------
*      PUT /api/position/:positionID
* =========================================
*/
editPosition_TEST(
    '[200] OK',
    {positionID: "801234543412"},
    {
        "newAisleID": "3002",
        "newRow": "1114",
        "newCol": "1112",
        "newMaxWeight": 1200,
        "newMaxVolume": 600,
        "newOccupiedWeight": 200,
        "newOccupiedVolume":100
    },
    {
        code: 200,
        message: "OK"
    },
    [0, 0, 0],   /* triggerDatabaseError[] */
    [0, 0]       /* triggerNotFoundError */
);
editPosition_TEST(
    '[200] OK (no SKU.position updated)',
    {positionID: "801234543412"},
    {
        "newAisleID": "3002",
        "newRow": "1114",
        "newCol": "1112",
        "newMaxWeight": 1200,
        "newMaxVolume": 600,
        "newOccupiedWeight": 200,
        "newOccupiedVolume":100
    },
    {
        code: 200,
        message: "OK"
    },
    [0, 0, 0],   /* triggerDatabaseError[] */
    [0, 1]       /* triggerNotFoundError */
);
editPosition_TEST(
    '[404] Not Found',
    {positionID: "801234543412"},
    {
        "newAisleID": "3002",
        "newRow": "1114",
        "newCol": "1112",
        "newMaxWeight": 1200,
        "newMaxVolume": 600,
        "newOccupiedWeight": 200,
        "newOccupiedVolume":100
    },
    {
        code: 404,
        message: "Not Found"
    },
    [0, 0, 0],   /* triggerDatabaseError[] */
    [1, 0]       /* triggerNotFoundError */
);
editPosition_TEST(
    '[422] Unprocessable Entity',
    {positionID: "801234543412"},
    {
        "newAisleID": "3002",
        "newRow": "1114",
        "newCol": "1112",
        "newMaxWeight": 1,
        "newMaxVolume": 1,
        "newOccupiedWeight": 0,
        "newOccupiedVolume":0
    },
    {
        code: 422,
        message: "Unprocessable Entity"
    },
    [0, 0, 0],   /* triggerDatabaseError[] */
    [0, 0]       /* triggerNotFoundError */
);
editPosition_TEST(
    'TypeError: SELECT from table POSITIONS failed',
    {positionID: "801234543412"},
    {
        "newAisleID": "3002",
        "newRow": "1114",
        "newCol": "1112",
        "newMaxWeight": 1200,
        "newMaxVolume": 600,
        "newOccupiedWeight": 200,
        "newOccupiedVolume":100
    },
    TypeError,
    [1, 0, 0],   /* triggerDatabaseError[] */
    [0, 0]       /* triggerNotFoundError */
);
editPosition_TEST(
    'TypeError: SELECT from table SKUS failed',
    {positionID: "801234543412"},
    {
        "newAisleID": "3002",
        "newRow": "1114",
        "newCol": "1112",
        "newMaxWeight": 1200,
        "newMaxVolume": 600,
        "newOccupiedWeight": 200,
        "newOccupiedVolume":100
    },
    TypeError,
    [0, 1, 0],   /* triggerDatabaseError[] */
    [0, 0]       /* triggerNotFoundError */
);
editPosition_TEST(
    'TypeError: UPDATE table POSITIONS failed',
    {positionID: "801234543412"},
    {
        "newAisleID": "3002",
        "newRow": "1114",
        "newCol": "1112",
        "newMaxWeight": 1200,
        "newMaxVolume": 600,
        "newOccupiedWeight": 200,
        "newOccupiedVolume":100
    },
    TypeError,
    [0, 0, 1],   /* triggerDatabaseError[] */
    [0, 0]       /* triggerNotFoundError */
);

/*
* ------------------------------------------------
*      PUT /api/position/:positionID/changeID
* ================================================
*/
editPositionID_TEST(
    '[200] OK',
    {positionID: "801234543412"},
    {newPositionID: "800234543412"},
    {
        code: 200,
        message: "OK"
    },
    [0, 0, 0],   /* triggerDatabaseError[] */
    0,           /* triggerNotFoundError */
    0            /* updateSKU */
);
editPositionID_TEST(
    '[200] OK (no SKU.position update)',
    {positionID: "801234543412"},
    {newPositionID: "800234543412"},
    {
        code: 200,
        message: "OK"
    },
    [0, 0, 0],   /* triggerDatabaseError[] */
    0,           /* triggerNotFoundError */
    1            /* updateSKU */
);
editPositionID_TEST(
    '[404] Not Found',
    {positionID: "222222222222"},
    {newPositionID: "800234543412"},
    {
        code: 404,
        message: "Not Found"
    },
    [0, 0, 0],   /* triggerDatabaseError[] */
    1,           /* triggerNotFoundError */
    0            /* updateSKU */
);
editPositionID_TEST(
    'TypeError: SELECT from table POSITIONS failed',
    {positionID: "800234543412"},
    {newPositionID: "800234543412"},
    TypeError,
    [1, 0, 0],   /* triggerDatabaseError[] */
    0,           /* triggerNotFoundError */
    0            /* updateSKU */
);
editPositionID_TEST(
    'TypeError: UPDATE table POSITIONS failed',
    {positionID: "800234543412"},
    {newPositionID: "800234543412"},
    TypeError,
    [0, 1, 0],   /* triggerDatabaseError[] */
    0,           /* triggerNotFoundError */
    0            /* updateSKU */
);
editPositionID_TEST(
    'TypeError: SELECT from table SKUS failed',
    {positionID: "800234543412"},
    {newPositionID: "800234543412"},
    TypeError,
    [0, 0, 1],   /* triggerDatabaseError[] */
    0,           /* triggerNotFoundError */
    0            /* updateSKU */
);


/*
* -----------------------------------------
*      DELETE /api/position/:positionID
* =========================================
*/
deletePosition_TEST(
    '[204] No Content',
    {
        positionID: "800234543412"
    },
    {
        code: 204, 
        message: "NO CONTENT"
    },
    false    /* triggerDatabaseError */
);
deletePosition_TEST(
    'TypeError: DELETE from table POSITIONS failed',
    {
        positionID: "800234543412"
    },
    TypeError,
    true    /* triggerDatabaseError */
);










/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |          T E S T    F U N C T I O N S            |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/


/**
 * Return an array containing all positions.
 * -----------------------------------------
 *         API: GET /api/positions 
 * =========================================
 * @param {String} describe_NAME specific description of the test run
 * @param {Array} expectedResult JSON Array containing the result of the query
 * @param {Boolean} triggerDatabaseError boolean value that indicates if the dao.all mock implementation should return an error
*/
function getPositions_TEST(describe_NAME, expectedResult, triggerDatabaseError) {
    describe('TEST: getPositions()', () => {

        /* preparing mock database for testing */
        beforeEach(() => {
            if (triggerDatabaseError) {
                dao.all.mockReset();
                dao.all.mockImplementation(() => {
                    throw new TypeError('Internal Server Error');
                });
            } else {
                dao.all.mockReset();
                dao.all.mockReturnValue([
                    {
                        positionID: "800234543412",
                        aisleID: "8002",
                        row: "3454",
                        col: "3412",
                        maxWeight: 1000,
                        maxVolume: 1000,
                        occupiedWeight: 300,
                        occupiedVolume: 150
                    }, 
                    {
                        positionID: "801234543412",
                        aisleID: "8012",
                        row: "3454",
                        col: "3412",
                        maxWeight: 1000,
                        maxVolume: 1000,
                        occupiedWeight: 300,
                        occupiedVolume: 150
                    }
                ]);
            }
        });

        /* testing the mock database created */
        test(describe_NAME, async () => {
            try {
                const result = await position.getPositions();   
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });
    });
}

/**
 * Create a new Position object and store it in the database
 * ---------------------------------------------------------
 *                 API: POST /api/position
 * =========================================================
 * @param {String} describe_NAME specific description of the test run
 * @param {JSON} request JSON Object containing the position to add to the DB
 * @param {JSON} expectedResult JSON object returned by the function
 * @param {Boolean} triggerDatabaseError boolean value that indicates if the dao.all mock implementation should return an error
*/
function newPosition_TEST(describe_NAME, request, expectedResult, triggerDatabaseError) {
    describe('TEST: newPosition()', () => {

        /* preparing mock database for testing */
        beforeEach(() => {
            dao.run.mockReset();
            if (triggerDatabaseError) {
                dao.run.mockImplementation(() => {
                    throw new TypeError('Internal Server Error');
                });
            }
        });

        test(describe_NAME, async () => {
            try {
                const result = await position.newPosition(request);
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });
    });
}

/**
 * Modify a position identified by positionID
 * ------------------------------------------
 *      API: PUT /api/position/:positionID
 * ==========================================
 * @param {String} describe_NAME specific description of the test run
 * @param {JSON} params JSON Object containing the :positionID parameter
 * @param {JSON} request JSON Object containing the position to add to the DB
 * @param {JSON} expectedResult JSON object returned by the function
 * @param {Array} triggerDatabaseError array of values that indicate if the dao.all mock implementation should return an error
 * @param {Boolean} triggerNotFoundError Boolean value indicating if the :positionID is present in the DB
*/
function editPosition_TEST(describe_NAME, params, request, expectedResult, triggerDatabaseError, triggerNotFoundError) {
    describe('TEST: editPosition()', () => {
        
        /* preparing mock database for testing */
        beforeEach(() => {
            dao.all.mockReset();
            dao.run.mockReset();

            dao.all.mockImplementationOnce(() => {
                if (triggerDatabaseError[0]) {
                    throw new TypeError('Service Unavailable');
                } else {
                    if (triggerNotFoundError[0]) {
                        return [];
                    }
                    return [
                        {
                            positionID: "801234543412",
                            aisleID: "8012",
                            row: "3454",
                            col: "3412",
                            maxWeight: 9999,
                            maxVolume: 9999,
                            occupiedWeight: 300,
                            occupiedVolume: 150
                        }
                    ];
                }
            }).mockImplementationOnce(() => {
                if (triggerDatabaseError[1]) {
                    throw new TypeError('Service Unavailable');
                } else {
                    if (triggerNotFoundError[1]) {
                        return [];
                    }
                    return [
                        {
                            id: 1,
                            description: "a new sku",
                            weight: 9,
                            volume: 9,
                            notes: "first SKU",
                            position: "800234523412",
                            availableQuantity: 50,
                            price: 10.99,
                            testDescriptors: [1,3,4]
                        }
                    ];
                }
            });

            dao.run.mockImplementation(() => {
                if (triggerDatabaseError[2]) {
                    throw new TypeError('Service Unavailable');
                } else {
                    return;
                }
            });
        });

        /* testing the mock database created */
        test(describe_NAME, async () => {
            try {
                const result = await position.editPosition(params, request);
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });
    });
}

/**
 * Modify the positionID of a position position, given its old positionID.
 * -----------------------------------------------------------------------
 *                API: PUT /api/position/:positionID/changeID
 * =======================================================================
 * @param {String} describe_NAME specific description of the test run
 * @param {JSON} params JSON Object containing the :positionID parameter
 * @param {JSON} request JSON Object containing the position to add to the DB
 * @param {JSON} expectedResult JSON object returned by the function
 * @param {Array} triggerDatabaseError array of values that indicate if the dao.all mock implementation should return an error
 * @param {Boolean} triggerNotFoundError Boolean value indicating if the :positionID is present in the DB
 * @param {Boolean} updateSKU Boolean value that indicates if the position is associated to an SKU or not
*/
function editPositionID_TEST(describe_NAME, params, request, expectedResult, triggerDatabaseError, triggerNotFoundError, updateSKU) {
    describe('TEST: editPositionID()', () => {

        /* preparing mock database for testing */
        beforeEach(() => {
            dao.all.mockReset();
            dao.run.mockReset();

            dao.all.mockImplementationOnce(() => {
                if (triggerDatabaseError[0]) {
                    throw new TypeError('Service Unavailable');
                } else {
                    if (triggerNotFoundError) {
                        return [];
                    }
                    return [
                        {
                            positionID: "801234543412",
                            aisleID: "8012",
                            row: "3454",
                            col: "3412",
                            maxWeight: 9999,
                            maxVolume: 9999,
                            occupiedWeight: 300,
                            occupiedVolume: 150
                        }
                    ];
                }
            }).mockImplementationOnce(() => {
                if (triggerDatabaseError[2]) {
                    throw new TypeError('Service Unavailable');
                } else {
                    if (!updateSKU) {
                        return [
                            {
                                id: 1,
                                description: "a new sku",
                                weight: 9,
                                volume: 9,
                                notes: "first SKU",
                                position: "801234543412",
                                availableQuantity: 50,
                                price: 10.99,
                                testDescriptors: [1,3,4]
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
                } else {
                    return;
                }
            });
        });

        /* testing the mock database created */
        test(describe_NAME, async () => {
            try {
                const result = await position.editPositionID(params, request);
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        })
    });
}


/**
 * Delete a position given its identifier ID
 * ------------------------------------------
 *      API: DELETE /api/position/:id
 * ==========================================
 * @param {String} describe_NAME specific description of the test run
 * @param {JSON} request position object passed indicating the object to remove
 * @param {JSON} expectedResult JSON object returned by the function
 * @param {Boolean} triggerDatabaseError boolean value that indicates if the dao.all mock implementation should return an error
*/
function deletePosition_TEST(describe_NAME, request, expectedResult, triggerDatabaseError) {
    describe('TEST deletePosition()', () => {

        /* preparing mock database for testing */
        beforeEach(() => {
            dao.run.mockReset();
            if (triggerDatabaseError) {
                dao.run.mockImplementation(() => {
                    throw new TypeError('Internal Server Error');
                });
            } 
        });

        /* testing the mock database created */
        test(describe_NAME, async () => {
            try {
                const result = await position.deletePosition(request);
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });
    });
}

