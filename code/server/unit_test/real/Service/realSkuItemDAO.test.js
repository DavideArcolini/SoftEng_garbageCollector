/**
 *  UNIT TEST: positionDAO
 *    VERSION: real
 * ===========================
 */

/* --------- IMPORT MODULES --------- */
const SkuItemDAO    = require('../../../db/skuItemDAO');
const DAO           = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const dao         = new DAO();
const skuItemDAO  = new SkuItemDAO(dao);

/*
    + -------------------- +
    |         DATA         |
    + -------------------- +
*/
const skuItemsTestArray = [
    {
        RFID: "12345678901234567890123456789014",
        SKUId: 1,
        Available: 0,
        DateOfStock: "2021/11/29 12:30",
    }, {
        RFID: "12345678901234567890123456789015",
        SKUId: 1,
        Available: 1,
        DateOfStock: "2021/11/29 12:30"
    }, {
        RFID: "12345678901234567890123456789016",
        SKUId: 1,
        Available: 1,
        DateOfStock: "2021/11/29 12:30"
    }, {
        RFID: "12345678901234567890123456789017",
        SKUId: 2,
        Available: 1,
        DateOfStock: "2021/11/29 12:30"
    }
];


/*
    + -------------------- +
    |         TESTS        |
    + -------------------- +
*/
/**
 * UNIT TEST: positionDAO.getSKUitems()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.getSKUitems()', () => {
    beforeAll(async () => {

        /* adding SKU to DB */
        const querySKUSQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)";
        await dao.run(querySKUSQL, [1, "A new SKU", 100, 100, "First SKU", 10.99, 1]);
        await dao.run(querySKUSQL, [2, "Another new SKU", 10000, 10000, "Second SKU", 10.99, 1]);

        /* adding SKUitems to DB */
        const querySKUitemsSQL = "INSERT INTO SKUITEMS VALUES (?, ?, ?, ?)";
        await dao.run(querySKUitemsSQL, ["12345678901234567890123456789014", 1, 0, "2021/11/29 12:30"]);
        await dao.run(querySKUitemsSQL, ["12345678901234567890123456789015", 1, 1, "2021/11/29 12:30"]);
        await dao.run(querySKUitemsSQL, ["12345678901234567890123456789016", 1, 1, "2021/11/29 12:30"]);
        await dao.run(querySKUitemsSQL, ["12345678901234567890123456789017", 2, 1, "2021/11/29 12:30"]);
        
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testGetSKUitems_REAL(
        '- Success: ', 
        skuItemsTestArray
    );

    afterAll(async () => {
        const querySKUitemsSQL = "DELETE FROM SKUITEMS";
        const querySKUSQL = "DELETE FROM SKUS";
        await dao.run(querySKUitemsSQL);
        await dao.run(querySKUSQL);
    });

});


/**
 * UNIT TEST: positionDAO.getSKUitemsBySKUid()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.getSKUitemsBySKUid()', () => {
    beforeAll(async () => {

        /* adding SKU to DB */
        const querySKUSQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)";
        await dao.run(querySKUSQL, [1, "A new SKU", 100, 100, "First SKU", 10.99, 1]);
        await dao.run(querySKUSQL, [2, "Another new SKU", 10000, 10000, "Second SKU", 10.99, 1]);

        /* adding SKUitems to DB */
        const querySKUitemsSQL = "INSERT INTO SKUITEMS VALUES (?, ?, ?, ?)";
        await dao.run(querySKUitemsSQL, ["12345678901234567890123456789014", 1, 0, "2021/11/29 12:30"]);
        await dao.run(querySKUitemsSQL, ["12345678901234567890123456789015", 1, 1, "2021/11/29 12:30"]);
        await dao.run(querySKUitemsSQL, ["12345678901234567890123456789016", 1, 1, "2021/11/29 12:30"]);
        await dao.run(querySKUitemsSQL, ["12345678901234567890123456789017", 2, 1, "2021/11/29 12:30"]);
        
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testGetSKUitemsBySKUid_REAL(
        '- Success: ',
        1,
        skuItemsTestArray.slice(1, 3)
    );

    /**
     * ---------------------------------
     *      UNIT TEST: EMPTY RESULT
     * ---------------------------------
     */
     testGetSKUitemsBySKUid_REAL(
        '- Empty result: ',
        3,
        []
    );

    afterAll(async () => {
        const querySKUitemsSQL = "DELETE FROM SKUITEMS";
        const querySKUSQL = "DELETE FROM SKUS";
        await dao.run(querySKUitemsSQL);
        await dao.run(querySKUSQL);
    });

});

/**
 * UNIT TEST: positionDAO.getSKUitemByRFID()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.getSKUitemByRFID()', () => {
    beforeAll(async () => {

        /* adding SKU to DB */
        const querySKUSQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)";
        await dao.run(querySKUSQL, [1, "A new SKU", 100, 100, "First SKU", 10.99, 1]);

        /* adding SKUitems to DB */
        const querySKUitemsSQL = "INSERT INTO SKUITEMS VALUES (?, ?, ?, ?)";
        await dao.run(querySKUitemsSQL, ["12345678901234567890123456789014", 1, 0, "2021/11/29 12:30"]);
        
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testGetSKUitemsByRFID_REAL(
        '- Success: ',
        "12345678901234567890123456789014",
        skuItemsTestArray[0]
    );

    /**
     * ---------------------------------
     *      UNIT TEST: EMPTY RESULT
     * ---------------------------------
     */
     testGetSKUitemsByRFID_REAL(
        '- Empty result: ',
        "99999999999999999999999999999999",
        undefined
    );

    afterAll(async () => {
        const querySKUitemsSQL = "DELETE FROM SKUITEMS";
        const querySKUSQL = "DELETE FROM SKUS";
        await dao.run(querySKUitemsSQL);
        await dao.run(querySKUSQL);
    });

});


