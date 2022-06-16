/**
 *  UNIT TEST: SkuDAO
 */

/* --------- IMPORT MODULES --------- */
const SkuDAO    = require('../../../db/skuDAO');
const mockDAO   = require('../Database/mockDAO');

/* --------- INITIALIZATION --------- */
const skuDAO = new SkuDAO(mockDAO);


/*
    + -------------------- +
    |         DATA         |
    + -------------------- +
*/
const skusTestArray = [
    {
        id: 1,
        description: "a new sku",
        weight: 100,
        volume: 50,
        notes: "first SKU",
        position: "800234523412",
        availableQuantity: 50,
        price: 10.99,
        testDescriptors: [1, 3, 4]
    },
    {
        id: 2,
        description: "another sku",
        weight: 101,
        volume: 60,
        notes: "second SKU",
        position: "800234543411",
        availableQuantity: 55,
        price: 10.99,
        testDescriptors: [2, 5, 7]
    }

];
















/*
    + -------------------- +
    |         TESTS        |
    + -------------------- +
*/
/**
 * UNIT TEST: skuDAO.getSKUs()
 * ========================================================================
 */
 describe('UNIT TEST: skuDAO.getSKUs()', () => {
    beforeAll(() => {
        mockDAO.all.mockReset();
        mockDAO.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(skusTestArray);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "Error"});
            });
        });
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testGetSKUs_MOCK('- Success: ', skusTestArray);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testGetSKUs_MOCK('- Database error: ', Error);
    
});

/**
 * UNIT TEST: skuDAO.getSKUByID()
 * ========================================================================
 */
 describe('UNIT TEST: skuDAO.getSKUByID()', () => {
    beforeAll(() => {
        mockDAO.get.mockReset();
        mockDAO.get.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(skusTestArray[0]);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "Error"});
            });
        });
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testGetSKUByID_MOCK(
        '- Success: ', 
        skusTestArray[0].id,
        skusTestArray[0]
    );

    /**
     * ---------------------------------
     *      UNIT TEST: EMPTY RESULT
     * ---------------------------------
     */
     testGetSKUByID_MOCK(
        '- Success (empty): ', 
        999999,
        []
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testGetSKUByID_MOCK(
        '- Database error: ', 
        skusTestArray[0].id,
        Error
    );
    
});

/**
 * UNIT TEST: skuDAO.getSKUByPositionID()
 * ========================================================================
 */
 describe('UNIT TEST: skuDAO.getSKUByPositionID()', () => {
    beforeAll(() => {
        mockDAO.get.mockReset();
        mockDAO.get.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(skusTestArray[0]);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "Error"});
            });
        });
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testGetSKUByPositionID_MOCK(
        '- Success: ', 
        skusTestArray[0].position,
        skusTestArray[0]
    );

    /**
     * ---------------------------------
     *      UNIT TEST: EMPTY RESULT
     * ---------------------------------
     */
     testGetSKUByPositionID_MOCK(
        '- Success (empty): ', 
        "999999999999",
        []
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testGetSKUByPositionID_MOCK(
        '- Database error: ', 
        skusTestArray[0].position,
        Error
    );
    
});

/**
 * UNIT TEST: skuDAO.newSKU()
 * ========================================================================
 */
 describe('UNIT TEST: skuDAO.newSKU()', () => {
    beforeAll(() => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(skusTestArray[0].id);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "Error"});
            });
        });
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testNewSKU_MOCK(
        '- Success: ', 
        skusTestArray[0],
        skusTestArray[0].id
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testNewSKU_MOCK(
        '- Database error: ', 
        skusTestArray[0],
        Error
    );
    
});

/**
 * UNIT TEST: skuDAO.updateSKU()
 * ========================================================================
 */
 describe('UNIT TEST: skuDAO.updateSKU()', () => {
    beforeAll(() => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(skusTestArray[1].id);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "Error"});
            });
        });
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testUpdateSKU_MOCK(
        '- Success: ', 
        skusTestArray[0].id,
        skusTestArray[1], 
        skusTestArray[1].id
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testUpdateSKU_MOCK(
        '- Database error: ', 
        skusTestArray[0].id,
        skusTestArray[1], 
        Error
    );
    
});

/**
 * UNIT TEST: skuDAO.updateSKUpositionID()
 * ========================================================================
 */
 describe('UNIT TEST: skuDAO.updateSKUpositionID()', () => {
    beforeAll(() => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(skusTestArray[0].id);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "Error"});
            });
        });
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testUpdateSKUpositionID_MOCK(
        '- Success: ', 
        skusTestArray[0].id,
        skusTestArray[1].positionID, 
        skusTestArray[0].id
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testUpdateSKUpositionID_MOCK(
        '- Database error: ', 
        skusTestArray[0].id,
        skusTestArray[1].positionID, 
        Error
    );
    
});

/**
 * UNIT TEST: skuDAO.deleteSKU()
 * ========================================================================
 */
 describe('UNIT TEST: skuDAO.deleteSKU()', () => {
    beforeAll(() => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(skusTestArray[0].id);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject({message: "Error"});
            });
        });
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testDeleteSKU_MOCK(
        '- Success: ', 
        skusTestArray[0].id,
        skusTestArray[0].id
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testDeleteSKU_MOCK(
        '- Database error: ', 
        skusTestArray[0].id,
        Error
    );
    
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
 function testGetSKUs_MOCK(testName, expectedResult) {
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
 function testGetSKUByID_MOCK(testName, ID, expectedResult) {
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
 function testGetSKUByPositionID_MOCK(testName, positionID, expectedResult) {
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
 function testNewSKU_MOCK(testName, skuObject, expectedResult) {
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
 function testUpdateSKU_MOCK(testName, ID, skuObject, expectedResult) {
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
 function testUpdateSKUpositionID_MOCK(testName, ID, newPositionID, expectedResult) {
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
 function testDeleteSKU_MOCK(testName, ID, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuDAO.deleteSKU(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}