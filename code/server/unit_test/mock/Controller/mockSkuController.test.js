/**
 *  INTEGRATION TEST: SkuController
 *           VERSION: mocked
 * --------------------------------------------
 * Services do not access the database. All the
 * function implementations are mocked in order
 * to test all possible behaviors.
*/

/* --------- IMPORT MODULES --------- */
const SKUController         = require('../../../controller/SKUController');
const skuItemDAO            = require('../Database/mockSkuItemDAO');
const skuDAO                = require('../Database/mockSKUDAO');
const positionDAO           = require('../Database/mockPositionDAO');
const testDescriptorsDAO    = require('../Database/mockTestDescriptorDAO');

/* --------- INITIALIZATION --------- */
const skuController = new SKUController(skuDAO, testDescriptorsDAO, positionDAO, skuItemDAO);

/* --------- ERROR MESSAGES --------- */
const MESSG_200 = {code: 200, message: 'Ok'}
const MESSG_201 = {code: 201, message: 'Created'};
const MESSG_204 = {code: 204, message: 'No Content'};
const ERROR_404 = {code: 404, message: 'Not Found'};
const ERROR_422 = {code: 422, message: 'Unprocessable Entity'};


/*
    + -------------------- +
    |         DATA         |
    + -------------------- +
*/
const skuItemObjects = [
    {
        RFID: "12345678901234567890123456789014",
        SKUId: 1,
        DateOfStock: "2021/11/29 12:30",
    }, 
    {
        RFID: "12345678901234567890123456789015",
        SKUId: 2,
        DateOfStock: "2019/04/23 09:15",
    }
];

const positionsTestArray = [
    {
        positionID: "800234543412",
        aisleID: "8002",
        row: "3454",
        col: "3412",
        maxWeight: 1000,
        maxVolume: 1000,
        occupiedWeight: 10,
        occupiedVolume: 100
    }, {
        positionID: "100234543412",
        aisleID: "1002",
        row: "3454",
        col: "3412",
        maxWeight: 10000,
        maxVolume: 10000,
        occupiedWeight: 0,
        occupiedVolume: 0
    }, {
        positionID: "200234543412",
        aisleID: "2002",
        row: "3454",
        col: "3412",
        maxWeight: 100,
        maxVolume: 50,
        occupiedWeight: 0,
        occupiedVolume: 0
    }
];

const skusTestArray = [
    {
        id: 1,
        description: "a new sku",
        weight: 100,
        volume: 50,
        notes: "first SKU",
        position: "800234523412",
        availableQuantity: 2,
        price: 10.99,
        testDescriptors: [1, 2, 3]
    },
    {
        id: 2,
        description: "another sku",
        weight: 101,
        volume: 60,
        notes: "second SKU",
        position: null,
        availableQuantity: 55,
        price: 10.99,
        testDescriptors: [1, 2, 3]
    }
];

const skuItemsTestArray = [
    {
        RFID: "12345678901234567890123456789014",
        SKUId: 1,
        Available: 0,
        DateOfStock: "2021/11/29 12:30",
    }, {
        RFID: "12345678901234567890123456789015",
        SKUId: 1,
        Available: 1,
        DateOfStock: "2021/11/29 12:30"
    }, {
        RFID: "12345678901234567890123456789016",
        SKUId: 2,
        Available: 0,
        DateOfStock: "2019/01/29 09:00"
    }, {
        RFID: "12345678901234567890123456789017",
        SKUId: 3,
        Available: 0
    }
];


/*
    + -------------------- +
    |         TESTS        |
    + -------------------- +
*/

/**
 * INTEGRATION TEST: skuController.getStoredSKUs()
 * ========================================================================
 */
 describe('INTEGRATION TEST: skuController.getStoredSKUs', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        skuDAO.getSKUs.mockReset();
        testDescriptorsDAO.getTDIDbySKUid.mockReset();

        /* mocking implementation of skuDAO.getSKUs */
        skuDAO.getSKUs.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return skusTestArray;
        })

        /* mocking implementation of testDescriptorsDAO.getTDIDbySKUid */
        testDescriptorsDAO.getTDIDbySKUid.mockImplementation(() => {
            return [1, 2, 3];
        })
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testGetStoredSKUs_MOCK(
        '- Error: ',
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetStoredSKUs_MOCK(
        '- Success: ',
        {
            code: 200,
            message: skusTestArray
        }
    );
});

