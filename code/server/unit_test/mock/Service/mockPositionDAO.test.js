/**
 *  UNIT TEST: positionDAO
 */

/* --------- IMPORT MODULES --------- */
const PositionDAO   = require('../../../db/positionDAO');
const mockDAO       = require('../Database/mockDAO');

/* --------- INITIALIZATION --------- */
const positionDAO = new PositionDAO(mockDAO);

   
/*
    + -------------------- +
    |         DATA         |
    + -------------------- +
*/
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
        maxWeight: 120,
        maxVolume: 240,
        occupiedWeight: 300,
        occupiedVolume: 350
    }
];

/*
    + -------------------- +
    |         TESTS        |
    + -------------------- +
*/
/**
 * UNIT TEST: positionDAO.getPositions()
 * ========================================================================
 */
describe('UNIT TEST: positionDAO.getPositions()', () => {
    beforeAll(() => {
        mockDAO.all.mockReset();
        mockDAO.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(positionsTestArray);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "Error"});
            });
        });
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
    testGetPositions_MOCK('- Success: ', positionsTestArray);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
    testGetPositions_MOCK('- Database error: ', Error);
    
});

/**
 * UNIT TEST: positionDAO.getPositionByID()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.getPositionByID()', () => {
    beforeAll(() => {
        mockDAO.get.mockReset();
        mockDAO.get.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(positionsTestArray[0]);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "Error"});
            });
        });
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
    testGetPositionByID_MOCK(
        '- Success: ', 
        positionsTestArray[0].positionID,
        positionsTestArray[0]
    );

    /**
     * ---------------------------------
     *      UNIT TEST: EMPTY RESULT
     * ---------------------------------
     */
     testGetPositionByID_MOCK(
        '- Success (empty): ', 
        "123456789876",
        []
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
    testGetPositionByID_MOCK(
        '- Database error: ', 
        positionsTestArray[0].positionID,
        Error
    );
    
});


/**
 * UNIT TEST: positionDAO.newPosition()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.newPosition()', () => {
    beforeAll(() => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(positionsTestArray[0].positionID);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "Error"});
            });
        });
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testNewPosition_MOCK(
        '- Success: ', 
        positionsTestArray[0],
        positionsTestArray[0].positionID
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testNewPosition_MOCK(
        '- Database error: ', 
        positionsTestArray[0],
        Error
    );
    
});

/**
 * UNIT TEST: positionDAO.updatePositionByPositionID()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.updatePositionByPositionID()', () => {
    beforeAll(() => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(positionsTestArray[1].positionID);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "Error"});
            });
        });
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testUpdatePositionByPositionID_MOCK(
        '- Success: ',
        positionsTestArray[0].positionID,
        positionsTestArray[1],
        positionsTestArray[1].positionID
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testUpdatePositionByPositionID_MOCK(
        '- Database error: ',
        positionsTestArray[0].positionID,
        positionsTestArray[1],
        Error
    );
    
});


/**
 * UNIT TEST: positionDAO.updatePositionID()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.updatePositionID()', () => {
    beforeAll(() => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(positionsTestArray[1].positionID);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "Error"});
            });
        });
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testUpdatePositionID_MOCK(
        '- Success: ',
        positionsTestArray[0].positionID,
        positionsTestArray[1].positionID,
        positionsTestArray[1].positionID
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testUpdatePositionID_MOCK(
        '- Database error: ',
        positionsTestArray[0].positionID,
        positionsTestArray[1].positionID,
        Error
    );
    
});


/**
 * UNIT TEST: positionDAO.updatePositionQuantity()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.updatePositionQuantity()', () => {
    beforeAll(() => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(positionsTestArray[0].positionID);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "Error"});
            });
        });
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testUpdatePositionQuantity_MOCK(
        '- Success: ',
        positionsTestArray[0].positionID,
        positionsTestArray[1].occupiedWeight,
        positionsTestArray[1].occupiedVolume,
        positionsTestArray[0].positionID
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testUpdatePositionQuantity_MOCK(
        '- Database error: ',
        positionsTestArray[0].positionID,
        positionsTestArray[1].occupiedWeight,
        positionsTestArray[1].occupiedVolume,
        Error
    );
    
});

/**
 * UNIT TEST: positionDAO.removePosition()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.removePosition()', () => {
    beforeAll(() => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(positionsTestArray[0].positionID);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "Error"});
            });
        });
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testRemovePosition_MOCK(
        '- Success: ',
        positionsTestArray[0].positionID,
        positionsTestArray[0].positionID
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testRemovePosition_MOCK(
        '- Database error: ',
        positionsTestArray[0].positionID,
        Error
    );
    
});

/*
    + -------------------- +
    |      FUNCTIONS       |
    + -------------------- +
*/
/**
 * UNIT TEST: positionDAO.getPositions()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
function testGetPositions_MOCK(testName, expectedResult) {
    test(testName, async () => {
        try {
            const result = await positionDAO.getPositions();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}
/**
 * UNIT TEST: positionDAO.getPositionByID()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {String} positionID identifier of the target position
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetPositionByID_MOCK(testName, positionID, expectedResult) {
    test(testName, async () => {
        try {
            const result = await positionDAO.getPositionByID(positionID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: positionDAO.newPosition()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} positionObject new position to be inserted in the DB
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testNewPosition_MOCK(testName, positionObject, expectedResult) {
    test(testName, async () => {
        try {
            const result = await positionDAO.newPosition(positionObject);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: positionDAO.updatePositionByPositionID()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {String} positionID identifier of the target position
 * @param {Object} positionObject new position to be inserted in the DB
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testUpdatePositionByPositionID_MOCK(testName, positionID, positionObject, expectedResult) {
    test(testName, async () => {
        try {
            const result = await positionDAO.updatePositionByPositionID(positionID, positionObject);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: positionDAO.updatePositionByPositionID()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {String} positionID identifier of the target position
 * @param {String} newPositionID new identifier of the target position
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testUpdatePositionID_MOCK(testName, positionID, newPositionID, expectedResult) {
    test(testName, async () => {
        try {
            const result = await positionDAO.updatePositionID(positionID, newPositionID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: positionDAO.updatePositionQuantity()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {String} positionID identifier of the target position
 * @param {Number} newOccupiedWeight new occupiedWeight value of the target position
 * @param {Number} newOccupiedVolume new occupiedVolume value of the target position
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testUpdatePositionQuantity_MOCK(testName, positionID, newOccupiedWeight, newOccupiedVolume, expectedResult) {
    test(testName, async () => {
        try {
            const result = await positionDAO.updatePositionQuantity(positionID, newOccupiedWeight, newOccupiedVolume);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: positionDAO.removePosition()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {String} positionID identifier of the target position
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testRemovePosition_MOCK(testName, positionID, expectedResult) {
    test(testName, async () => {
        try {
            const result = await positionDAO.removePosition(positionID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}