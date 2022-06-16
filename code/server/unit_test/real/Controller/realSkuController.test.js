/**
 *  INTEGRATION TEST: skuController
 *           VERSION: real
 * --------------------------------------------
 * Services do access the database (although it
 * is a test database).
*/

/* --------- IMPORT MODULES --------- */
const SKUController         = require('../../../controller/SKUController');
const SkuItemDAO            = require('../../../db/skuItemDAO');
const SkuDAO                = require('../../../db/skuDAO');
const PositionDAO           = require('../../../db/positionDAO');
const TestDescriptorsDAO    = require('../../../db/testDescriptorsDAO');
const TestDAO               = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const testDAO               = new TestDAO();
const skuItemDAO            = new SkuItemDAO(testDAO);
const skuDAO                = new SkuDAO(testDAO);
const positionDAO           = new PositionDAO(testDAO);
const testDescriptorsDAO    = new TestDescriptorsDAO(testDAO);
const skuController         = new SKUController(skuDAO, testDescriptorsDAO, positionDAO, skuItemDAO);

/* --------- ERROR MESSAGES --------- */
const MESSG_200 = {code: 200, message: 'Ok'}
const MESSG_201 = {code: 201, message: 'Created'};
const MESSG_204 = {code: 204, message: 'No Content'};
const ERROR_404 = {code: 404, message: 'Not Found'};
const ERROR_422 = {code: 422, message: 'Unprocessable Entity'};

/*
    + -------------------- +
    |         DATA         |
    + -------------------- +
*/
const skusTestArray = [
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
    }, {
        id: 1112,
        description: "A second SKU",
        weight: 150,
        volume: 50,
        notes: "second SKU",
        position: null,
        availableQuantity: 50,
        price: 10.99,
        testDescriptors: []
    }
];
const newSKU = {
    description: "ID_TBD",
    weight: 100,
    volume: 50,
    notes: "first SKU",
    price: 10.99,
    availableQuantity: 50
};

const editSKU = {
    newDescription: "a new sku",
    newWeight: 100,
    newVolume: 50,
    newNotes: "first SKU",
    newPrice: 10.99,
    newAvailableQuantity: 1
};
const editSKUFailedConstraints = {
    newDescription: "a new sku",
    newWeight: 100,
    newVolume: 50,
    newNotes: "first SKU",
    newPrice: 10.99,
    newAvailableQuantity: 100
};




/*
    + -------------------- +
    |         TESTS        |
    + -------------------- +
*/
/**
 * INTEGRATION TEST: skuController.getStoredSKUs()
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: skuController.getStoredSKUs', () => {
    
    beforeAll(async () => {
        /* adding SKU to DB */
        const querySQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await testDAO.run(querySQL, [1111, "A new SKU", 150, 50, "first SKU", null, 10.99, 50]);
        await testDAO.run(querySQL, [1112, "A second SKU", 150, 50, "second SKU", null, 10.99, 50]);
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetStoredSKUs_REAL(
        '- Success: ',
        {
            code: 200,
            message: skusTestArray
        }
    );

    afterAll(async () => {
        const querySQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
        await testDAO.run(querySQL, [1111]);
        await testDAO.run(querySQL, [1112]);
    });
});


/**
 * INTEGRATION TEST: skuController.getStoredSKUById()
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: skuController.getStoredSKUById', () => {
    
    beforeAll(async () => {
        /* adding SKU to DB */
        const querySQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await testDAO.run(querySQL, [1111, "A new SKU", 150, 50, "first SKU", null, 10.99, 50]);
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetStoredSKUById_REAL(
        '- Success: ',
        {id: 1111},
        {
            code: 200,
            message: skusTestArray[0]
        }
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testGetStoredSKUById_REAL(
        '- SKU not found: ',
        {id: 9999},
        ERROR_404
    );

    afterAll(async () => {
        const querySQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
        await testDAO.run(querySQL, [1111]);
    });
});

/**
 * INTEGRATION TEST: skuController.newSKU()
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: skuController.newSKU', () => {

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testNewSKU_REAL(
        '- Success: ',
        newSKU,
        MESSG_201
    );

    afterAll(async () => {
        const querySQL = "DELETE FROM SKUS WHERE SKUS.description == ?";
        await testDAO.run(querySQL, ["ID_TBD"]);
    });
});

/**
 * INTEGRATION TEST: skuController.editSKU()
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: skuController.editSKU', () => {
    
    beforeAll(async () => {
        const querySKUSQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const queryPositionSQL = "INSERT INTO POSITIONS VALUES (?, ?, ?, ?, ?, ?, 0, 0)";
        
        await testDAO.run(queryPositionSQL, ["400140014001", "4001", "4001", "4001", 1000, 1000]);
        await testDAO.run(querySKUSQL, [1111, "A new SKU", 150, 50, "first SKU", "400140014001", 10.99, 2]);
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testEditSKU_REAL(
        '- SKU not found: ',
        {id: 9999},
        editSKU,
        ERROR_404
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_422
     * ---------------------------------
     */
     testEditSKU_REAL(
        '- Position constraint failed: ',
        {id: 1111},
        editSKUFailedConstraints,
        ERROR_422
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testEditSKU_REAL(
        '- Success: ',
        {id: 1111},
        editSKU,
        MESSG_200
    );


    afterAll(async () => {
        const querySKUSQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
        const queryPositionSQL = "DELETE FROM POSITIONS WHERE POSITIONS.positionID == ?";
        await testDAO.run(querySKUSQL, [1111]);
        await testDAO.run(queryPositionSQL, ["400140014001"]);
    });
});

