/**
 *      TESTING CLASS: POSITION 
 * ==================================
 * 
*/

'use strict'

/* ------------ MODULE IMPORT ------------ */
const TestDAO               = require('../test_DB/TestDao');
const PositionController    = require('../../controller/PositionController');

/* ------------ INITIALIZATION ------------ */
const dao                   = new TestDAO();
const position              = new PositionController(dao);




/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |            T E S T    R E S U L T S              |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/
getPositions_TEST(
    'DB: getPositions() success', 
    [
        {
            positionID: 100010001000,
            aisleID: 1000,
            row: 1000,
            col: 1000,
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 0,
            occupiedVolume: 0
        }, 
        {
            positionID: 200020002000,
            aisleID: 2000,
            row: 2000,
            col: 2000,
            maxWeight: 1000,
            maxVolume: 1000,
            occupiedWeight: 0,
            occupiedVolume: 0
        }
    ]
);
newPosition_TEST(
    'DB: newPosition() success',
    {
        positionID: "300030003000",
        aisleID: "3000",
        row: "3000",
        col: "3000",
        maxWeight: 1000,
        maxVolume: 1000
    },
    {
        code: 201,
        message: "CREATED"
    }
);
editPosition_TEST(
    'DB: editPosition() success',
    {positionID: 400040004000},
    {
        newAisleID: "4001",
        newRow: "4001",
        newCol: "4001",
        newMaxWeight: 1000,
        newMaxVolume: 1300,
        newOccupiedWeight: 0,
        newOccupiedVolume:0
    },
    {
        code: 200,
        message: "OK"
    }
);
editPosition_TEST(
    'DB: editPosition() fails',
    {positionID: 999999999999}, /* id does not exist */
    {
        newAisleID: "1000",
        newRow: "1001",
        newCol: "1001",
        newMaxWeight: 1000,
        newMaxVolume: 1300,
        newOccupiedWeight: 0,
        newOccupiedVolume:0
    },
    {
        code: 404,
        message: "Not Found"
    }
);
editPositionID_TEST(
    'DB: editPositionID() success',
    {positionID: 500050005000},
    {newPositionID: "500150015001"},
    {
        code: 200,
        message: "OK"
    }
);
editPositionID_TEST(
    'DB: editPositionID() fails',
    {positionID: 999999999999}, /* id does not exist */
    {newPositionID: "101010101010"},
    {
        code: 404,
        message: "Not Found"
    }
);
deletePosition_TEST(
    'DB: deletePosition() success',
    {positionID: 600060006000},
    {
        code: 204,
        message: "NO CONTENT"
    }
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
*/
function getPositions_TEST(describe_NAME, expectedResult) {
    describe('TEST (DB): getPositions()', () => {
        beforeAll(async () => {
            const query_SQL = "INSERT INTO POSITIONS (POSITIONID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES (?, ?, ?, ?, ?, ?, 0, 0)";
            await dao.run(query_SQL, [100010001000, 1000, 1000, 1000, 1000, 1000]);
            await dao.run(query_SQL, [200020002000, 2000, 2000, 2000, 1000, 1000]);
        });

        test(describe_NAME, async() => {
            const result = await position.getPositions();
            expect(result).toEqual(expectedResult);
        });

        afterAll(async () => {
            const query_SQL = "DELETE FROM POSITIONS WHERE POSITIONS.positionID == ?";
            await dao.run(query_SQL, [100010001000]);
            await dao.run(query_SQL, [200020002000]);
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
*/
function newPosition_TEST(describe_NAME, request, expectedResult) {
    describe('TEST (DB): newPosition()', () => {
        test(describe_NAME, async () => {
            const result = await position.newPosition(request);
            expect(result).toEqual(expectedResult);
        });

        afterAll(async () => {
            const query_SQL = "DELETE FROM POSITIONS WHERE POSITIONS.positionID == ?";
            await dao.run(query_SQL, [300030003000]);
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
*/
function editPosition_TEST(describe_NAME, params, request, expectedResult) {
    describe('TEST (DB): editPosition()', () => {
        beforeEach(async () => {
            const query_SQL = "INSERT INTO POSITIONS (POSITIONID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES (?, ?, ?, ?, ?, ?, 0, 0)";
            await dao.run(query_SQL, [400040004000, 4000, 4000, 4000, 1000, 1000]);
        });

        test(describe_NAME, async () => {
            const result = await position.editPosition(params, request);
            expect(result).toEqual(expectedResult);
        });

        afterAll(async () => {
            const query_SQL = "DELETE FROM POSITIONS WHERE POSITIONS.positionID == ?";
            await dao.run(query_SQL, [400140014001]);
            await dao.run(query_SQL, [400040004000]);
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
*/
function editPositionID_TEST(describe_NAME, params, request, expectedResult) {
    describe('TEST (DB): editPositionID()', () => {
        beforeEach(async () => {
            const query_SQL = "INSERT INTO POSITIONS (POSITIONID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES (?, ?, ?, ?, ?, ?, 0, 0)";
            await dao.run(query_SQL, [500050005000, 5000, 5000, 5000, 1000, 1000]);
        });

        test(describe_NAME, async () => {
            const result = await position.editPositionID(params, request);
            expect(result).toEqual(expectedResult);
        });

        afterAll(async () => {
            const query_SQL = "DELETE FROM POSITIONS WHERE POSITIONS.positionID == ?";
            await dao.run(query_SQL, [500150015001]);
            await dao.run(query_SQL, [500050005000]);
        });
    });
}

/**
 * Delete a position given its identifier ID
 * ------------------------------------------
 *      API: DELETE /api/position/:id
 * ==========================================
 * @param {String} describe_NAME specific description of the test run
 * @param {JSON} params JSON Object containing the :id parameter
 * @param {JSON} expectedResult JSON object returned by the function
*/
function deletePosition_TEST(describe_NAME, params, expectedResult) {
    describe('TEST (DB): deletePosition()', () => {
        beforeEach(async () => {
            const query_SQL = "INSERT INTO POSITIONS (POSITIONID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES (?, ?, ?, ?, ?, ?, 0, 0)";
            await dao.run(query_SQL, [600060006000, 6000, 6000, 6000, 1000, 1000]);
        });

        test(describe_NAME, async () => {
            const result = await position.deletePosition(params);
            expect(result).toEqual(expectedResult);
        });
    });
}