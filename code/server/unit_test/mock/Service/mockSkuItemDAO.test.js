/**
 *  UNIT TEST: positionDAO
 *    VERSION: mock
 * ===========================
 */

/* --------- IMPORT MODULES --------- */
const SkuItemDAO    = require('../../../db/skuItemDAO');
const mockDAO       = require('../Database/mockDAO');

/* --------- INITIALIZATION --------- */
const skuItemDAO = new SkuItemDAO(mockDAO);


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
        SKUId: 2,
        Available: 0,
        DateOfStock: "2019/01/29 09:00"
    }, {
        RFID: "12345678901234567890123456789017",
        SKUId: 3,
        Available: 0
    }
];

/*
    + -------------------- +
    |         TESTS        |
    + -------------------- +
*/
/**
 * UNIT TEST: skuItemDAO.getSKUitems()
 * ========================================================================
 */
 describe('UNIT TEST: skuItemDAO.getSKUitems()', () => {
    beforeAll(() => {
        mockDAO.all.mockReset();
        mockDAO.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(skuItemsTestArray);
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
     testGetSKUitems_MOCK('- Success: ', skuItemsTestArray);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testGetSKUitems_MOCK('- Database error: ', Error);
    
});

/**
 * UNIT TEST: skuItemDAO.getSKUitemsBySKUid()
 * ========================================================================
 */
 describe('UNIT TEST: skuItemDAO.getSKUitemsBySKUid()', () => {
    beforeAll(() => {
        mockDAO.all.mockReset();
        mockDAO.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(skuItemsTestArray.filter((SKUitem) => {
                    return (SKUitem.SKUId === 1 && SKUitem.Available === 1);
                }));
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
     testGetSKUitemsBySKUid_MOCK(
        '- Success: ', 
        1,
        skuItemsTestArray.filter((SKUitem) => {
            return (SKUitem.SKUId === 1 && SKUitem.Available === 1);
        })
    );

    /**
     * ---------------------------------
     *      UNIT TEST: EMPTY RESULT
     * ---------------------------------
     */
     testGetSKUitemsBySKUid_MOCK(
        '- Success (empty): ', 
        999999,
        []
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testGetSKUitemsBySKUid_MOCK(
        '- Database error: ', 
        skuItemsTestArray[0].SKUId,
        Error
    );
    
});

/**
 * UNIT TEST: skuItemDAO.getSKUitemByRFID()
 * ========================================================================
 */
 describe('UNIT TEST: skuItemDAO.getSKUitemByRFID()', () => {
    beforeAll(() => {
        mockDAO.get.mockReset();
        mockDAO.get.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(skuItemsTestArray[0]);
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
     testGetSKUitemsByRFID_MOCK(
        '- Success: ', 
        skuItemsTestArray[0].RFID,
        skuItemsTestArray[0]
    );

    /**
     * ---------------------------------
     *      UNIT TEST: EMPTY RESULT
     * ---------------------------------
     */
     testGetSKUitemsByRFID_MOCK(
        '- Success (empty): ', 
        "99999999999999999999999999999999",
        []
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testGetSKUitemsByRFID_MOCK(
        '- Database error: ', 
        skuItemsTestArray[0].RFID,
        Error
    );
    
});

/**
 * UNIT TEST: skuItemDAO.newSkuItem()
 * ========================================================================
 */
 describe('UNIT TEST: skuItemDAO.newSkuItem()', () => {
    beforeAll(() => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(skuItemsTestArray[0].RFID);
            });
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(skuItemsTestArray[3].RFID);
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
    testNewSkuItem_MOCK(
        '- Success: ',
        skuItemsTestArray[0],
        skuItemsTestArray[0].RFID
    );

    /**
     * ---------------------------------------
     *   UNIT TEST: SUCCESS (no DateOfStock)
     * ---------------------------------------
     */
     testNewSkuItem_MOCK(
        '- Success (no DateOfStock): ',
        skuItemsTestArray[3],
        skuItemsTestArray[3].RFID
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
    testNewSkuItem_MOCK(
        '- Database error: ',
        skuItemsTestArray[0], 
        Error
    );
    
});


/**
 * UNIT TEST: skuItemDAO.updateSKUitem()
 * ========================================================================
 */
 describe('UNIT TEST: skuItemDAO.updateSKUitem()', () => {
    beforeAll(() => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(skuItemsTestArray[1].RFID);
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
     testUpdateSKUitem_MOCK(
        '- Success: ',
        skuItemsTestArray[0].RFID,
        skuItemsTestArray[1], 
        skuItemsTestArray[1].RFID
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testUpdateSKUitem_MOCK(
        '- Database error: ',
        skuItemsTestArray[0].RFID,
        skuItemsTestArray[1],  
        Error
    );
    
});

/**
 * UNIT TEST: skuItemDAO.deleteSKUitem()
 * ========================================================================
 */
 describe('UNIT TEST: skuItemDAO.deleteSKUitem()', () => {
    beforeAll(() => {
        mockDAO.run.mockReset();
        mockDAO.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(skuItemsTestArray[0].RFID);
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
     testDeleteSKUitem_MOCK(
        '- Success: ',
        skuItemsTestArray[0].RFID,
        skuItemsTestArray[0].RFID
    );

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testDeleteSKUitem_MOCK(
        '- Database error: ',
        skuItemsTestArray[0].RFID,
        Error
    );
    
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
 function testGetSKUitems_MOCK(testName, expectedResult) {
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
 function testGetSKUitemsBySKUid_MOCK(testName, SKUid, expectedResult) {
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
 function testGetSKUitemsByRFID_MOCK(testName, RFID, expectedResult) {
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
 function testNewSkuItem_MOCK(testName, skuItemObject, expectedResult) {
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
 function testUpdateSKUitem_MOCK(testName, RFID, skuItemObject, expectedResult) {
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
 function testDeleteSKUitem_MOCK(testName, RFID, expectedResult) {
    test(testName, async () => {
        try {
            const result = await skuItemDAO.deleteSKUitem(RFID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}