/**
 * UNIT TEST: positionDAO.newSkuItem()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.newSkuItem()', () => {
    beforeAll(async () => {

        /* adding SKU to DB */
        const querySKUSQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)";
        await dao.run(querySKUSQL, [1, "A new SKU", 100, 100, "First SKU", 10.99, 1]);
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testNewSkuItem_REAL(
        '- Success: ',
        {
            RFID: "12345678901234567890123456789014",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        },
        {id: 1}
    );

    /**
     * ---------------------------------
     *      UNIT TEST: ERROR
     * ---------------------------------
     */
     testNewSkuItem_REAL(
        '- RFID already defined: ',
        {
            RFID: "12345678901234567890123456789014",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        },
        Error
    );

    afterAll(async () => {
        const querySKUitemsSQL = "DELETE FROM SKUITEMS";
        const querySKUSQL = "DELETE FROM SKUS";
        await dao.run(querySKUitemsSQL);
        await dao.run(querySKUSQL);
    });

});

/**
 * UNIT TEST: positionDAO.updateSKUitem()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.updateSKUitem()', () => {
    beforeAll(async () => {

        /* adding SKU to DB */
        const querySKUSQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)";
        await dao.run(querySKUSQL, [1, "A new SKU", 100, 100, "First SKU", 10.99, 1]);
        
        /* adding SKUitems to DB */
        const querySKUitemsSQL = "INSERT INTO SKUITEMS VALUES (?, ?, ?, ?)";
        await dao.run(querySKUitemsSQL, ["12345678901234567890123456789014", 1, 0, "2021/11/29 12:30"]);
        await dao.run(querySKUitemsSQL, ["12345678901234567890123456789016", 1, 1, "2021/11/29 12:30"]);
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testUpdateSKUitem_REAL(
        '- Success: ',
        "12345678901234567890123456789014",
        {
            newRFID: "12345678901234567890123456789015",
            newAvailable: 1,
            newDateOfStock: "2021/11/29 12:30"
        },
        {id: 2}
    );

    /**
     * ---------------------------------
     *      UNIT TEST: ERROR
     * ---------------------------------
     */
     testUpdateSKUitem_REAL(
        '- RFID already defined: ',
        "12345678901234567890123456789015",
        {
            RFID: "12345678901234567890123456789016",
            SKUId: 1,
            DateOfStock: "2021/11/29 12:30"
        },
        Error
    );

    afterAll(async () => {
        const querySKUitemsSQL = "DELETE FROM SKUITEMS";
        const querySKUSQL = "DELETE FROM SKUS";
        await dao.run(querySKUitemsSQL);
        await dao.run(querySKUSQL);
    });

});

/**
 * UNIT TEST: positionDAO.deleteSKUitem()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.deleteSKUitem()', () => {
    beforeAll(async () => {

        /* adding SKU to DB */
        const querySKUSQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)";
        await dao.run(querySKUSQL, [1, "A new SKU", 100, 100, "First SKU", 10.99, 1]);

        /* adding SKUitems to DB */
        const querySKUitemsSQL = "INSERT INTO SKUITEMS VALUES (?, ?, ?, ?)";
        await dao.run(querySKUitemsSQL, ["12345678901234567890123456789014", 1, 0, "2021/11/29 12:30"]);
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testDeleteSKUitem_REAL(
        '- Success: ',
        "12345678901234567890123456789014",
        {id: 1}
    );

    afterAll(async () => {
        const querySKUitemsSQL = "DELETE FROM SKUITEMS";
        const querySKUSQL = "DELETE FROM SKUS";
        await dao.run(querySKUitemsSQL);
        await dao.run(querySKUSQL);
    });

});



/*
    + -------------------- +
    |      FUNCTIONS       |
    + -------------------- +
*/
/**
 * UNIT TEST: skuItemDAO.getSKUitems()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetSKUitems_REAL(testName, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuItemDAO.getSKUitems();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: skuItemDAO.getSKUitemsBySKUid()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Number} SKUid identifier of the target SKU
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetSKUitemsBySKUid_REAL(testName, SKUid, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuItemDAO.getSKUitemsBySKUid(SKUid);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: skuItemDAO.getSKUitemByRFID()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {String} RFID identifier of the target SKUitem
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetSKUitemsByRFID_REAL(testName, RFID, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuItemDAO.getSKUitemByRFID(RFID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: skuItemDAO.newSkuItem()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} skuItemObject new SKUitem object to be added to the DB
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testNewSkuItem_REAL(testName, skuItemObject, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuItemDAO.newSkuItem(skuItemObject);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: skuItemDAO.updateSKUitem()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {String} RFID identifier of the target SKUitem
 * @param {Object} skuItemObject new SKUitem object to be added to the DB
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testUpdateSKUitem_REAL(testName, RFID, skuItemObject, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuItemDAO.updateSKUitem(RFID, skuItemObject);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: skuItemDAO.deleteSKUitem()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {String} RFID identifier of the target SKUitem
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testDeleteSKUitem_REAL(testName, RFID, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuItemDAO.deleteSKUitem(RFID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}