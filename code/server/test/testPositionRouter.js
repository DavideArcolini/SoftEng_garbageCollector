/**
 *      TESTING ROUTER: POSITION 
 * ==================================
 * 
*/

'use strict'

/* ------------ MODULE IMPORT ------------ */
const chai      = require('chai');
const chaiHttp  = require('chai-http');
const app       = require('../server');

/* ------------ INITIALIZATION ------------ */
chai.use(chaiHttp);
chai.should();
var agent = chai.request.agent(app);


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
describe('API: GET /api/positions', () => {

    /* TESTING */
    getPositions_APITEST(
        '[200] OK', 
        200
    );
});


/*
* -----------------------------------------
*         API: POST /api/position 
* =========================================
*/
describe('API: POST /api/position', () => {

    /* TESTING */
    newPosition_APITEST(
        '[201] Created', 
        {
            positionID: "910181017101",
            aisleID: "9101",
            row: "8101",
            col: "7101",
            maxWeight: 1000,
            maxVolume: 1000
        },
        201
    );

    /* TESTING */
    newPosition_APITEST(
        '[422] Unprocessable Entity (constraints on positionID failed)', 
        {
            positionID: "110101010101",
            aisleID: "9101",
            row: "8101",
            col: "7101",
            maxWeight: 1000,
            maxVolume: 1000
        },
        422
    );

    /* TESTING */
    newPosition_APITEST(
        '[422] Unprocessable Entity (constraints on maxWeight/maxVolume failed)', 
        {
            positionID: "910181017101",
            aisleID: "9101",
            row: "8101",
            col: "7101",
            maxWeight: -1000,
            maxVolume: 1000
        },
        422
    );

    /* TESTING */
    newPosition_APITEST(
        '[422] Unprocessable Entity (missing parameters)', 
        {
            positionID: "910181017101",
            aisleID: "9101",
            row: "8101",
            col: "7101",
            maxVolume: 1000
        },
        422
    );

    after(async () => {
        await agent.delete(`/api/position/910181017101`);
    });
});

/*
* -----------------------------------------
*    API: PUT /api/position/:positionID
* =========================================
*/
describe('API: PUT /api/position/:positionID', () => {

    before(async () => {
        await agent.post('/api/position').send(
            {
                positionID: "920282027202",
                aisleID: "9202",
                row: "8202",
                col: "7202",
                maxWeight: 1000,
                maxVolume: 1000
            }
        );
    });


    /* TESTING */
    editPosition_APITEST(
        '[200] OK',
        {positionID: 920282027202},
        {
            newAisleID: "9212",
            newRow: "8212",
            newCol: "7212",
            newMaxWeight: 1001,
            newMaxVolume: 1001,
            newOccupiedWeight: 200,
            newOccupiedVolume: 100
        },
        200
    );

    /* TESTING */
    editPosition_APITEST(
        '[422] Unprocessable Entity (constraints on maxWeight/maxVolume failed)',
        {positionID: 920282027202},
        {
            newAisleID: "9212",
            newRow: "8212",
            newCol: "7212",
            newMaxWeight: -1001,
            newMaxVolume: 1001,
            newOccupiedWeight: 200,
            newOccupiedVolume: 100
        },
        422
    );

    /* TESTING */
    editPosition_APITEST(
        '[404] Not Found (positionID non existing in DB)',
        {positionID: 929282827272},
        {
            newAisleID: "9212",
            newRow: "8212",
            newCol: "7212",
            newMaxWeight: 1001,
            newMaxVolume: 1001,
            newOccupiedWeight: 200,
            newOccupiedVolume: 100
        },
        404
    );

    after(async () => {
        await agent.delete(`/api/position/921282127212`);
        await agent.delete('/api/position/920282027202');
    })
});