/**
 * INTEGRATION TEST: skuController.addOrEditPositionSKU()
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: skuController.addOrEditPositionSKU', () => {
    
    beforeAll(async () => {
        const querySKUSQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const queryPositionSQL = "INSERT INTO POSITIONS VALUES (?, ?, ?, ?, ?, ?, 0, 0)";
        
        await testDAO.run(queryPositionSQL, ["400140014001", "4001", "4001", "4001", 1000, 1000]);
        await testDAO.run(queryPositionSQL, ["400240024002", "4002", "4002", "4002", 1000, 1000]);
        await testDAO.run(queryPositionSQL, ["400340034003", "4003", "4003", "4003", 1000, 1000]);
        await testDAO.run(queryPositionSQL, ["400440044004", "4003", "4003", "4003", 1, 1]);
        await testDAO.run(querySKUSQL, [1111, "A new SKU", 150, 50, "first SKU", "400140014001", 10.99, 2]);
        await testDAO.run(querySKUSQL, [1112, "A new SKU", 150, 50, "first SKU", "400240024002", 10.99, 2]);
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_422
     * ---------------------------------
     */
     testAddOrEditPositionSKU_REAL(
        '- Position already assigned: ',
        {id: 1111},
        {position: "400240024002"},
        ERROR_422
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testAddOrEditPositionSKU_REAL(
        '- SKU not found: ',
        {id: 9999},
        {position: "400340034003"},
        ERROR_404
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testAddOrEditPositionSKU_REAL(
        '- Position not found: ',
        {id: 1111},
        {position: "999999999999"},
        ERROR_404
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_422
     * ---------------------------------
     */
     testAddOrEditPositionSKU_REAL(
        '- Position constraints failed: ',
        {id: 1111},
        {position: "400440044004"},
        ERROR_422
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testAddOrEditPositionSKU_REAL(
        '- Position constraints failed: ',
        {id: 1111},
        {position: "400340034003"},
        MESSG_200
    );


    afterAll(async () => {
        const querySKUSQL = "DELETE FROM SKUS WHERE SKUS.id == ?";
        const queryPositionSQL = "DELETE FROM POSITIONS WHERE POSITIONS.positionID == ?";
        await testDAO.run(querySKUSQL, [1111]);
        await testDAO.run(querySKUSQL, [1112]);
        await testDAO.run(queryPositionSQL, ["400140014001"]);
        await testDAO.run(queryPositionSQL, ["400240024002"]);
        await testDAO.run(queryPositionSQL, ["400340034003"]);
        await testDAO.run(queryPositionSQL, ["400440044004"]);
    });
});

/**
 * INTEGRATION TEST: skuController.deleteSKU()
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: skuController.deleteSKU', () => {
    
    beforeAll(async () => {
        /* adding SKU to DB */
        const querySQL = "INSERT INTO SKUS (ID, DESCRIPTION, WEIGHT, VOLUME, NOTES, POSITION, PRICE, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await testDAO.run(querySQL, [1111, "A new SKU", 150, 50, "first SKU", null, 10.99, 50]);
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testDeleteSKU_REAL(
        '- Success: ',
        {id: 1111},
        MESSG_204
    );

});





/*
    + -------------------- +
    |      FUNCTIONS       |
    + -------------------- +
*/
/**
 * INTEGRATION TEST: skuController.getStoredSKUs()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetStoredSKUs_REAL(testName, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuController.getStoredSKUs();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: skuController.getStoredSKUById()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} params contains the identifier of the target SKU
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetStoredSKUById_REAL(testName, params, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuController.getStoredSKUById(params);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: skuController.newSKU()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} body the new SKU object to be added to the DB
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testNewSKU_REAL(testName, body, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuController.newSKU(body);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: skuController.editSKU()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} params contains the identifier of the target SKU
 * @param {Object} body the new SKU object to be added to the DB
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testEditSKU_REAL(testName, params, body, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuController.editSKU(params, body);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: skuController.addOrEditPositionSKU()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} params contains the identifier of the target SKU
 * @param {Object} body the new Position object
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testAddOrEditPositionSKU_REAL(testName, params, body, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuController.addOrEditPositionSKU(params, body);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * INTEGRATION TEST: skuController.deleteSKU()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} params contains the identifier of the target SKU
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testDeleteSKU_REAL(testName, params, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuController.deleteSKU(params);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}