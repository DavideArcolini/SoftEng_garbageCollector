/**
 *      MOCKING CLASS: SKUitem 
 * ==================================
 * 
*/

'use strict'

/* ------------ MODULE IMPORT ------------ */
const dao                   = require('../test_DB/mock_dao');
const SKUitemController     = require('../../controller/SKUitemController');

/* ------------ INITIALIZATION ------------ */
const skuItemController     = new SKUitemController(dao);



/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |            T E S T    R E S U L T S              |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/

/*
* -----------------------------------------
*           GET /api/skuitems
* =========================================
*/
getSKUitems_MOCK(
    '[200] OK',
    {
        code: 200,
        message: [
            {
                RFID: "12345678901234567890123456789014",
                SKUId: 1,
                Available: 0,
                DateOfStock: "2021/11/29 12:30",
            },
            {
                RFID: "12345678901234567890123456789015",
                SKUId: 1,
                Available: 1,
                DateOfStock: "2021/11/29 12:30"
            }
        ]
    },
    0
);
getSKUitems_MOCK(
    'TypeError: Internal Server Error',
    TypeError,
    1
);

/*
* -----------------------------------------
*      API: GET /api/skuitems/sku/:id
* =========================================
*/
getSKUitemsBySKUId_MOCK(
    '[200] OK',
    {id: 1},
    {
        code: 200,
        message: [
            {
                RFID: "12345678901234567890123456789014",
                SKUId: 1,
                DateOfStock: "2021/11/29 12:30"
            },
            {
                RFID: "12345678901234567890123456789015",
                SKUId: 1,
                DateOfStock: "2021/11/29 12:30"
            }
        ]
    },
    [0, 0],
    0
);
getSKUitemsBySKUId_MOCK(
    '[404] Not Found',
    {id: 9999},
    {
        code: 404,
        message: "Not Found"
    },
    [0, 0],
    1
);
getSKUitemsBySKUId_MOCK(
    'TypeError: Internal Server Error',
    {id: 1},
    TypeError,
    [1, 0],
    0
);
getSKUitemsBySKUId_MOCK(
    'TypeError: Internal Server Error',
    {id: 1},
    TypeError,
    [0, 1],
    0
);

/*
* -----------------------------------------
*      API: GET /api/skuitems/:rfid
* =========================================
*/
getSKUitemsByRFID_MOCK(
    '[200] OK',
    {rfid: "12345678901234567890123456789015"},
    {
        code: 200,
        message: {
            RFID: "12345678901234567890123456789015",
            SKUId: 1,
            Available: 1,
            DateOfStock: "2021/11/29 12:30"
        }
    },
    0, 
    0
);
getSKUitemsByRFID_MOCK(
    '[404] Not Found',
    {rfid: "99999999999999999999999999999999"},
    {
        code: 404,
        message: "Not Found"
    },
    0, 
    1
);
getSKUitemsByRFID_MOCK(
    'TypeError: Internal Server Error',
    {rfid: "12345678901234567890123456789015"},
    TypeError,
    1, 
    0
);

/*
* -----------------------------------------
*          API: POST /api/skuitem
* =========================================
*/
newSKUitem_MOCK(
    '[201] Created',
    {
        RFID: "12345678901234567890123456789015",
        SKUId: 1,
        DateOfStock: "2021/11/29 12:30"
    },
    {
        code: 201,
        message: "CREATED"
    }, 
    [0, 0],
    0
);
newSKUitem_MOCK(
    '[201] Created (no DateOfStock)',
    {
        RFID: "12345678901234567890123456789015",
        SKUId: 1
    },
    {
        code: 201,
        message: "CREATED"
    }, 
    [0, 0],
    0
);
newSKUitem_MOCK(
    '[404] no SKU associated to SKUId',
    {
        RFID: "12345678901234567890123456789015",
        SKUId: 99999999999,
        DateOfStock: "2021/11/29 12:30"
    },
    {
        code: 404,
        message: "Not Found"
    }, 
    [0, 0],
    1
);
newSKUitem_MOCK(
    'TypeError: SELECT from table SKUS failed',
    {
        RFID: "12345678901234567890123456789015",
        SKUId: 1,
        DateOfStock: "2021/11/29 12:30"
    },
    TypeError, 
    [1, 0],
    0
);
newSKUitem_MOCK(
    'TypeError: INSERT into table SKUITEMS failed',
    {
        RFID: "12345678901234567890123456789015",
        SKUId: 1,
        DateOfStock: "2021/11/29 12:30"
    },
    TypeError, 
    [0, 1],
    0
);


