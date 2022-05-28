/**
 *      TESTING CLASS: SKUitem 
 * ==================================
 * 
*/

'use strict'

/* ------------ MODULE IMPORT ------------ */
const TestDAO               = require('../test_DB/TestDao');
const SKUController         = require('../../controller/SKUController');

/* ------------ INITIALIZATION ------------ */
const dao                   = new TestDAO();
const skuController         = new SKUController(dao);




/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |            T E S T    R E S U L T S              |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/
getStoredSKUs_TEST(
    'DB: getStoredSKUs() success',
    {
        code: 200,
        message: [
            {
                id: 1111,
                description: "A new SKU",
                weight: 150,
                volume: 50,
                notes: "first SKU",
                position: null,
                availableQuantity: 50,
                price: 10.99,
                testDescriptors: []
            }, 
            {
                id: 2222,
                description: "Another SKU",
                weight: 101,
                volume: 60,
                notes: "second SKU",
                position: "800212344532",
                availableQuantity: 1,
                price: 110.99,
                testDescriptors: []
            }
        ]
    }
)
getStoredSKUById_TEST(
    'DB: getStoredSKUById() success',
    {id: 3},
    {
        code: 200,
        message: {
            id: 3,
            description: "A new SKU",
            weight: 150,
            volume: 50,
            notes: "first SKU",
            position: null,
            availableQuantity: 50,
            price: 10.99,
            testDescriptors: []
        }
    }
);
getStoredSKUById_TEST(
    'DB: getStoredSKUById() fails',
    {id: 999},
    {
        code: 404,
        message: "Not Found"
    }
);
newSKU_TEST(
    'DB: newSKU() success',
    {
        description: "Inserted with newSKU()",
        weight: 100,
        volume: 50,
        notes: "first SKU",
        price: 10.99,
        availableQuantity: 50
    },
    {
        code: 201,
        message: "CREATED"
    }
);
editSKU_TEST(
    'DB: editSKU() success',
    {id: 4},
    {
        newDescription: "a real new sku",
        newWeight: 100,
        newVolume: 50,
        newNotes: "first SKU",
        newPrice: 10.99,
        newAvailableQuantity: 50
    },
    {
        code: 200,
        message: "OK"
    }
);
editSKU_TEST(
    'DB: editSKU() fails',
    {id: 999},
    {
        newDescription: "a real new sku",
        newWeight: 100,
        newVolume: 50,
        newNotes: "first SKU",
        newPrice: 10.99,
        newAvailableQuantity: 50
    },
    {
        code: 404,
        message: "Not Found"
    }
);
addOrEditPositionSKU_TEST(
    'DB: addOrEditPositionSKU() success',
    {id: 5},
    {position: 100010001000},
    {
        code: 200,
        message: "OK"
    }
);
addOrEditPositionSKU_TEST(
    'DB: addOrEditPositionSKU() fails',
    {id: 999},
    {position: 800234543412},
    {
        code: 404,
        message: "Not Found"
    }
);
addOrEditPositionSKU_TEST(
    'DB: addOrEditPositionSKU() fails',
    {id: 1},
    {position: 999999999999},
    {
        code: 404,
        message: "Not Found"
    }
);
deleteSKU_TEST(
    'DB: deleteSKU() success',
    {id: 6},
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
 * Get all the SKUs in the database.
 * -----------------------------------------
 *         API: GET /api/skus
 * =========================================
 * @param {String} describe_NAME specific description of the test run
 * @param {Array} expectedResult JSON Array containing the result of the query
*/
function getStoredSKUs_TEST(describe_NAME, expectedResult) {
    describe('TEST (DB): getStoredSKUs()', () => {
        beforeAll(async () => {
            const query_SQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            await dao.run(query_SQL, [1111, "A new SKU", 150, 50, "first SKU", null, 10.99, 50]);
            await dao.run(query_SQL, [2222, "Another SKU", 101, 60, "second SKU", "800212344532", 110.99, 1]);
        });

        test(describe_NAME, async () => {
            const result = await skuController.getStoredSKUs();
            expect(result).toEqual(expectedResult)
        });

        afterAll(async () => {
            const query_SQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
            await dao.run(query_SQL, [1111]);
            await dao.run(query_SQL, [2222]);
        });
    });
}

/**
 * Retrieve an SKU given its identifier ID
 * -----------------------------------------
 *         API: GET /api/skus/:id
 * =========================================
 * @param {String} describe_NAME specific description of the test run
 * @param {JSON} params JSON Object containing the :id specified
 * @param {Array} expectedResult JSON Array containing the result of the query
*/
function getStoredSKUById_TEST(describe_NAME, params, expectedResult) {
    describe('TEST (DB): getStoredSKUById()', () => {
        beforeAll(async () => {
            const query_SQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            await dao.run(query_SQL, [3, "A new SKU", 150, 50, "first SKU", null, 10.99, 50]);
        });

        test(describe_NAME, async () => {
            const result = await skuController.getStoredSKUById(params);
            expect(result).toEqual(expectedResult)
        });

        afterAll(async () => {
            const query_SQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
            await dao.run(query_SQL, [3]);
        });
    });
}

/**
 * Create a new SKU object and store it in the database.
 * -----------------------------------------------------
 *                API: POST /api/sku
 * =====================================================
 * @param {String} describe_NAME specific description of the test run
 * @param {JSON} request JSON Object containing the SKUitem to add to the DB
 * @param {Array} expectedResult JSON Array containing the result of the query
*/
function newSKU_TEST(describe_NAME, request, expectedResult) {
    describe('TEST (DB): newSKU()', () => {
        test(describe_NAME, async () => {
            const result = await skuController.newSKU(request);
            expect(result).toEqual(expectedResult)
        });

        afterAll(async () => {
            const query_SQL = "DELETE FROM SKUS WHERE SKUS.description == ?";
            await dao.run(query_SQL, [request.description]);
        });
    });
}

/**
 * Modify an existing SKU. When a newAvailableQuantity is sent, occupiedWeight and 
 * occupiedVolume fields of the position (if the SKU is associated to a position) are 
 * modified according to the new available quantity.
 * -----------------------------------------------------
 *                 API: PUT /api/sku/:id
 * =====================================================
 * @param {String} describe_NAME specific description of the test run
 * @param {JSON} params JSON Object containing the :id specified
 * @param {JSON} request JSON Object containing the SKUitem to add to the DB
 * @param {Array} expectedResult JSON Array containing the result of the query
*/
function editSKU_TEST(describe_NAME, params, request, expectedResult) {
    describe('TEST (DB): editSKU()', () => {
        beforeEach(async () => {
            const query_SQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            await dao.run(query_SQL, [4, "A new SKU", 150, 50, "first SKU", null, 10.99, 50]);
        });

        test(describe_NAME, async () => {
            const result = await skuController.editSKU(params, request);
            expect(result).toEqual(expectedResult)
        });

        afterEach(async () => {
            const query_SQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
            await dao.run(query_SQL, [4]);
        });
    });
}
/**
 * Add or modify position of a SKU. When a SKU is associated to a position,
 * occupiedWeight and occupiedVolume fields of the position are modified according to 
 * the available quantity.
 * -----------------------------------------------------
 *           API: PUT /api/sku/:id/position
 * =====================================================
 * @param {String} describe_NAME specific description of the test run
 * @param {JSON} params JSON Object containing the :id specified
 * @param {JSON} request JSON Object containing the SKUitem to add to the DB
 * @param {Array} expectedResult JSON Array containing the result of the query
*/
function addOrEditPositionSKU_TEST(describe_NAME, params, request, expectedResult) {
    describe('TEST (DB): addOrEditPositionSKU()', () => {
        beforeAll(async () => {
            const query_position_SQL = "INSERT INTO POSITIONS (POSITIONID, AISLEID, ROW, COL, MAXWEIGHT, MAXVOLUME, OCCUPIEDWEIGHT, OCCUPIEDVOLUME) VALUES (?, ?, ?, ?, ?, ?, 0, 0)";
            await dao.run(query_position_SQL, [100010001000, 1000, 1000, 1000, 1000, 1000]);

            const query_SQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            await dao.run(query_SQL, [5, "A new SKU", 150, 50, "first SKU", null, 10.99, 1]);
        });

        test(describe_NAME, async () => {
            const result = await skuController.addOrEditPositionSKU(params, request);
            expect(result).toEqual(expectedResult)
        });

        afterAll(async () => {
            const query_position_SQL = "DELETE FROM POSITIONS WHERE POSITIONS.positionID == ?";
            await dao.run(query_position_SQL, [100010001000]);

            const query_SKU_SQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
            await dao.run(query_SKU_SQL, [5]);
        });
    });
}

/**
 * Delete an SKU given its identifier ID
 * -----------------------------------------------------
 *             API: DELETE /api/skus/:id
 * =====================================================
 * @param {String} describe_NAME specific description of the test run
 * @param {JSON} params JSON Object containing the :id specified
 * @param {Array} expectedResult JSON Array containing the result of the query
*/
function deleteSKU_TEST(describe_NAME, params, expectedResult) {
    describe('TEST: deleteSKU()', () => {
        beforeAll(async () => {
            const query_SQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            await dao.run(query_SQL, [6, "A new SKU", 150, 50, "first SKU", null, 10.99, 1]);
        });

        test(describe_NAME, async () => {
            const result = await skuController.deleteSKU(params);
            expect(result).toEqual(expectedResult)
        });
    });
}