/*
* ---------------------------------------------
*    PUT /api/position/:positionID/changeID
* =============================================
*/
describe('PUT /api/position/:positionID/changeID', () => {

    before(async () => {
        await agent.post('/api/position').send(
            {
                positionID: "930383037303",
                aisleID: "9303",
                row: "8303",
                col: "7303",
                maxWeight: 1000,
                maxVolume: 1000
            }
        );
    });


    /* TESTING */
    editPositionID_APITEST(
        '[200] OK',
        {positionID: 930383037303},
        {newPositionID: "931383137313"},
        200
    );

    /* TESTING */
    editPositionID_APITEST(
        '[422] Unprocessable Entity (constraints on newPositionID failed)',
        {positionID: 930383037303},
        {newPositionID: "FailingHere"},
        422
    );

    /* TESTING */
    editPositionID_APITEST(
        '[404] Not Found (positionID non existing in DB)',
        {positionID: 929282827272},
        {newPositionID: "931383137313"},
        404
    );

    after(async () => {
        await agent.delete(`/api/position/931383137313`);
        await agent.delete('/api/position/930383037303');
    })
});

/*
* ---------------------------------------------
*       DELETE /api/position/:positionID
* =============================================
*/
describe('DELETE /api/position/:positionID', () => {

    before(async () => {
        await agent.post('/api/position').send(
            {
                positionID: "940484047404",
                aisleID: "9404",
                row: "8404",
                col: "7404",
                maxWeight: 1000,
                maxVolume: 1000
            }
        );
    });


    /* TESTING */
    deletePosition_APITEST(
        '[204] No Content',
        {positionID: 940484047404},
        204
    );

    /* TESTING */
    deletePosition_APITEST(
        '[422] Unprocessable Entity (constraints on positionID failed)',
        {positionID: 93038},
        422
    );

    after(async () => {
        await agent.delete('/api/position/940484047404');
    })
});



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
 * @param {String} testName specific name of the test run
 * @param {Number} expectedHTTPStatus return status of the API call 
*/
function getPositions_APITEST(testName, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.get('/api/positions').then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
            response.should.to.be.json;
            response.body.should.be.a('array');
        })
    });
}

/**
 * Create a new Position object and store it in the database
 * ---------------------------------------------------------
 *                 API: POST /api/position
 * =========================================================
 * @param {String} testName specific name of the test run
 * @param {JSON} request JSON Object containing the position to add to the DB
 * @param {Number} expectedHTTPStatus return status of the API call 
*/
function newPosition_APITEST(testName, request, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.post('/api/position').send(request).then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
        });
    });
}

/**
 * Modify a position identified by positionID
 * ------------------------------------------
 *      API: PUT /api/position/:positionID
 * ==========================================
 * @param {String} testName specific name of the test run
 * @param {JSON} params JSON Object containing the :positionID parameter
 * @param {JSON} request JSON Object containing the position to edit in the DB
 * @param {Number} expectedHTTPStatus return status of the API call 
*/
function editPosition_APITEST(testName, params, request, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.put(`/api/position/${params.positionID}`).send(request).then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
        });
    });
}

/**
 * Modify the positionID of a position position, given its old positionID.
 * -----------------------------------------------------------------------
 *                API: PUT /api/position/:positionID/changeID
 * =======================================================================
 * @param {String} testName specific name of the test run
 * @param {JSON} params JSON Object containing the :positionID parameter
 * @param {JSON} request JSON Object containing the positionID to edit in the DB
 * @param {Number} expectedHTTPStatus return status of the API call 
*/
function editPositionID_APITEST(testName, params, request, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.put(`/api/position/${params.positionID}/changeID`).send(request).then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
        });
    });
}

/**
 * Delete a position given its identifier ID
 * ------------------------------------------
 *  API: DELETE /api/position/:positionID
 * ==========================================
 * @param {String} testName specific name of the test run
 * @param {JSON} params JSON Object containing the :positionID parameter
 * @param {Number} expectedHTTPStatus return status of the API call 
*/
function deletePosition_APITEST(testName, params, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.delete(`/api/position/${params.positionID}`).then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
        });
    });
}