/*
* -----------------------------------------
*      API: PUT /api/skuitems/:rfid
* =========================================
*/
editSKUitem_MOCK(
    '[200] OK',
    {rfid: 12345678901234567890123456789015},
    {
        newRFID: "12345678901234567890123456789015",
        newAvailable: 1,
        newDateOfStock: "2021/11/29 12:30"
    }, 
    {
        code: 200,
        message: "OK"
    },
    [0, 0],
    0
);
editSKUitem_MOCK(
    '[404] no SKU Item associated to rfid',
    {rfid: 99999999999999999999999999999999},
    {
        newRFID: "12345678901234567890123456789015",
        newAvailable: 1,
        newDateOfStock: "2021/11/29 12:30"
    }, 
    {
        code: 404,
        message: "Not Found"
    },
    [0, 0],
    1
);
editSKUitem_MOCK(
    'TypeError: SELECT from table SKUITEMS failed',
    {rfid: 12345678901234567890123456789015},
    {
        newRFID: "12345678901234567890123456789015",
        newAvailable: 1,
        newDateOfStock: "2021/11/29 12:30"
    }, 
    TypeError,
    [1, 0],
    0
);
editSKUitem_MOCK(
    'TypeError: UPDATE table SKUITEMS failed',
    {rfid: 12345678901234567890123456789015},
    {
        newRFID: "12345678901234567890123456789015",
        newAvailable: 1,
        newDateOfStock: "2021/11/29 12:30"
    }, 
    TypeError,
    [0, 1],
    0
);

/*
* -----------------------------------------
*      API: DELETE /api/skuitems/:rfid
* =========================================
*/
deleteSKUitem_MOCK(
    '[204] No Content',
    {rfid: 12345678901234567890123456789015},
    {
        code: 204,
        message: "NO CONTENT"
    },
    0
);
deleteSKUitem_MOCK(
    'TypeErroR: DELETE from table SKUITEMS failed',
    {rfid: 12345678901234567890123456789015},
    TypeError,
    1
);






/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |          T E S T    F U N C T I O N S            |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/
/**
 * Return an array containing all SKU items.
 * -----------------------------------------
 *         API: /api/skuitems
 * =========================================
 * @param {String} describe_NAME specific description of the MOCK run
 * @param {Array} expectedResult JSON Array containing the result of the query
 * @param {Boolean} triggerDatabaseError boolean value that indicates if the dao.all mock implementation should return an error
*/
function getSKUitems_MOCK(describe_NAME, expectedResult, triggerDatabaseError) {
    describe('MOCK: getSKUitems()', () => {

        /* preparing mock database for MOCKing */
        beforeEach(() => {
            dao.all.mockReset();
            if (triggerDatabaseError) {
                dao.all.mockImplementation(() => {
                    throw new TypeError('Internal Server Error');
                });
            } else {
                dao.all.mockReturnValue([
                    {
                        RFID: "12345678901234567890123456789014",
                        SKUId: 1,
                        Available: 0,
                        DateOfStock: "2021/11/29 12:30",
                    },
                    {
                        RFID: "12345678901234567890123456789015",
                        SKUId: 1,
                        Available: 1,
                        DateOfStock: "2021/11/29 12:30"
                    }
                ]);
            }
        });

        /* MOCKing the mock database created */
        test(describe_NAME, async () => {
            try {
                const result = await skuItemController.getSKUitems();
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });
    });
}

/**
 * Return an array containing all SKU items for a certain SKUId 
 * with Available = 1.
 * --------------------------------------------------------------
 *               API: GET /api/skuitems/sku/:id
 * ==============================================================
 * @param {String} describe_NAME specific description of the MOCK run
 * @param {JSON} params JSON Object containing the :id specified
 * @param {Array} expectedResult JSON Array containing the result of the query
 * @param {Array} triggerDatabaseError Array of values that indicates if the dao.all mock implementation should return an error
 * @param {Boolean} triggerNotFoundError Boolean value indicating if the :positionID is present in the DB
*/
function getSKUitemsBySKUId_MOCK(describe_NAME, params, expectedResult, triggerDatabaseError, triggerNotFoundError) {
    describe('MOCK: getSKUitemsBySKUId()', () => {

        /* preparing mock database for MOCKing */
        beforeEach(() => {
            dao.all.mockReset();

            dao.all.mockImplementationOnce(() => {
                if (triggerDatabaseError[0]) {
                    throw new TypeError('Internal Server Error');
                } else {
                    if (triggerNotFoundError) {
                        return [];
                    } else {
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
                                MOCKDescriptors: [1,3,4]
                            }
                        ];
                    }
                }
            }).mockImplementationOnce(() => {
                if (triggerDatabaseError[1]) {
                    throw new TypeError('Internal Server Error');
                } else {
                    return [
                        {
                            RFID: "12345678901234567890123456789014",
                            SKUId: 1,
                            DateOfStock: "2021/11/29 12:30"
                        },
                        {
                            RFID: "12345678901234567890123456789015",
                            SKUId: 1,
                            DateOfStock: "2021/11/29 12:30"
                        }
                    ];
                }
            });
        });

        /* MOCKing the mock database created */
        test(describe_NAME, async () => {
            try {
                const result = await skuItemController.getSKUitemsBySKUId(params);
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });
    });
}

