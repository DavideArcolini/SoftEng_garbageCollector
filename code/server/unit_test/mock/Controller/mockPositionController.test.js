/**
 *  INTEGRATION TEST: positionController
 *           VERSION: mocked
 * --------------------------------------------
 * Services do not access the database. All the
 * function implementations are mocked in order
 * to test all possible behaviors.
*/

/* --------- IMPORT MODULES --------- */
const PositionController    = require('../../../controller/PositionController');
const positionDAO           = require('../Database/mockPositionDAO');
const skuDAO                = require('../Database/mockSKUDAO');

/* --------- INITIALIZATION --------- */
const positionController    = new PositionController(positionDAO, skuDAO);

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
const positionObject = [
    {
        newPositionID: "800234543412",
        newAisleID: "8002",
        newRow: "3454",
        newCol: "3412",
        newMaxWeight: 100,
        newMaxVolume: 5000
    }, {
        newPositionID: "800234543412",
        newAisleID: "8002",
        newRow: "3454",
        newCol: "3412",
        newMaxWeight: 1000,
        newMaxVolume: 50
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
        maxWeight: 50,
        maxVolume: 50,
        occupiedWeight: 3654,
        occupiedVolume: 2134
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
        testDescriptors: [1, 3, 4]
    },
    {
        id: 2,
        description: "another sku",
        weight: 101,
        volume: 60,
        notes: "second SKU",
        position: "800234543411",
        availableQuantity: 55,
        price: 10.99,
        testDescriptors: [2, 5, 7]
    }

];



/*
    + -------------------- +
    |         TESTS        |
    + -------------------- +
*/

/**
 * INTEGRATION TEST: PositionController.getPositions()
 * ========================================================================
 */
describe('INTEGRATION TEST: PositionController.getPositions', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {
        positionDAO.getPositions.mockReset();
        positionDAO.getPositions.mockImplementationOnce(() => {
            return positionsTestArray;
        }).mockImplementationOnce(() => {
            throw new Error();
        })
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
    testGetPositions_MOCK(
        '- Success: ',
        {
            code: 200,
            message: positionsTestArray
        }
    );
    
    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
    testGetPositions_MOCK(
        '- Error: ',
        Error
    );

});

/**
 * INTEGRATION TEST: PositionController.newPosition()
 * ========================================================================
 */
 describe('INTEGRATION TEST: PositionController.newPosition', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {
        positionDAO.newPosition.mockReset();
        positionDAO.newPosition.mockImplementationOnce(() => {
            return ;
        }).mockImplementationOnce(() => {
            throw new Error();
        })
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
    testNewPosition_MOCK(
        '- Success: ',
        positionObject[0],
        MESSG_201
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
    testNewPosition_MOCK(
        '- Error: ',
        positionObject[0],
        Error
    );

});

/**
 * INTEGRATION TEST: PositionController.editPosition()
 * ========================================================================
 */
 describe('INTEGRATION TEST: PositionController.editPosition', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocking */
        positionDAO.updatePositionByPositionID.mockReset();
        positionDAO.getPositionByID.mockReset();
        skuDAO.getSKUByPositionID.mockReset();

        /* mocking positionDAO.getPositionByID */
        positionDAO.getPositionByID.mockImplementationOnce(() => {
            return undefined;
        }).mockImplementation(() => {
            return positionsTestArray[0];
        });

        /* mocking skuDAO.getSKUByPositionID */
        skuDAO.getSKUByPositionID.mockImplementationOnce(() => {
            return skusTestArray[0];
        }).mockImplementationOnce(() => {
            return skusTestArray[0];
        }).mockImplementation(() => {
            return undefined;
        });

        /* mocking positionDAO.updatePositionByPositionID() */
        positionDAO.updatePositionByPositionID.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return ;
        });
    });
    
    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
    testEditPosition_MOCK(
        '- position not found: ',
        {positionID: positionsTestArray[0].positionID},
        positionObject[0],
        ERROR_404
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_422
     * ---------------------------------
     */
     testEditPosition_MOCK(
        '- position constraints failed (on weight): ',
        {positionID: positionsTestArray[0].positionID},
        positionObject[0],
        ERROR_422
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_422
     * ---------------------------------
     */
     testEditPosition_MOCK(
        '- position constraints failed (on volume): ',
        {positionID: positionsTestArray[0].positionID},
        positionObject[1],
        ERROR_422
    );
    
    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
    testEditPosition_MOCK(
        '- Error: ',
        {positionID: positionsTestArray[0].positionID},
        positionObject[0],
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testEditPosition_MOCK(
        '- Success: ',
        {positionID: positionsTestArray[0].positionID},
        positionObject[0],
        MESSG_200
    );
});

/**
 * INTEGRATION TEST: PositionController.editPositionID()
 * ========================================================================
 */
 describe('INTEGRATION TEST: PositionController.editPositionID', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocking */
        positionDAO.updatePositionID.mockReset();
        positionDAO.getPositionByID.mockReset();
        skuDAO.getSKUByPositionID.mockReset();
        skuDAO.updateSKUpositionID.mockReset();

        /* mocking positionDAO.getPositionByID */
        positionDAO.getPositionByID.mockImplementationOnce(() => {
            return undefined;
        }).mockImplementation(() => {
            return positionsTestArray[0];
        });

        /* mocking positionDAO.updatePositionID */
        positionDAO.updatePositionID.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementation(() => {
            return ;
        });

        /* mocking skuDAO.getSKUByPositionID */
        skuDAO.getSKUByPositionID.mockImplementationOnce(() => {
            return skusTestArray[0];
        }).mockImplementation(() => {
            return undefined;
        });

        /* mocking skuDAO.updateSKUpositionID */
        skuDAO.updateSKUpositionID.mockImplementation(() => {
            return ;
        });
    });
    
    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testEditPositionID_MOCK(
        '- position not found: ',
        {positionID: positionsTestArray[0].positionID},
        {newPositionID: positionsTestArray[1].positionID},
        ERROR_404
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testEditPositionID_MOCK(
        '- Error: ',
        {positionID: positionsTestArray[0].positionID},
        {newPositionID: positionsTestArray[1].positionID},
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testEditPositionID_MOCK(
        '- Success (update associated SKU): ',
        {positionID: positionsTestArray[0].positionID},
        {newPositionID: positionsTestArray[1].positionID},
        MESSG_200
    );
    
    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testEditPositionID_MOCK(
        '- Success: ',
        {positionID: positionsTestArray[0].positionID},
        {newPositionID: positionsTestArray[1].positionID},
        MESSG_200
    );
});

