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
const TestDAO               = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const testDAO               = new TestDAO();
const positionDAO           = new PositionDAO(testDAO);
const positionController    = new PositionController(testDAO);

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
        maxVolume: 1000
    }, {
        positionID: "100234543412",
        aisleID: "1002",
        row: "3454",
        col: "3412",
        maxWeight: 50,
        maxVolume: 50
    }, {
        positionID: "200234543412",
        aisleID: "2002",
        row: "3454",
        col: "3412",
        maxWeight: 120,
        maxVolume: 240
    } 
];


/*
    + -------------------- +
    |         TESTS        |
    + -------------------- +
*/

/**
 * TESTING: getPositions()
 */
describe('[REAL] INTEGRATION TEST: PositionController.getPositions', () => {

    beforeAll(async () => {
        for (let position of positionsTestArray)
            await positionDAO.newPosition(position);
    });

    testGetPositions_REAL('- Success: ', {
        code: 200,
        message: [
            {
                positionID: "800234543412",
                aisleID: "8002",
                row: "3454",
                col: "3412",
                maxWeight: 1000,
                maxVolume: 1000,
                occupiedWeight: 0,
                occupiedVolume: 0
            }, {
                positionID: "100234543412",
                aisleID: "1002",
                row: "3454",
                col: "3412",
                maxWeight: 50,
                maxVolume: 50,
                occupiedWeight: 0,
                occupiedVolume: 0
            }, {
                positionID: "200234543412",
                aisleID: "2002",
                row: "3454",
                col: "3412",
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