/**
 * Return a SKU item, given its RFID.
 * --------------------------------------------------------------
 *                API: GET /api/skuitems/:rfid
 * ==============================================================
 * @param {String} describe_NAME specific description of the MOCK run
 * @param {JSON} params JSON Object containing the :id specified
 * @param {Array} expectedResult JSON Array containing the result of the query
 * @param {Boolean} triggerDatabaseError Boolean value that indicates if the dao.all mock implementation should return an error
 * @param {Boolean} triggerNotFoundError Boolean value indicating if the :positionID is present in the DB
*/
function getSKUitemsByRFID_MOCK(describe_NAME, params, expectedResult, triggerDatabaseError, triggerNotFoundError) {
    describe('MOCK: getSKUitemsByRFID()', () => {

        /* preparing mock database for MOCKing */
        beforeEach(() => {
            dao.all.mockReset();
            dao.all.mockImplementation(() => {
                if (triggerDatabaseError) {
                    throw new TypeError('Internal Server Error');
                } else {
                    if (triggerNotFoundError) {
                        return [];
                    } else {
                        return {
                            RFID: "12345678901234567890123456789015",
                            SKUId: 1,
                            Available: 1,
                            DateOfStock: "2021/11/29 12:30"
                        };
                    }
                }
            });
        });

        /* MOCKing the mock database created */
        test(describe_NAME, async () => {
            try {
                const result = await skuItemController.getSKUitemsByRFID(params);
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });
    });
}

/**
 * Creates a new SKU item with Available = 0.
 * ---------------------------------------------------------
 *                 API: POST /api/skuitem
 * =========================================================
 * @param {String} describe_NAME specific description of the MOCK run
 * @param {JSON} request JSON Object containing the SKUitem to add to the DB
 * @param {JSON} expectedResult JSON object returned by the function
 * @param {Boolean} triggerDatabaseError boolean value that indicates if the dao.all mock implementation should return an error
 * @param {Boolean} triggerNotFoundError Boolean value indicating if the :positionID is present in the DB
*/
function newSKUitem_MOCK(describe_NAME, request, expectedResult, triggerDatabaseError, triggerNotFoundError) {
    describe('MOCK: newSKUitem()', () => {

        /* preparing mock database for MOCKing */
        beforeEach(() => {
            dao.run.mockReset();
            dao.all.mockReset();
            
            dao.all.mockImplementationOnce(() => {
                if (triggerDatabaseError[0]) {
                    throw new TypeError('Service Unavailable');
                } else {
                    if (triggerNotFoundError) {
                        return [];
                    } else {
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
                                MOCKDescriptors: [1,3,4]
                            }
                        ];
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

        test(describe_NAME, async () => {
            try {
                const result = await skuItemController.newSKUitem(request);
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });
    });
}

/**
 * Modify RFID, available and date of stock fields of an 
 * existing SKU Item.
 * ---------------------------------------------------------
 *             API: PUT /api/skuitems/:rfid
 * =========================================================
 * @param {String} describe_NAME specific description of the MOCK run
 * @param {JSON} param JSON Object containing the :rfid of the skuitem to modify
 * @param {JSON} request JSON Object containing the SKUitem to add to the DB
 * @param {JSON} expectedResult JSON object returned by the function
 * @param {Boolean} triggerDatabaseError boolean value that indicates if the dao.all mock implementation should return an error
 * @param {Boolean} triggerNotFoundError Boolean value indicating if the :positionID is present in the DB
*/
function editSKUitem_MOCK(describe_NAME, params, request, expectedResult, triggerDatabaseError, triggerNotFoundError) {
    describe('MOCK: editSKUitem()', () => {

        /* preparing mock database for MOCKing */
        beforeEach(() => {
            dao.run.mockReset();
            dao.all.mockReset();
            
            dao.all.mockImplementationOnce(() => {
                if (triggerDatabaseError[0]) {
                    throw new TypeError('Service Unavailable');
                } else {
                    if (triggerNotFoundError) {
                        return [];
                    } else {
                        return [
                            {
                                RFID: "12345678901234567890123456789015",
                                SKUId: 1,
                                Available: 1,
                                DateOfStock: "2021/11/29 12:30"
                            }
                        ];
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

        test(describe_NAME, async () => {
            try {
                const result = await skuItemController.editSKUitem(params, request);
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });
    });
}

/**
 * Delete a SKU item receiving his rfid.
 * --------------------------------------------------------------
 *                API: DELETE /api/skuitems/:rfid
 * ==============================================================
 * @param {String} describe_NAME specific description of the MOCK run
 * @param {JSON} params JSON Object containing the :id specified
 * @param {Array} expectedResult JSON Array containing the result of the query
 * @param {Boolean} triggerDatabaseError Boolean value that indicates if the dao.all mock implementation should return an error
*/
function deleteSKUitem_MOCK(describe_NAME, params, expectedResult, triggerDatabaseError) {
    describe('MOCK: deleteSKUitem()', () => {

        /* preparing mock database for MOCKing */
        beforeEach(() => {
            dao.run.mockReset();
            dao.run.mockImplementation(() => {
                if (triggerDatabaseError) {
                    throw new TypeError('Internal Server Error');
                } else {
                    return;
                }
            });
        });

        /* MOCKing the mock database created */
        test(describe_NAME, async () => {
            try {
                const result = await skuItemController.deleteSKUitem(params);
                expect(result).toEqual(expectedResult);
            } catch (error) {
                expect(error).toBeInstanceOf(expectedResult);
            }
        });
    });
}