/**
 * INTEGRATION TEST: skuController.getStoredSKUById()
 * ========================================================================
 */
 describe('INTEGRATION TEST: skuController.getStoredSKUById', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        skuDAO.getSKUByID.mockReset();
        testDescriptorsDAO.getTDIDbySKUid.mockReset();

        /* mocking implementation of skuDAO.getSKUs */
        skuDAO.getSKUByID.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return undefined;
        }).mockImplementationOnce(() => {
            return skusTestArray[0];
        })

        /* mocking implementation of testDescriptorsDAO.getTDIDbySKUid */
        testDescriptorsDAO.getTDIDbySKUid.mockImplementation(() => {
            return [1, 2, 3];
        })
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testGetStoredSKUById_MOCK(
        '- Error: ',
        {id: skusTestArray[0].id},
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testGetStoredSKUById_MOCK(
        '- SKU not found: ',
        {id: skusTestArray[0].id},
        ERROR_404
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetStoredSKUById_MOCK(
        '- Success: ',
        {id: skusTestArray[0].id},
        {
            code: 200,
            message: skusTestArray[0]
        }
    );
});

/**
 * INTEGRATION TEST: skuController.newSKU()
 * ========================================================================
 */
 describe('INTEGRATION TEST: skuController.newSKU', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        skuDAO.newSKU.mockReset();

        /* mocking implementation of skuDAO.newSKU */
        skuDAO.newSKU.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return ;
        })
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testNewSKU_MOCK(
        '- Error: ',
        skusTestArray[0],
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testNewSKU_MOCK(
        '- Success: ',
        skusTestArray[0],
        MESSG_201
    );
});

