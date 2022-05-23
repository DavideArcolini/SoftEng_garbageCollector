/**
 *      TESTING CLASS: SKUitem 
 * ==================================
 * 
*/

'use strict'

/* ------------ MODULE IMPORT ------------ */
const TestDAO               = require('../test_DB/TestDao');
const SKUitemController     = require('../../controller/SKUitemController');

/* ------------ INITIALIZATION ------------ */
const dao                   = new TestDAO();
const skuitemController     = new SKUitemController(dao);




/**
 *  + ------------------------------------------------ +
 *  |                                                  |
 *  |            T E S T    R E S U L T S              |
 *  |                                                  |
 *  + ------------------------------------------------ +
*/
getSKUitems_TEST(
    'DB: getSKUitems() success',
    {
        code: 200,
        message: [
            {
                "RFID": "00000000000000000000000000000001",
                "SKUId": 1,
                "Available": 0,
                "DateOfStock": "2021/11/29 12:30"
            },
            {
                "RFID": "00000000000000000000000000000002",
                "SKUId": 1,
                "Available": 0,
                "DateOfStock": "2021/11/29 12:31"
            }
        ]
    }
);
getSKUitemsBySKUId_TEST(
    'DB: getSKUitemsBySKUId() success',
    {id: 7},
    {
        code: 200,
        message: [
            {
                "RFID": "00000000000000000000000000000003",
                "SKUId": 7,
                "Available": 1,
                "DateOfStock": "2021/11/29 12:30"
            }
        ]
    }
);
getSKUitemsBySKUId_TEST(
    'DB: getSKUitemsBySKUId() fails',
    {id: 9999},
    {
        code: 404,
        message: "Not Found"
    }
);
getSKUitemsByRFID_TEST(
    'DB: getSKUitemsByRFID() success',
    {rfid: "00000000000000000000000000000005"},
    {
        code: 200,
        message: [
            {
                "RFID": "00000000000000000000000000000005",
                "SKUId": 1,
                "Available": 1,
                "DateOfStock": "2021/11/29 12:30"
            }
        ]
    }
);
getSKUitemsByRFID_TEST(
    'DB: getSKUitemsByRFID() fails',
    {rfid: "99999999999999999999999999999999"},
    {
        code: 404,
        message: "Not Found"
    }
);
newSKUitem_TEST(
    'DB: newSKUitem() success',
    {
        "RFID": "00000000000000000000000000000010",
        "SKUId": 8,
        "DateOfStock": "2021/11/29 12:30"
    },
    {
        code: 201,
        message: "CREATED"
    }
);
editSKUitem_TEST(
    'DB: editSKUitem() success',
    {rfid: "00000000000000000000000000000011"},
    {
        "newRFID": "00000000000000000000000000000093",
        "newAvailable": 0,
        "newDateOfStock":"2021/11/29 12:30"
    },
    {
        code: 200,
        message: "OK"
    }
);
editSKUitem_TEST(
    'DB: editSKUitem() success',
    {rfid: "99999999999999999999999999999999"},
    {
        "newRFID": "00000000000000000000000000000093",
        "newAvailable": 0,
        "newDateOfStock":"2021/11/29 12:30"
    },
    {
        code: 404,
        message: "Not Found"
    }
);
deleteSKUitem_TEST(
    'DB: deleteSKUitem() success',
    {rfid: "00000000000000000000000000000008"},
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
 * Return an array containing all SKU items.
 * -----------------------------------------
 *         API: /api/skuitems
 * =========================================
 * @param {String} describe_NAME specific description of the test run
 * @param {Array} expectedResult JSON Array containing the result of the query
*/
function getSKUitems_TEST(describe_NAME, expectedResult) {
    describe('TEST (DB): getSKUitems()', () => {
        beforeAll(async () => {
            const query_SQL = "INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 0, ?)";
            await dao.run(query_SQL, ["00000000000000000000000000000001", 1, "2021/11/29 12:30"]);
            await dao.run(query_SQL, ["00000000000000000000000000000002", 1, "2021/11/29 12:31"]);
        });

        test(describe_NAME, async () => {
            const result = await skuitemController.getSKUitems();
            expect(result).toEqual(expectedResult);
        });

        afterAll(async () => {
            const query_SQL = "DELETE FROM SKUITEMS WHERE SKUITEMS.RFID == ?";
            await dao.run(query_SQL, ["00000000000000000000000000000001"]);
            await dao.run(query_SQL, ["00000000000000000000000000000002"]);
        });
    });
}

/**
 * Return an array containing all SKU items for a certain SKUId 
 * with Available = 1.
 * --------------------------------------------------------------
 *               API: GET /api/skuitems/sku/:id
 * ==============================================================
 * @param {String} describe_NAME specific description of the test run
 * @param {JSON} params JSON Object containing the :id specified
 * @param {Array} expectedResult JSON Array containing the result of the query
*/
function getSKUitemsBySKUId_TEST(describe_NAME, params, expectedResult) {
    describe('TEST (DB): getSKUitemsBySKUId()', () => {
        beforeAll(async () => {
            const query_SKU_SQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)";
            await dao.run(query_SKU_SQL, [7, "Test", 1, 1, "Test", 1, 1]);
            const query_SKUitems_SQL = "INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, ?, ?)";
            await dao.run(query_SKUitems_SQL, ["00000000000000000000000000000003", 7, 1, "2021/11/29 12:30"]);
            await dao.run(query_SKUitems_SQL, ["00000000000000000000000000000004", 7, 0, "2021/11/29 12:31"]);
        });

        test(describe_NAME, async () => {
            const result = await skuitemController.getSKUitemsBySKUId(params);
            expect(result).toEqual(expectedResult);
        });

        afterAll(async () => {
            const query_SKU_SQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
            await dao.run(query_SKU_SQL, [7]);
            const query_SQL = "DELETE FROM SKUITEMS WHERE SKUITEMS.RFID == ?";
            await dao.run(query_SQL, ["00000000000000000000000000000003"]);
            await dao.run(query_SQL, ["00000000000000000000000000000004"]);
        });
    });
}

