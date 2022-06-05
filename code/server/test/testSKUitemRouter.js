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
const DAO       = require('../db/DAO');
require('./testPositionRouter');

/* ------------ INITIALIZATION ------------ */
chai.use(chaiHttp);
chai.should();
var agent = chai.request.agent(app);
const dao = new DAO();


/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |            T E S T    R E S U L T S              |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/
/*
* ---------------------------------------------
*          API: GET /api/skuitems
* =============================================
*/
describe('API: GET /api/skuitems', () => {

    /* TESTING */
    getSKUitems_APITEST(
        '[200] OK', 
        200
    );
});
/*
* ---------------------------------------------
*          API: GET /api/skuitems/sku/:id
* =============================================
*/
describe('API: GET /api/skuitems/sku/:id', () => {

    before(async () => {
        await dao.run(
            "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [333, "TestDescription", 50, 50, "TestNote", 10.99, 1]
        );
    });

    /* TESTING */
    getSKUitemsBySKUId_APITEST(
        '[200] OK', 
        {id: 333},
        200,
        false /* triggerFails */
    );

    /* TESTING */
    getSKUitemsBySKUId_APITEST(
        '[422] Unprocessable Entity (id constraint failed)', 
        {id: "FailingHere"},
        422,
        true /* triggerFails */
    );

    after(async () => {
        await agent.delete('/api/skus/333')
    });
});

/*
* ---------------------------------------------
*          API: GET /api/skuitems/:rfid
* =============================================
*/
describe('API: GET /api/skuitems/:rfid', () => {

    before(async () => {
        await dao.run(
            "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [222, "TestDescription", 50, 50, "TestNote", 10.99, 1]
        );
        await agent.post('/api/skuitem').send(
            {
                "RFID": "91100000000000000000000000000001",
                "SKUId": 222,
                "DateOfStock": "2021/11/29 12:30"
            }
        );
    });

    /* TESTING */
    getSKUitemsByRFID_APITEST(
        '[200] OK', 
        {rfid: "91100000000000000000000000000001"},
        200
    );

    /* TESTING */
    getSKUitemsByRFID_APITEST(
        '[404] Not Found (rfid non existing)', 
        {rfid: "99900000000000000000000000000001"},
        404
    );

    /* TESTING */
    getSKUitemsByRFID_APITEST(
        '[422] Unprocessable Entity (id constraint failed)', 
        {rfid: "FailingHere"},
        422
    );

    after(async () => {
        await agent.delete('/api/skuitems/91100000000000000000000000000001');
        await agent.delete('/api/skus/222');
    });
});

/*
* ---------------------------------------------
*          API: POST /api/skuitem
* =============================================
*/
describe('API: POST /api/skuitem', () => {

    before(async () => {
        await dao.run(
            "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [555, "TestDescription", 50, 50, "TestNote", 10.99, 1]
        );
    });

    /* TESTING */
    newSKUitem_APITEST(
        '[201] Created',
        {
            "RFID": "90000000000000000000000000000002",
            "SKUId": 555,
            "DateOfStock": "2021/11/29 12:30"
        },
        201
    );

    /* TESTING */
    newSKUitem_APITEST(
        '[404] Not Found (SKUid non existing)',
        {
            "RFID": "90000000000000000000000000000002",
            "SKUId": 554,
            "DateOfStock": "2021/11/29 12:30"
        },
        404
    );

    /* TESTING */
    newSKUitem_APITEST(
        '[422] Unprocessable Entity (body parameters constraints failed)',
        {
            "RFID": "90000000000000000000000000000002",
            "SKUId": 555,
            "DateOfStock": "FailingHere"
        },
        422
    );

    after(async () => {
        await agent.delete('/api/skuitems/90000000000000000000000000000002');
        await agent.delete('/api/skus/555');
    });
});