/**
 * INTEGRATION TEST: PositionController.deletePosition()
 * ========================================================================
 */
 describe('INTEGRATION TEST: PositionController.deletePosition', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocking */
        positionDAO.removePosition.mockReset();
        skuDAO.getSKUByPositionID.mockReset();
        skuDAO.updateSKUpositionID.mockReset();

        /* mocking positionDAO.removePosition */
        positionDAO.removePosition.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementation(() => {
            return ;
        });

        /* mocking skuDAO.getSKUByPositionID */
        skuDAO.getSKUByPositionID.mockImplementationOnce(() => {
            return skusTestArray[0];
        }).mockImplementation(() => {
            return undefined;
        });

        /* mocking skuDAO.updateSKUpositionID */
        skuDAO.updateSKUpositionID.mockImplementation(() => {
            return ;
        });
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testDeletePosition_MOCK(
        '- Error: ',
        {positionID: positionsTestArray[0].positionID},
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testDeletePosition_MOCK(
        '- Success (update associated SKU): ',
        {positionID: positionsTestArray[0].positionID},
        MESSG_204
    );
    
    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testDeletePosition_MOCK(
        '- Success: ',
        {positionID: positionsTestArray[0].positionID},
        MESSG_204
    );
});








/*
    + -------------------- +
    |      FUNCTIONS       |
    + -------------------- +
*/
/**
 * INTEGRATION TEST: PositionController.getPositions()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetPositions_MOCK(testName, expectedResult) {
    test(testName, async () => {
        try {
            const result = await positionController.getPositions();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: PositionController.newPosition()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} body contains the new Position object to be added in the DB
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testNewPosition_MOCK(testName, body, expectedResult) {
    test(testName, async () => {
        try {
            const result = await positionController.newPosition(body);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: PositionController.editPosition()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} params contains the identifier of the target position
 * @param {Object} body contains the new Position object
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testEditPosition_MOCK(testName, params, body, expectedResult) {
    test(testName, async () => {
        try {
            const result = await positionController.editPosition(params, body);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: PositionController.editPositionID()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} params contains the identifier of the target position
 * @param {Object} body contains the new PositionID
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testEditPositionID_MOCK(testName, params, body, expectedResult) {
    test(testName, async () => {
        try {
            const result = await positionController.editPositionID(params, body);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: PositionController.deletePosition()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} params contains the identifier of the target position
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testDeletePosition_MOCK(testName, params, expectedResult) {
    test(testName, async () => {
        try {
            const result = await positionController.deletePosition(params);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}