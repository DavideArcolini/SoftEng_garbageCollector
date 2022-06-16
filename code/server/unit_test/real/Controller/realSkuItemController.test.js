/**
 *  INTEGRATION TEST: positionController
 *           VERSION: real
 * --------------------------------------------
 * Services do access the database (although it
 * is a test database).
*/

/* --------- IMPORT MODULES --------- */
const SKUitemController     = require('../../../controller/SKUitemController');
const SKUitemDAO            = require('../../../db/skuItemDAO');
const SKUDAO                = require('../../../db/skuDAO');
const TestDAO               = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const testDAO               = new TestDAO();
const skuItemDAO            = new SKUitemDAO(testDAO);
const skuDAO                = new SKUDAO(testDAO);
const skuItemController     = new SKUitemController(skuItemDAO, skuDAO);

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
const skuItemsTestArray = [
    {
        RFID: "12345678901234567890123456789014",
        SKUId: 1111,
        Available: 0,
        DateOfStock: "2021/11/29 12:30",
    }, {
        RFID: "12345678901234567890123456789015",
        SKUId: 1111,
        Available: 0,
        DateOfStock: ""
    }
];

const skuItemsAvailableTestArray = [
    {
        RFID: "12345678901234567890123456789014",
        SKUId: 1111,
        Available: 1,
        DateOfStock: "2021/11/29 12:30",
    }, {
        RFID: "12345678901234567890123456789015",
        SKUId: 1111,
        Available: 1,
        DateOfStock: ""
    }
];








/*
    + -------------------- +
    |         TESTS        |
    + -------------------- +
*/
/**
 * INTEGRATION TEST: skuItemController.getSKUitems()
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: skuItemController.getSKUitems', () => {

    beforeAll(async () => {
        /* adding SKU to DB */
        const query_SQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await testDAO.run(query_SQL, [1111, "A new SKU", 150, 50, "first SKU", null, 10.99, 50]);

        /* adding SKUitems to DB */
        await skuItemDAO.newSkuItem({
            RFID: "12345678901234567890123456789014",
            SKUId: 1111,
            DateOfStock: "2021/11/29 12:30",
        });

        await skuItemDAO.newSkuItem({
            RFID: "12345678901234567890123456789015",
            SKUId: 1111,
        });
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
    testGetSKUitems_REAL(
        '- Success: ', 
        {
            code: 200,
            message: skuItemsTestArray
        }
    );

    afterAll(async () => {
        /* removing SKUitems from DB */
        await skuItemController.deleteSKUitem({rfid: "12345678901234567890123456789014"});
        await skuItemController.deleteSKUitem({rfid: "12345678901234567890123456789015"});

        /* removing SKU from DB */
        const query_SQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
        await testDAO.run(query_SQL, [1111]);
    });

});
/**
 * INTEGRATION TEST: skuItemController.getSKUitemsBySKUId()
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: skuItemController.getSKUitemsBySKUId', () => {

    beforeAll(async () => {
        /* adding SKU to DB */
        const querySKU_SQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await testDAO.run(querySKU_SQL, [1111, "A new SKU", 150, 50, "first SKU", null, 10.99, 50]);
        await testDAO.run(querySKU_SQL, [1112, "A new SKU", 150, 50, "first SKU", null, 10.99, 50]);

        /* adding SKUitems to DB */
        const querySKUitems_SQL = "INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 1, ?)";
        await testDAO.run(querySKUitems_SQL, ["12345678901234567890123456789014", 1111, "2021/11/29 12:30"]);
        await testDAO.run(querySKUitems_SQL, ["12345678901234567890123456789015", 1111, ""]);
        await testDAO.run(querySKUitems_SQL, ["12345678901234567890123456789016", 1112, "2021/11/29 12:31"]);
        
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetSKUitemsBySKUId_REAL(
        '- Success: ',
        {id: 1111},
        {
            code: 200,
            message: skuItemsAvailableTestArray
        }
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testGetSKUitemsBySKUId_REAL(
        '- SKU not found: ', 
        {id: 9999},
        ERROR_404
    );

    afterAll(async () => {
        /* removing SKUitems from DB */
        await skuItemController.deleteSKUitem({rfid: "12345678901234567890123456789014"});
        await skuItemController.deleteSKUitem({rfid: "12345678901234567890123456789015"});
        await skuItemController.deleteSKUitem({rfid: "12345678901234567890123456789016"});

        /* removing SKU from DB */
        const query_SQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
        await testDAO.run(query_SQL, [1111]);
        await testDAO.run(query_SQL, [1112]);
    });
});

/**
 * INTEGRATION TEST: skuItemController.getSKUitemsByRFID()
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: skuItemController.getSKUitemsByRFID', () => {

    beforeAll(async () => {
        /* adding SKU to DB */
        const querySKU_SQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await testDAO.run(querySKU_SQL, [1111, "A new SKU", 150, 50, "first SKU", null, 10.99, 50]);

        /* adding SKUitems to DB */
        const querySKUitems_SQL = "INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 1, ?)";
        await testDAO.run(querySKUitems_SQL, ["12345678901234567890123456789014", 1111, "2021/11/29 12:30"]);
        
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetSKUitemsByRFID_REAL(
        '- Success: ',
        {rfid: "12345678901234567890123456789014"},
        {
            code: 200,
            message: skuItemsAvailableTestArray[0]
        }
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testGetSKUitemsByRFID_REAL(
        '- SKUitem not found: ',
        {rfid: "99999999999999999999999999999999"},
        ERROR_404
    );

    afterAll(async () => {
        /* removing SKUitems from DB */
        await skuItemController.deleteSKUitem({rfid: "12345678901234567890123456789014"});

        /* removing SKU from DB */
        const query_SQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
        await testDAO.run(query_SQL, [1111]);
    });
});

