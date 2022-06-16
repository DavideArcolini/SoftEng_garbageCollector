/**
 *  UNIT TEST: skuDAO
 *    VERSION: real
 * ===========================
 */

/* --------- IMPORT MODULES --------- */
const SkuDAO        = require('../../../db/skuDAO');
const DAO           = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const dao         = new DAO();
const skuDAO      = new SkuDAO(dao);

/*
    + -------------------- +
    |         DATA         |
    + -------------------- +
*/
const skusTestArray = [
    {
        id: 1,
        description: "A new SKU",
        weight: 100,
        volume: 100,
        notes: "First SKU",
        position: null,
        price: 10.99,
        availableQuantity: 1
    },
    {
        id: 2,
        description: "Another SKU",
        weight: 10000,
        volume: 10000,
        notes: "Second SKU",
        position: null,
        price: 10.99,
        availableQuantity: 1
    }
];


/*
    + -------------------- +
    |         TESTS        |
    + -------------------- +
*/
/**
 * UNIT TEST: positionDAO.getSKUs()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.getSKUs()', () => {
    beforeAll(async () => {

        /* adding SKU to DB */
        const querySKUSQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await dao.run(querySKUSQL, [1, "A new SKU", 100, 100, "First SKU", null, 10.99, 1]);
        await dao.run(querySKUSQL, [2, "Another SKU", 10000, 10000, "Second SKU", null, 10.99, 1]);
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testGetSKUs_REAL(
        '- Success: ', 
        skusTestArray
    );

    afterAll(async () => {
        const querySKUSQL = "DELETE FROM SKUS";
        await dao.run(querySKUSQL);
    });

});

/**
 * UNIT TEST: positionDAO.getSKUByID()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.getSKUByID()', () => {
    beforeAll(async () => {

        /* adding SKU to DB */
        const querySKUSQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await dao.run(querySKUSQL, [1, "A new SKU", 100, 100, "First SKU", null, 10.99, 1]);
        await dao.run(querySKUSQL, [2, "Another SKU", 10000, 10000, "Second SKU", null, 10.99, 1]);
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testGetSKUByID_REAL(
        '- Success: ', 
        1,
        skusTestArray[0]
    );

    /**
     * ---------------------------------
     *      UNIT TEST: EMPTY
     * ---------------------------------
     */
     testGetSKUByID_REAL(
        '- Empty result: ', 
        9,
        undefined
    );

    afterAll(async () => {
        const querySKUSQL = "DELETE FROM SKUS";
        await dao.run(querySKUSQL);
    });

});

/**
 * UNIT TEST: positionDAO.getSKUByPositionID()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.getSKUByPositionID()', () => {
    beforeAll(async () => {

        /* adding SKU to DB */
        const querySKUSQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await dao.run(querySKUSQL, [1, "A new SKU", 100, 100, "First SKU", "400140014001", 10.99, 1]);
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testGetSKUByPositionID_REAL(
        '- Success: ', 
        "400140014001",
        {
            id: 1,
            description: "A new SKU",
            weight: 100,
            volume: 100,
            notes: "First SKU",
            position: "400140014001",
            price: 10.99,
            availableQuantity: 1
        }
    );

    /**
     * ---------------------------------
     *      UNIT TEST: EMPTY
     * ---------------------------------
     */
     testGetSKUByPositionID_REAL(
        '- Empty result: ', 
        "999999999999",
        undefined
    );

    afterAll(async () => {
        const querySKUSQL = "DELETE FROM SKUS";
        await dao.run(querySKUSQL);
    });

});

