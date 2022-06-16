/**
 *  UNIT TEST: positionDAO
 *    VERSION: real
 * ===========================
 */

/* --------- IMPORT MODULES --------- */
const PositionDAO   = require('../../../db/positionDAO');
const DAO           = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const dao         = new DAO();
const positionDAO = new PositionDAO(dao);

const positionObject = {
    positionID: "400140014001",
    aisleID: "4001",
    row: "4001",
    col: "4001",
    maxWeight: 1000,
    maxVolume: 1000
};
const positionsTestArray = [
    {
        positionID: "400140014001",
        aisleID: "4001",
        row: "4001",
        col: "4001",
        maxWeight: 1000,
        maxVolume: 1000,
        occupiedWeight: 0,
        occupiedVolume: 0
    }, {
        positionID: "400240024002",
        aisleID: "4002",
        row: "4002",
        col: "4002",
        maxWeight: 1000,
        maxVolume: 1000,
        occupiedWeight: 0,
        occupiedVolume: 0
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
    beforeAll(async () => {
        const querySQL = "INSERT INTO POSITIONS VALUES (?, ?, ?, ?, ?, ?, 0, 0)";
        await dao.run(querySQL, ["400140014001", "4001", "4001", "4001", 1000, 1000]);
        await dao.run(querySQL, ["400240024002", "4002", "4002", "4002", 1000, 1000]);
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testGetPositions_REAL(
        '- Success: ', 
        positionsTestArray
    );

    afterAll(async () => {
        const querySQL = "DELETE FROM POSITIONS";
        await dao.run(querySQL);
    });

});

/**
 * UNIT TEST: positionDAO.getPositionByID()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.getPositionByID()', () => {
    beforeAll(async () => {
        const querySQL = "INSERT INTO POSITIONS VALUES (?, ?, ?, ?, ?, ?, 0, 0)";
        await dao.run(querySQL, ["400140014001", "4001", "4001", "4001", 1000, 1000]);
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testGetPositionByID_REAL(
        '- Success: ',
        "400140014001",
        positionsTestArray[0]
    );

    /**
     * ---------------------------------
     *      UNIT TEST: NOT FOUND
     * ---------------------------------
     */
     testGetPositionByID_REAL(
        '- Position not found: ',
        "999999999999",
        undefined
    );

    afterAll(async () => {
        const querySQL = "DELETE FROM POSITIONS";
        await dao.run(querySQL);
    });

});

/**
 * UNIT TEST: positionDAO.newPosition()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.newPosition()', () => {

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testNewPosition_REAL(
        '- Success: ',
        positionObject,
        {id: 1}
    );

    /**
     * ---------------------------------
     *      UNIT TEST: ERROR
     * ---------------------------------
     */
     testNewPosition_REAL(
        '- positionID already existing: ',
        positionObject,
        Error
    );

    afterAll(async () => {
        const querySQL = "DELETE FROM POSITIONS";
        await dao.run(querySQL);
    });

});

/**
 * UNIT TEST: positionDAO.updatePositionByPositionID()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.updatePositionByPositionID()', () => {
    beforeAll(async () => {
        const querySQL = "INSERT INTO POSITIONS VALUES (?, ?, ?, ?, ?, ?, 0, 0)";
        await dao.run(querySQL, ["400240024002", "4002", "4002", "4002", 1000, 1000]);
        await dao.run(querySQL, ["400340034003", "4003", "4003", "4003", 1000, 1000]);
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testUpdatePositionByPositionID_REAL(
        '- Success: ',
        "400240024002",
        {
            newPositionID: "400140014001",
            newAisleID: "4001",
            newRow: "4001",
            newCol: "4001",
            newMaxWeight: 1000,
            newMaxVolume: 1000,
            newOccupiedWeight: 0,
            newOccupiedVolume: 0
        },
        {id: 2}
    );

    /**
     * ---------------------------------
     *      UNIT TEST: ERROR
     * ---------------------------------
     */
     testUpdatePositionByPositionID_REAL(
        '- positionID already existing: ',
        positionObject.positionID,
        {
            newPositionID: "400340034003",
            newAisleID: "4003",
            newRow: "4003",
            newCol: "4003",
            newMaxWeight: 1000,
            newMaxVolume: 1000,
            newOccupiedWeight: 0,
            newOccupiedVolume: 0
        },
        Error
    );

    afterAll(async () => {
        const querySQL = "DELETE FROM POSITIONS";
        await dao.run(querySQL);
    });

});

/**
 * UNIT TEST: positionDAO.updatePositionID()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.updatePositionID()', () => {
    beforeAll(async () => {
        const querySQL = "INSERT INTO POSITIONS VALUES (?, ?, ?, ?, ?, ?, 0, 0)";
        await dao.run(querySQL, ["400240024002", "4002", "4002", "4002", 1000, 1000]);
        await dao.run(querySQL, ["400340034003", "4003", "4003", "4003", 1000, 1000]);
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testUpdatePositionID_REAL(
        '- Success: ',
        "400240024002",
        "400140014001",
        {id: 2}
    );

    /**
     * ---------------------------------
     *      UNIT TEST: ERROR
     * ---------------------------------
     */
     testUpdatePositionID_REAL(
        '- positionID already existing: ',
        positionObject.positionID,
        "400340034003",
        Error
    );

    afterAll(async () => {
        const querySQL = "DELETE FROM POSITIONS";
        await dao.run(querySQL);
    });

});

/**
 * UNIT TEST: positionDAO.updatePositionQuantity()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.updatePositionQuantity()', () => {
    beforeAll(async () => {
        const querySQL = "INSERT INTO POSITIONS VALUES (?, ?, ?, ?, ?, ?, 0, 0)";
        await dao.run(querySQL, ["400240024002", "4002", "4002", "4002", 1000, 1000]);
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testUpdatePositionQuantity_REAL(
        '- Success: ',
        "400240024002",
        1,
        1,
        {id: 1}
    );

    afterAll(async () => {
        const querySQL = "DELETE FROM POSITIONS";
        await dao.run(querySQL);
    });

});


/**
 * UNIT TEST: positionDAO.removePosition()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.removePosition()', () => {
    beforeAll(async () => {
        const querySQL = "INSERT INTO POSITIONS VALUES (?, ?, ?, ?, ?, ?, 0, 0)";
        await dao.run(querySQL, ["400240024002", "4002", "4002", "4002", 1000, 1000]);
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testRemovePosition_REAL(
        '- Success: ',
        "400240024002",
        {id: 1}
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
 function testGetPositions_REAL(testName, expectedResult) {
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
 function testGetPositionByID_REAL(testName, positionID, expectedResult) {
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
 function testNewPosition_REAL(testName, positionObject, expectedResult) {
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
 function testUpdatePositionByPositionID_REAL(testName, positionID, positionObject, expectedResult) {
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
 function testUpdatePositionID_REAL(testName, positionID, newPositionID, expectedResult) {
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
 function testUpdatePositionQuantity_REAL(testName, positionID, newOccupiedWeight, newOccupiedVolume, expectedResult) {
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
 function testRemovePosition_REAL(testName, positionID, expectedResult) {
    test(testName, async () => {
        try {
            const result = await positionDAO.removePosition(positionID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}