/**
 * INTEGRATION TEST: skuController.editSKU()
 * ========================================================================
 */
 describe('INTEGRATION TEST: skuController.editSKU', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        skuDAO.getSKUByID.mockReset();
        skuDAO.updateSKU.mockReset();
        positionDAO.getPositionByID.mockReset();
        positionDAO.updatePositionQuantity.mockReset();

        /* mocking implementation of skuDAO.getSKUByID */
        skuDAO.getSKUByID.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return undefined;
        }).mockImplementationOnce(() => {
            return skusTestArray[1];
        }).mockImplementation(() => {
            return skusTestArray[0];
        });

        /* mocking implementation of skuDAO.updateSKU */
        skuDAO.updateSKU.mockImplementation(() => {
            return ;
        });

        /* mocking implementation of positionDAO.getPositionByID */
        positionDAO.getPositionByID.mockImplementationOnce(() => {
            return undefined;
        }).mockImplementation(() => {
            return positionsTestArray[2];
        });

        /* mocking implementation of positionDAO.updatePositionQuantity */
        positionDAO.updatePositionQuantity.mockImplementation(() => {
            return ;
        });
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testEditSKU_MOCK(
        '- Error: ',
        {id: skusTestArray[0]},
        skusTestArray[0],
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testEditSKU_MOCK(
        '- SKU not found: ',
        {id: 9999999},
        skusTestArray[0],
        ERROR_404
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testEditSKU_MOCK(
        '- Success (no associated position): ',
        {id: skusTestArray[0]},
        skusTestArray[0],
        MESSG_200
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testEditSKU_MOCK(
        '- Error (position does not exist): ',
        {id: skusTestArray[0]},
        skusTestArray[0],
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testEditSKU_MOCK(
        '- position constraints failed (on Weight): ',
        {id: skusTestArray[0]},
        {
            newWeight: 10000,
            newVolume: 1,
            newAvailableQuantity: 10
        },
        ERROR_422
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testEditSKU_MOCK(
        '- position constraints failed (on Volume): ',
        {id: skusTestArray[0]},
        {
            newWeight: 1,
            newVolume: 10000,
            newAvailableQuantity: 10
        },
        ERROR_422
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testEditSKU_MOCK(
        '- Success (with associated position): ',
        {id: skusTestArray[0]},
        {
            newWeight: 1,
            newVolume: 1,
            newAvailableQuantity: 10
        },
        MESSG_200
    );
});


/**
 * INTEGRATION TEST: skuController.addOrEditPositionSKU()
 * ========================================================================
 */
 describe('INTEGRATION TEST: skuController.addOrEditPositionSKU', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        skuDAO.getSKUByPositionID.mockReset();
        skuDAO.getSKUByID.mockReset();
        skuDAO.updateSKUpositionID.mockReset();
        positionDAO.getPositionByID.mockReset();
        positionDAO.updatePositionQuantity.mockReset();

        /* mocking implementation of skuDAO.getSKUByPositionID */
        skuDAO.getSKUByPositionID.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return skusTestArray[0];
        }).mockImplementation(() => {
            return undefined;
        });

        /* mocking implementation of skuDAO.getSKUByID */
        skuDAO.getSKUByID.mockImplementationOnce(() => {
            return undefined;
        }).mockImplementation(() => {
            return skusTestArray[0];
        });

        /* mocking implementation of positionDAO.getPositionByID */
        positionDAO.getPositionByID.mockImplementationOnce(() => {
            return undefined;
        }).mockImplementationOnce(() => {
            return positionsTestArray[2];
        }).mockImplementation(() => {
            return positionsTestArray[1];
        });

        /* mocking implementation of skuDAO.updateSKUpositionID */
        skuDAO.updateSKUpositionID.mockImplementation(() => {
            return ;
        });

        /* mocking implementation of positionDAO.updatePositionQuantity */
        positionDAO.updatePositionQuantity.mockImplementation(() => {
            return ;
        });
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testAddOrEditPositionSKU_MOCK(
        '- Error: ',
        {id: skusTestArray[0]},
        {position: positionsTestArray[0]},
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_422
     * ---------------------------------
     */
     testAddOrEditPositionSKU_MOCK(
        '- position already associated to a SKU: ',
        {id: skusTestArray[0]},
        {position: positionsTestArray[0]},
        ERROR_422
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testAddOrEditPositionSKU_MOCK(
        '- SKU not found: ',
        {id: skusTestArray[0]},
        {position: positionsTestArray[0]},
        ERROR_404
    );


    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testAddOrEditPositionSKU_MOCK(
        '- position not found: ',
        {id: skusTestArray[0]},
        {position: positionsTestArray[0]},
        ERROR_404
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_422
     * ---------------------------------
     */
     testAddOrEditPositionSKU_MOCK(
        '- position constraints failed (on Weight): ',
        {id: skusTestArray[0]},
        {position: positionsTestArray[0]},
        ERROR_422
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testAddOrEditPositionSKU_MOCK(
        '- Success: ',
        {id: skusTestArray[0]},
        {position: positionsTestArray[0]},
        MESSG_200
    );

});


/**
 * INTEGRATION TEST: skuController.deleteSKU()
 * ========================================================================
 */
 describe('INTEGRATION TEST: skuController.deleteSKU', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        skuDAO.getSKUByID.mockReset();
        skuDAO.deleteSKU.mockReset();
        positionDAO.updatePositionQuantity.mockReset();

        /* mocking implementation of skuDAO.getSKUByID */
        skuDAO.getSKUByID.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return skusTestArray[0];
        }).mockImplementation(() => {
            return undefined;
        });

        /* mocking implementation of positionDAO.updatePositionQuantity */
        positionDAO.updatePositionQuantity.mockImplementation(() => {
            return ;
        });

        /* mocking implementation of skuDAO.deleteSKU */
        skuDAO.deleteSKU.mockImplementation(() => {
            return ;
        });
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testDeleteSKU_MOCK(
        '- Error: ',
        {id: skusTestArray[0]},
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testDeleteSKU_MOCK(
        '- Success (with associated position): ',
        {id: skusTestArray[0]},
        MESSG_204
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testDeleteSKU_MOCK(
        '- Success (without associated position): ',
        {id: skusTestArray[0]},
        MESSG_204
    );

});





/*
    + -------------------- +
    |      FUNCTIONS       |
    + -------------------- +
*/
/**
 * INTEGRATION TEST: skuController.getStoredSKUs()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetStoredSKUs_MOCK(testName, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuController.getStoredSKUs();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: skuController.getStoredSKUById()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} params contains the identifier of the target SKU
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetStoredSKUById_MOCK(testName, params, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuController.getStoredSKUById(params);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: skuController.newSKU()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} body the new SKU object to be added to the DB
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testNewSKU_MOCK(testName, body, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuController.newSKU(body);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: skuController.editSKU()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} params contains the identifier of the target SKU
 * @param {Object} body the new SKU object to be added to the DB
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testEditSKU_MOCK(testName, params, body, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuController.editSKU(params, body);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: skuController.addOrEditPositionSKU()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} params contains the identifier of the target SKU
 * @param {Object} body the new Position object
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testAddOrEditPositionSKU_MOCK(testName, params, body, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuController.addOrEditPositionSKU(params, body);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: skuController.deleteSKU()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} params contains the identifier of the target SKU
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testDeleteSKU_MOCK(testName, params, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuController.deleteSKU(params);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}