/**
 * UNIT TEST: positionDAO.newSKU()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.newSKU()', () => {

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testNewSKU_REAL(
        '- Success: ', 
        {
            description: "A new SKU",
            weight: 100,
            volume: 100,
            notes: "First SKU",
            price: 10.99,
            availableQuantity: 1
        },
        {id: 1}
    );

    afterAll(async () => {
        const querySKUSQL = "DELETE FROM SKUS";
        await dao.run(querySKUSQL);
    });

});


/**
 * UNIT TEST: positionDAO.updateSKU()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.updateSKU()', () => {
    beforeAll(async () => {

        /* adding SKU to DB */
        const querySKUSQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await dao.run(querySKUSQL, [1, "A new SKU", 100, 100, "First SKU", "400140014001", 10.99, 1]);
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testUpdateSKU_REAL(
        '- Success: ', 
        1,
        {
            newDescription: "A new SKU",
            newWeight: 100,
            newVolume: 100,
            newNotes: "First SKU",
            newPrice: 10.99,
            newAvailableQuantity: 1
        },
        {id: 1}
    );

    /**
     * ---------------------------------
     *      UNIT TEST: NOT FOUND
     * ---------------------------------
     */
     testUpdateSKU_REAL(
        '- SKU not found: ', 
        1,
        {
            newDescription: "A new SKU",
            newWeight: 100,
            newVolume: 100,
            newNotes: "First SKU",
            newPrice: 10.99,
            newAvailableQuantity: 1
        },
        {id: 1}
    );

    afterAll(async () => {
        const querySKUSQL = "DELETE FROM SKUS";
        await dao.run(querySKUSQL);
    });

});


/**
 * UNIT TEST: positionDAO.updateSKUpositionID()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.updateSKUpositionID()', () => {
    beforeAll(async () => {

        /* adding SKU to DB */
        const querySKUSQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await dao.run(querySKUSQL, [1, "A new SKU", 100, 100, "First SKU", "400140014001", 10.99, 1]);
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testUpdateSKUpositionID_REAL(
        '- Success: ', 
        1,
        "400140014001",
        {id: 1}
    );

    afterAll(async () => {
        const querySKUSQL = "DELETE FROM SKUS";
        await dao.run(querySKUSQL);
    });

});

/**
 * UNIT TEST: positionDAO.deleteSKU()
 * ========================================================================
 */
 describe('UNIT TEST: positionDAO.deleteSKU()', () => {
    beforeAll(async () => {

        /* adding SKU to DB */
        const querySKUSQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await dao.run(querySKUSQL, [1, "A new SKU", 100, 100, "First SKU", "400140014001", 10.99, 1]);
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testDeleteSKU_REAL(
        '- Success: ', 
        1,
        {id: 1}
    );

    afterAll(async () => {
        const querySKUSQL = "DELETE FROM SKUS";
        await dao.run(querySKUSQL);
    });

});









/*
    + -------------------- +
    |      FUNCTIONS       |
    + -------------------- +
*/
/**
 * UNIT TEST: skuDAO.getSKUs()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetSKUs_REAL(testName, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuDAO.getSKUs();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: skuDAO.getSKUByID()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Number} ID identifier of the target SKU
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetSKUByID_REAL(testName, ID, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuDAO.getSKUByID(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: skuDAO.getSKUByID()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {String} positionID position identifier of the target SKU
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetSKUByPositionID_REAL(testName, positionID, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuDAO.getSKUByPositionID(positionID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: skuDAO.newSKU()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} skuObject new SKU object to be added to the DB
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testNewSKU_REAL(testName, skuObject, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuDAO.newSKU(skuObject);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: skuDAO.updateSKU()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Number} ID identifier of the target SKU
 * @param {Object} skuObject new SKU object to be added to the DB
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testUpdateSKU_REAL(testName, ID, skuObject, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuDAO.updateSKU(ID, skuObject);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: skuDAO.updateSKUpositionID()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Number} ID identifier of the target SKU
 * @param {String} newPositionID new positionID of the target SKU
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testUpdateSKUpositionID_REAL(testName, ID, newPositionID, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuDAO.updateSKUpositionID(ID, newPositionID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: skuDAO.deleteSKU()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Number} ID identifier of the target SKU
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testDeleteSKU_REAL(testName, ID, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuDAO.deleteSKU(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}