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
*           API: GET /api/skus
* =============================================
*/
describe('API: GET /api/skus', () => {
    getStoredSKUs_APITEST(
        '[200] OK',
        200
    );
});

/*
* ---------------------------------------------
*           API: GET /api/skus/:id
* =============================================
*/
describe('API: GET /api/skus/:id', () => {
    getStoredSKUById_APITEST(
        '[200] OK',
        {id: 1},
        200
    );

    getStoredSKUById_APITEST(
        '[404] Not Found (id non existing)',
        {id: 99999},
        404
    );

    getStoredSKUById_APITEST(
        '[422] Unprocessable Entity (id constraints failed)',
        {id: "FailingHere"},
        422
    );
});

/*
* ---------------------------------------------
*            API: POST /api/sku
* =============================================
*/
describe('API: POST /api/sku', () => {
    newSKU_APITEST(
        '[201] Created',
        {
            "description": "toBeRemoved_APITEST",
            "weight": 100,
            "volume": 50,
            "notes": "first SKU",
            "price": 10.99,
            "availableQuantity": 50
        },
        201
    );

    newSKU_APITEST(
        '[422] Unprocessable Entity (body constraints failed)',
        {
            "description": "toBeRemoved_APITEST",
            "weight": -100,
            "volume": 50,
            "notes": "first SKU",
            "price": 10.99,
            "availableQuantity": 50
        },
        422
    );

    after(async () => {
        await dao.run("DELETE FROM SKUS WHERE SKUS.description == ?", ["toBeRemoved_APITEST"]);
    });
});

/*
* ---------------------------------------------
*            API: PUT /api/sku/:id
* =============================================
*/
describe('API: PUT /api/sku/:id', () => {
    before(async () => {
        await dao.run("INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)", [
            999,
            "toBeRemoved_APITEST",
            100,
            50,
            "first SKU",
            10.99,
            50
        ]);
    });

    editSKU_APITEST(
        '[200] OK',
        {id: 999},
        {
            "newDescription": "toBeRemoved_APITEST",
            "newWeight": 100,
            "newVolume": 50,
            "newNotes": "first SKU",
            "newPrice": 10.99,
            "newAvailableQuantity": 50
        },
        200
    );

    editSKU_APITEST(
        '[404] Not Found (id non existing)',
        {id: 111999},
        {
            "newDescription": "toBeRemoved_APITEST",
            "newWeight": 100,
            "newVolume": 50,
            "newNotes": "first SKU",
            "newPrice": 10.99,
            "newAvailableQuantity": 50
        },
        404
    );

    editSKU_APITEST(
        '[422] Unprocessable Entity (body constraints failed)',
        {id: 999},
        {
            "newDescription": "toBeRemoved_APITEST",
            "newWeight": 100,
            "newVolume": -50,
            "newNotes": "first SKU",
            "newPrice": 10.99,
            "newAvailableQuantity": 50
        },
        422
    );

    after(async () => {
        await agent.delete('/api/skus/999');
    });
});

/*
* ---------------------------------------------
*            API: PUT /api/sku/:id/position
* =============================================
*/
describe('API: PUT /api/sku/:id/position', () => {
    before(async () => {
        await dao.run("INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)", [
            888,
            "toBeRemoved_APITEST",
            100,
            50,
            "first SKU",
            10.99,
            1
        ]);

        await dao.run("INSERT INTO POSITIONS (POSITIONID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES (?, ?, ?, ?, ?, ?, 0, 0)", [
            "999910019999",
            "9999",
            "1001",
            "9999",
            1000,
            1000
        ]);
        await dao.run("INSERT INTO POSITIONS (POSITIONID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES (?, ?, ?, ?, ?, ?, 0, 0)", [
            "999912219999",
            "9999",
            "1221",
            "9999",
            1000,
            1000
        ]);
    });

    addOrEditPositionSKU_APITEST(
        '[200] OK',
        {id: 888},
        {position: "999910019999"},
        200
    );

    addOrEditPositionSKU_APITEST(
        '[404] Not Found (id non existing)',
        {id: 999999},
        {position: "999912219999"},
        404
    );

    addOrEditPositionSKU_APITEST(
        '[404] Not Found (position non existing)',
        {id: 888},
        {position: "999911119999"},
        404
    );

    addOrEditPositionSKU_APITEST(
        '[422] Unprocessable Entity (body constraints failed)',
        {id: 888},
        {position: "FailingHere"},
        422
    );

    after(async () => {
        await agent.delete('/api/skus/888');
        await agent.delete('/api/position/999910019999');
        await agent.delete('/api/position/999912219999');
    });
});

