/**
 *  INTEGRATION TEST: positionController
 *           VERSION: real
 * --------------------------------------------
 * Services do access the database (although it
 * is a test database).
*/

/* --------- IMPORT MODULES --------- */
const PositionController    = require('../../../controller/PositionController');
const PositionDAO           = require('../../../db/positionDAO');
const SKUDAO                = require('../../../db/skuDAO');
const TestDAO               = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const testDAO               = new TestDAO();
const positionDAO           = new PositionDAO(testDAO);
const skuDAO                = new SKUDAO(testDAO);
const positionController    = new PositionController(positionDAO, skuDAO);

/* --------- ERROR MESSAGES --------- */
const MESSG_200 = {code: 200, message: 'Ok'}
const MESSG_201 = {code: 201, message: 'Created'};
const MESSG_204 = {code: 204, message: 'No Content'};
const ERROR_404 = {code: 404, message: 'Not Found'};

/*
    + -------------------- +
    |         DATA         |
    + -------------------- +
*/

const newPositionID = "400340034003";
const newPositionObject = {
    newAisleID: "4003",
    newRow: "4003",
    newCol: "4003",
    newMaxWeight: 100,
    newMaxVolume: 50,
    newOccupiedWeight: 0,
    newOccupiedVolume: 0
};

const skuObject = {
    description: "a new sku",
    weight: 100,
    volume: 50,
    notes: "first SKU",
    price: 10.99,
    availableQuantity: 2
};


const positionsTestArray = [
    {
        positionID: "400040004000",
        aisleID: "4000",
        row: "4000",
        col: "4000",
        maxWeight: 1000,
        maxVolume: 1000
    }, {
        positionID: "400140014001",
        aisleID: "4001",
        row: "4001",
        col: "4001",
        maxWeight: 50,
        maxVolume: 50
    }, {
        positionID: "400240024002",
        aisleID: "4002",
        row: "4002",
        col: "4002",
        maxWeight: 120,
        maxVolume: 240
    } 
];

const skusTestArray = [
    {
        id: 1,
        description: "a new sku",
        weight: 100,
        volume: 50,
        notes: "first SKU",
        position: "400140014001",
        availableQuantity: 2,
        price: 10.99
    },
    {
        id: 2,
        description: "another sku",
        weight: 101,
        volume: 60,
        notes: "second SKU",
        position: "800234543411",
        availableQuantity: 55,
        price: 10.99
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
describe('[REAL] INTEGRATION TEST: PositionController.getPositions', () => {

    beforeAll(async () => {
        for (let position of positionsTestArray)
            await positionDAO.newPosition(position);
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
    testGetPositions_REAL('- Success: ', {
        code: 200,
        message: [
            {
                positionID: "400040004000",
                aisleID: "4000",
                row: "4000",
                col: "4000",
                maxWeight: 1000,
                maxVolume: 1000,
                occupiedWeight: 0,
                occupiedVolume: 0
            }, {
                positionID: "400140014001",
                aisleID: "4001",
                row: "4001",
                col: "4001",
                maxWeight: 50,
                maxVolume: 50,
                occupiedWeight: 0,
                occupiedVolume: 0
            }, {
                positionID: "400240024002",
                aisleID: "4002",
                row: "4002",
                col: "4002",
                maxWeight: 120,
                maxVolume: 240,
                occupiedWeight: 0,
                occupiedVolume: 0
            } 
        ]
    });

    afterAll(async () => {
        for (let position of positionsTestArray)
            await positionDAO.removePosition(position.positionID);
    });

});

/**
 * INTEGRATION TEST: PositionController.newPosition()
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: PositionController.newPosition', () => {

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
    testNewPosition_REAL(
        '- Success', 
        positionsTestArray[0],
        MESSG_201
    );  

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testNewPosition_REAL(
        '- Error (positionID already exists)', 
        positionsTestArray[0],
        Error
    );  

    afterAll(async () => {
        await positionDAO.removePosition(positionsTestArray[0].positionID);
    });

});

/**
 * INTEGRATION TEST: PositionController.editPosition()
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: PositionController.editPosition', () => {

    beforeAll(async () => {
        await positionDAO.newPosition(positionsTestArray[1]);
    })

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
    testEditPosition_REAL(
        '- Position not found',
        {positionID: positionsTestArray[0].positionID},
        newPositionObject,
        ERROR_404
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testEditPosition_REAL(
        '- Success',
        {positionID: positionsTestArray[1].positionID},
        newPositionObject,
        MESSG_200
    );


    afterAll(async () => {
        await positionDAO.removePosition(newPositionID);
    });
});

/**
 * INTEGRATION TEST: PositionController.editPositionID()
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: PositionController.editPositionID', () => {

    beforeAll(async () => {
        await positionDAO.newPosition(positionsTestArray[1]);
    })

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testEditPositionID_REAL(
        '- Position not found',
        {positionID: positionsTestArray[0].positionID},
        {newPositionID: newPositionID},
        ERROR_404
    );


    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testEditPositionID_REAL(
        '- Success',
        {positionID: positionsTestArray[1].positionID},
        {newPositionID: newPositionID},
        MESSG_200
    );


    afterAll(async () => {
        await positionDAO.removePosition(newPositionID);
    });
});

/**
 * INTEGRATION TEST: PositionController.deletePosition()
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: PositionController.deletePosition', () => {

    beforeAll(async () => {
        await positionDAO.newPosition(positionsTestArray[1]);
    })

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testDeletePosition_REAL(
        '- Success',
        {positionID: positionsTestArray[1].positionID},
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
function testGetPositions_REAL(testName, expectedResult) {
    test(testName, async () => {
        try {
            const result = await positionController.getPositions();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    })
}


/**
 * INTEGRATION TEST: PositionController.newPosition()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} body contains the new Position object to be added in the DB
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testNewPosition_REAL(testName, body, expectedResult) {
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
 function testEditPosition_REAL(testName, params, body, expectedResult) {
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
 function testEditPositionID_REAL(testName, params, body, expectedResult) {
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
 function testDeletePosition_REAL(testName, params, expectedResult) {
    test(testName, async () => {
        try {
            const result = await positionController.deletePosition(params);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}