/**
 * Return a SKU item, given its RFID.
 * --------------------------------------------------------------
 *                API: GET /api/skuitems/:rfid
 * ==============================================================
 * @param {String} describe_NAME specific description of the test run
 * @param {JSON} params JSON Object containing the :id specified
 * @param {Array} expectedResult JSON Array containing the result of the query
*/
function getSKUitemsByRFID_TEST(describe_NAME, params, expectedResult) {
    describe('TEST (DB): getSKUitemsByRFID()', () => {
        beforeAll(async () => {
            const query_SKUitems_SQL = "INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, ?, ?)";
            await dao.run(query_SKUitems_SQL, ["00000000000000000000000000000005", 1, 1, "2021/11/29 12:30"]);
            await dao.run(query_SKUitems_SQL, ["00000000000000000000000000000006", 1, 0, "2021/11/29 12:31"]);
        });

        test(describe_NAME, async () => {
            const result = await skuitemController.getSKUitemsByRFID(params);
            expect(result).toEqual(expectedResult);
        });

        afterAll(async () => {
            const query_SQL = "DELETE FROM SKUITEMS WHERE SKUITEMS.RFID == ?";
            await dao.run(query_SQL, ["00000000000000000000000000000005"]);
            await dao.run(query_SQL, ["00000000000000000000000000000006"]);
        });
    });
}


/**
 * Creates a new SKU item with Available = 0.
 * ---------------------------------------------------------
 *                 API: POST /api/skuitem
 * =========================================================
 * @param {String} describe_NAME specific description of the test run
 * @param {JSON} request JSON Object containing the SKUitem to add to the DB
 * @param {JSON} expectedResult JSON object returned by the function
*/
function newSKUitem_TEST(describe_NAME, request, expectedResult) {
    describe('TEST (DB): newSKUitem()', () => {
        beforeAll(async () => {
            const query_SQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            await dao.run(query_SQL, [8, 150, 50, "first SKU", null, 10.99, 1]);            
        });

        test(describe_NAME, async () => {
            const result = await skuitemController.newSKUitem(request);
            expect(result).toEqual(expectedResult);
        });

        afterAll(async () => {
            const query_SKU_SQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
            await dao.run(query_SKU_SQL, [8]);
            const query_SKUitem_SQL = "DELETE FROM SKUITEMS WHERE SKUITEMS.RFID == ?";
            await dao.run(query_SKUitem_SQL, ["00000000000000000000000000000010"]);
        });
    });
}

/**
 * Modify RFID, available and date of stock fields of an 
 * existing SKU Item.
 * ---------------------------------------------------------
 *             API: PUT /api/skuitems/:rfid
 * =========================================================
 * @param {String} describe_NAME specific description of the test run
 * @param {JSON} param JSON Object containing the :rfid of the skuitem to modify
 * @param {JSON} request JSON Object containing the SKUitem to add to the DB
 * @param {JSON} expectedResult JSON object returned by the function
*/
function editSKUitem_TEST(describe_NAME, params, request, expectedResult) {
    describe('TEST: editSKUitem()', () => {
        beforeAll(async () => {            
            const query_SKUitems_SQL = "INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, ?, ?)";
            await dao.run(query_SKUitems_SQL, ["00000000000000000000000000000011", 1, 1, "2021/11/29 12:30"]);
        });

        test(describe_NAME, async () => {
            const result = await skuitemController.editSKUitem(params, request);
            expect(result).toEqual(expectedResult);
        });

        afterAll(async () => {
            const query_SQL = "DELETE FROM SKUITEMS WHERE SKUITEMS.RFID == ?";
            await dao.run(query_SQL, ["00000000000000000000000000000093"]);
            await dao.run(query_SQL, ["00000000000000000000000000000011"]);
        });
    });
}

/**
 * Delete a SKU item receiving his rfid.
 * --------------------------------------------------------------
 *                API: DELETE /api/skuitems/:rfid
 * ==============================================================
 * @param {String} describe_NAME specific description of the test run
 * @param {JSON} params JSON Object containing the :id specified
 * @param {Array} expectedResult JSON Array containing the result of the query
*/
function deleteSKUitem_TEST(describe_NAME, params, expectedResult) {
    describe('TEST (DB): deleteSKUitem()', () => {
        beforeAll(async () => {            
            const query_SKUitems_SQL = "INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, ?, ?)";
            await dao.run(query_SKUitems_SQL, ["00000000000000000000000000000008", 1, 1, "2021/11/29 12:30"]);
        });

        test(describe_NAME, async () => {
            const result = await skuitemController.deleteSKUitem(params);
            expect(result).toEqual(expectedResult);
        });
    });
}