/*
* ---------------------------------------------
*          API: DELETE /api/skus/:id
* =============================================
*/
describe('API: DELETE /api/skus/:id', () => {
    before(async () => {
        await dao.run("INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)", [
            777,
            "toBeRemoved_APITEST",
            100,
            50,
            "first SKU",
            10.99,
            1
        ]);
    });

    deleteSKU_APITEST(
        '204 No Content',
        {id: 777},
        204
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
 * Get all the SKUs in the database.
 * -----------------------------------------
 *         API: GET /api/skus
 * =========================================
 * @param {String} testName specific name of the test run
 * @param {Number} expectedHTTPStatus return status of the API call 
*/
function getStoredSKUs_APITEST(testName, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.get('/api/skus').then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
            response.should.to.be.json;
            response.body.should.be.a('array');
        });
    });
}

/**
 * Retrieve an SKU given its identifier ID
 * -----------------------------------------
 *         API: GET /api/skus/:id
 * =========================================
 * @param {String} testName specific name of the test run
 * @param {JSON} params JSON Object containing the :id parameter
 * @param {Number} expectedHTTPStatus return status of the API call 
*/
function getStoredSKUById_APITEST(testName, params, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.get(`/api/skus/${params.id}`).then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
            response.should.to.be.json;
        });
    });
}

/**
 * Create a new SKU object and store it in
 * the database.
 * -----------------------------------------
 *         API: POST /api/sku
 * =========================================
 * @param {String} testName specific name of the test run
 * @param {JSON} request JSON Object containing the SKU to add to the DB
 * @param {Number} expectedHTTPStatus return status of the API call 
*/
function newSKU_APITEST(testName, request, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.post(`/api/sku`).send(request).then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
        });
    });
}

/**
 * Modify an existing SKU. When a newAvailableQuantity is sent, occupiedWeight and 
 * occupiedVolume fields of the position (if the SKU is associated to a position) are 
 * modified according to the new available quantity.
 * -----------------------------------------
 *         API: PUT /api/sku/:id
 * =========================================
 * @param {String} testName specific name of the test run
 * @param {JSON} params JSON Object containing the :id parameter
 * @param {JSON} request JSON Object containing the SKU to add to the DB
 * @param {Number} expectedHTTPStatus return status of the API call 
*/
function editSKU_APITEST(testName, params, request, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.put(`/api/sku/${params.id}`).send(request).then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
        });
    });
}

/**
 * Add or modify position of a SKU. When a SKU is associated to a position, 
 * occupiedWeight and occupiedVolume fields of the position are modified according to 
 * the available quantity.
 * -----------------------------------------
 *      API: PUT /api/sku/:id/position
 * =========================================
 * @param {String} testName specific name of the test run
 * @param {JSON} params JSON Object containing the :id parameter
 * @param {JSON} request JSON Object containing the SKU to add to the DB
 * @param {Number} expectedHTTPStatus return status of the API call 
*/
function addOrEditPositionSKU_APITEST(testName, params, request, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.put(`/api/sku/${params.id}/position`).send(request).then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
        });
    });
}

/**
 * Delete an SKU given its identifier ID
 * -----------------------------------------
 *      API: DELETE /api/skus/:id
 * =========================================
 * @param {String} testName specific name of the test run
 * @param {JSON} params JSON Object containing the :id parameter
 * @param {Number} expectedHTTPStatus return status of the API call 
*/
function deleteSKU_APITEST(testName, params, expectedHTTPStatus) {
    it(testName, async () => {
        await agent.delete(`/api/skus/${params.id}`).then(async (response) => {
            response.should.have.status(expectedHTTPStatus);
        });
    })
}