/*
* ---------------------------------------------
*         API: PUT /api/skuitems/:rfid
* =============================================
*/
describe('API: PUT /api/skuitems/:rfid', () => {

    before(async () => {
        await dao.run(
            "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [777, "TestDescription", 50, 50, "TestNote", 10.99, 1]
        );
        await agent.post('/api/skuitem').send(
            {
                "RFID": "91100000000000000000000000000003",
                "SKUId": 777,
                "DateOfStock": "2021/11/29 12:30"
            }
        );
    });

    /* TESTING */
    editSKUitem_APITEST(
        '[200] OK',
        {rfid: "91100000000000000000000000000003"},
        {
            "newRFID": "91100000000000000000000000000013",
            "newAvailable": 1,
            "newDateOfStock": "2021/11/29 12:30"
        },
        200
    );

    /* TESTING */
    editSKUitem_APITEST(
        '[404] Not Found (rfid non existing)',
        {rfid: "99900000000000000000000000000003"},
        {
            "newRFID": "91100000000000000000000000000013",
            "newAvailable": 1,
            "newDateOfStock": "FailingHere"
        },
        422
    );

    /* TESTING */
    editSKUitem_APITEST(
        '[422] Unprocessable Entity (body parameters constraints failed)',
        {rfid: "91100000000000000000000000000003"},
        {
            "newRFID": "90000000000000000000000000000013",
            "newAvailable": 1,
            "newDateOfStock": "FailingHere"
        },
        422
    );

    /* TESTING */
    editSKUitem_APITEST(
        '[422] Unprocessable Entity (rfid constraints failed)',
        {rfid: "9000003"},
        {
            "newRFID": "90000000000000000000000000000013",
            "newAvailable": 1,
            "newDateOfStock": "FailingHere"
        },
        422
    );

    after(async () => {
        await agent.delete('/api/skuitems/91100000000000000000000000000003');
        await agent.delete('/api/skuitems/91100000000000000000000000000013');
        await agent.delete('/api/skus/777');
    });
});


/*
* ---------------------------------------------
*      API: DELETE /api/skuitems/:rfid
* =============================================
*/
describe('API: DELETE /api/skuitems/:rfid', () => {
    before(async () => {
        await agent.post('/api/skuitem').send(
            {
                "RFID": "90000000000000000000000000000004",
                "SKUId": 1,
                "DateOfStock": "2021/11/29 12:30"
            }
        );
    });

    deleteSKUitem_APITEST(
        '[204] No Content',
        {rfid: "90000000000000000000000000000004"},
        204
    );

    deleteSKUitem_APITEST(
        '[422] Unprocessable Entity',
        {rfid: "900004"},
        422
    );
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
function getSKUitems_APITEST(testName, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.get('/api/skuitems').then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
            response.should.to.be.json;
            response.body.should.be.a('array');
        })
    });
}

/**
 * Return an array containing all positions.
 * -----------------------------------------
 *    API: GET /api/skuitems/sku/:id 
 * =========================================
 * @param {String} testName specific name of the test run
 * @param {JSON} params JSON Object containing the :id parameter
 * @param {Number} expectedHTTPStatus return status of the API call 
 * @param {Boolean} triggerFails trigger 422 errors in return 
*/
function getSKUitemsBySKUId_APITEST(testName, params, expectedHTTPStatus, triggerFails) {
    it(testName, async () => {
        await agent.get(`/api/skuitems/sku/${params.id}`).then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
            response.should.to.be.json;
            if (!triggerFails) {
                response.body.should.be.a('array');
            }
        })
    });
}

/**
 * Return a SKU item, given its RFID.
 * -----------------------------------------
 *    API: GET /api/skuitems/:rfid
 * =========================================
 * @param {String} testName specific name of the test run
 * @param {JSON} params JSON Object containing the :id parameter
 * @param {Number} expectedHTTPStatus return status of the API call 
*/
function getSKUitemsByRFID_APITEST(testName, params, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.get(`/api/skuitems/${params.rfid}`).then(async (response) => {
            console.log("Here the response: ");
            console.log(response.body);
            response.should.have.status(expectedHTTPStatus);
            response.should.to.be.json;
        })
    });
}

/**
 * Creates a new SKU item with Available = 0.
 * -------------------------------------------
 *        API: POST /api/skuitem
 * ===========================================
 * @param {String} testName specific name of the test run
 * @param {JSON} request JSON Object containing the skuitem to add in the DB
 * @param {Number} expectedHTTPStatus return status of the API call 
*/
function newSKUitem_APITEST(testName, request, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.post(`/api/skuitem`).send(request).then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
        })
    });
}

/**
 * Modify RFID, available and date of stock 
 * fields of an existing SKU Item.
 * -------------------------------------------
 *       API: PUT /api/skuitems/:rfid
 * ===========================================
 * @param {String} testName specific name of the test run
 * @param {JSON} params JSON Object containing the :rfid parameter
 * @param {JSON} request JSON Object containing the skuitem to add in the DB
 * @param {Number} expectedHTTPStatus return status of the API call 
*/
function editSKUitem_APITEST(testName, params, request, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.put(`/api/skuitems/${params.rfid}`).send(request).then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
        })
    });
}

/**
 * Delete a SKU item receiving his rfid.
 * -------------------------------------------
 *       API: DELETE /api/skuitems/:rfid
 * ===========================================
 * @param {String} testName specific name of the test run
 * @param {JSON} params JSON Object containing the :rfid parameter
 * @param {JSON} request JSON Object containing the skuitem to add in the DB
 * @param {Number} expectedHTTPStatus return status of the API call 
*/
function deleteSKUitem_APITEST(testName, params, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.delete(`/api/skuitems/${params.rfid}`).then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
        });
    });
}