/**
 * INTEGRATION TEST: skuItemController.newSKUitem()
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: skuItemController.newSKUitem', () => {

    beforeAll(async () => {
        /* adding SKU to DB */
        const querySKU_SQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await testDAO.run(querySKU_SQL, [1111, "A new SKU", 150, 50, "first SKU", null, 10.99, 50]);
        
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testNewSKUitem_REAL(
        '- SKU not found: ',
        {
            RFID: "12345678901234567890123456789014",
            SKUId: 9999,
            DateOfStock: "2021/11/29 12:30",
        },
        ERROR_404
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testNewSKUitem_REAL(
        '- Success: ',
        {
            RFID: "12345678901234567890123456789014",
            SKUId: 1111,
            DateOfStock: "2021/11/29 12:30",
        },
        MESSG_201
    );

    afterAll(async () => {
        /* removing SKUitems from DB */
        await skuItemController.deleteSKUitem({rfid: "12345678901234567890123456789014"});

        /* removing SKU from DB */
        const query_SQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
        await testDAO.run(query_SQL, [1111]);
    });
});


/**
 * INTEGRATION TEST: skuItemController.editSKUitem()
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: skuItemController.editSKUitem', () => {

    beforeAll(async () => {
        /* adding SKU to DB */
        const querySKU_SQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await testDAO.run(querySKU_SQL, [1111, "A new SKU", 150, 50, "first SKU", null, 10.99, 50]);
       
        /* adding SKUitems to DB */
        const querySKUitems_SQL = "INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 1, ?)";
        await testDAO.run(querySKUitems_SQL, ["12345678901234567890123456789014", 1111, "2021/11/29 12:30"]);
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testEditSKUitem_REAL(
        '- SKUitem not found: ',
        {rfid: "99999999999999999999999999999999"}, 
        {
            newRFID: "12345678901234567890123456789014",
            newAvailable: 0,
            newDateOfStock: "2021/11/29 12:30",
        },
        ERROR_404
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: Success
     * ---------------------------------
     */
     testEditSKUitem_REAL(
        '- Success ',
        {rfid: "12345678901234567890123456789014"}, 
        {
            newRFID: "12345678901234567890123456789015",
            newAvailable: 0,
            newDateOfStock: "2021/11/29 12:30",
        },
        MESSG_200
    );

    afterAll(async () => {
        /* removing SKUitems from DB */
        await skuItemController.deleteSKUitem({rfid: "12345678901234567890123456789015"});

        /* removing SKU from DB */
        const query_SQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
        await testDAO.run(query_SQL, [1111]);
    });
});

/**
 * INTEGRATION TEST: skuItemController.deleteSKUitem()
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: skuItemController.deleteSKUitem', () => {

    beforeAll(async () => {
        /* adding SKU to DB */
        const querySKU_SQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await testDAO.run(querySKU_SQL, [1111, "A new SKU", 150, 50, "first SKU", null, 10.99, 50]);
       
        /* adding SKUitems to DB */
        const querySKUitems_SQL = "INSERT INTO SKUITEMS (RFID, SKUId, Available, DateOfStock) VALUES (?, ?, 1, ?)";
        await testDAO.run(querySKUitems_SQL, ["12345678901234567890123456789014", 1111, "2021/11/29 12:30"]);
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: Success
     * ---------------------------------
     */
     testDeleteSKUitem_REAL(
        '- Success ',
        {rfid: "12345678901234567890123456789014"}, 
        MESSG_204
    );

    afterAll(async () => {
        /* removing SKU from DB */
        const query_SQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
        await testDAO.run(query_SQL, [1111]);
    });
});






/*
    + -------------------- +
    |      FUNCTIONS       |
    + -------------------- +
*/
/**
 * INTEGRATION TEST: skuItemController.getSKUitems()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetSKUitems_REAL(testName, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuItemController.getSKUitems();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    })
}
/**
 * INTEGRATION TEST: SKUitemController.getSKUitemsBySKUId()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} params contains the identifier of the target SKU
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetSKUitemsBySKUId_REAL(testName, params, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuItemController.getSKUitemsBySKUId(params);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: SKUitemController.getSKUitemsByRFID()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} params contains the identifier of the target SKUitem
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetSKUitemsByRFID_REAL(testName, params, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuItemController.getSKUitemsByRFID(params);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: SKUitemController.newSKUitem()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} body contains the new SKUitem object to be added in the DB
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testNewSKUitem_REAL(testName, body, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuItemController.newSKUitem(body);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: SKUitemController.editSKUitem()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} params contains the identifier of the target SKUitem
 * @param {Object} body contains the new SKUitem object to be added in the DB
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testEditSKUitem_REAL(testName, params, body, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuItemController.editSKUitem(params, body);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: SKUitemController.deleteSKUitem()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} params contains the identifier of the target SKUitem
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testDeleteSKUitem_REAL(testName, params, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuItemController.deleteSKUitem(params);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}