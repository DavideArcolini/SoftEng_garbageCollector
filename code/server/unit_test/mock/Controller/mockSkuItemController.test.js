/**
 *  INTEGRATION TEST: SkuItemController
 *           VERSION: mocked
 * --------------------------------------------
 * Services do not access the database. All the
 * function implementations are mocked in order
 * to test all possible behaviors.
*/

/* --------- IMPORT MODULES --------- */
const SKUitemController    = require('../../../controller/SKUitemController');
const skuItemDAO           = require('../Database/mockSkuItemDAO');
const skuDAO               = require('../Database/mockSKUDAO');

/* --------- INITIALIZATION --------- */
const SkuItemController    = new SKUitemController(skuItemDAO, skuDAO);

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
const skuItemObjects = [
    {
        RFID: "12345678901234567890123456789014",
        SKUId: 1,
        DateOfStock: "2021/11/29 12:30",
    }, 
    {
        RFID: "12345678901234567890123456789015",
        SKUId: 2,
        DateOfStock: "2019/04/23 09:15",
    }
];

const skusTestArray = [
    {
        id: 1,
        description: "a new sku",
        weight: 100,
        volume: 50,
        notes: "first SKU",
        position: "800234523412",
        availableQuantity: 2,
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
 * INTEGRATION TEST: SKUitemController.getSKUitems()
 * ========================================================================
 */
describe('INTEGRATION TEST: SKUitemController.getSKUitems', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {
        skuItemDAO.getSKUitems.mockReset();
        skuItemDAO.getSKUitems.mockImplementationOnce(() => {
            return skuItemsTestArray;
        }).mockImplementationOnce(() => {
            throw new Error();
        })
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetSKUitems_MOCK(
        '- Success: ',
        {
            code: 200,
            message: skuItemsTestArray
        }
    );
    
    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testGetSKUitems_MOCK(
        '- Error: ',
        Error
    );

});

/**
 * INTEGRATION TEST: SKUitemController.getSKUitemsBySKUId()
 * ========================================================================
 */
 describe('INTEGRATION TEST: SKUitemController.getSKUitemsBySKUId', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        skuItemDAO.getSKUitemsBySKUid.mockReset();
        skuDAO.getSKUByID.mockReset();

        /* mocking implementation of skuDAO.getSKUByID */
        skuDAO.getSKUByID.mockImplementationOnce(() => {
            return undefined;
        }).mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementation(() => {
            return skusTestArray[0];
        });

        /* mocking implementation of skuItemDAO.getSKUitemsBySKUid */
        skuItemDAO.getSKUitemsBySKUid.mockImplementationOnce(() => {
            return skuItemsTestArray.filter((skuitem) => {
                return skuitem.SKUId === skusTestArray[0].id;
            });
        });
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testGetSKUitemsBySKUId_MOCK(
        '- SKU not found: ',
        {id: skusTestArray[0].id},
        ERROR_404
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testGetSKUitemsBySKUId_MOCK(
        '- Error: ',
        {id: skusTestArray[0].id},
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetSKUitemsBySKUId_MOCK(
        '- Success: ',
        {id: skusTestArray[0].id},
        {
            code: 200,
            message: skuItemsTestArray.filter((skuitem) => {
                return skuitem.SKUId === skusTestArray[0].id;
            })
        }
    );

});

/**
 * INTEGRATION TEST: SKUitemController.getSKUitemsByRFID()
 * ========================================================================
 */
 describe('INTEGRATION TEST: SKUitemController.getSKUitemsByRFID', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        skuItemDAO.getSKUitemByRFID.mockReset();

        /* mocking implementation of skuDAO.getSKUByID */
        skuItemDAO.getSKUitemByRFID.mockImplementationOnce(() => {
            return undefined;
        }).mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementation(() => {
            return skuItemsTestArray[0];
        });
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testGetSKUitemsByRFID_MOCK(
        '- SKUitem not found: ',
        {rfid: skuItemsTestArray[0].RFID},
        ERROR_404
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testGetSKUitemsByRFID_MOCK(
        '- Error: ',
        {rfid: skuItemsTestArray[0].RFID},
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetSKUitemsByRFID_MOCK(
        '- Success: ',
        {rfid: skuItemsTestArray[0].RFID},
        {
            code: 200,
            message: skuItemsTestArray[0],
        }
    );

});

/**
 * INTEGRATION TEST: SKUitemController.newSKUitem()
 * ========================================================================
 */
 describe('INTEGRATION TEST: SKUitemController.newSKUitem', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        skuItemDAO.newSkuItem.mockReset();
        skuDAO.getSKUByID.mockReset();

        /* mocking implementation of skuDAO.getSKUByID */
        skuDAO.getSKUByID.mockImplementationOnce(() => {
            return undefined;
        }).mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementation(() => {
            return skusTestArray[0];
        });

        /* mocking implementation of skuDAO.getSKUByID */
        skuItemDAO.newSkuItem.mockImplementation(() => {
            return ;
        });
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testNewSKUitem_MOCK(
        '- SKU not found: ',
        skuItemObjects[0],
        ERROR_404
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testNewSKUitem_MOCK(
        '- Error: ',
        skuItemObjects[0],
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testNewSKUitem_MOCK(
        '- Success: ',
        skuItemObjects[0],
        MESSG_201
    );

});


/**
 * INTEGRATION TEST: SKUitemController.editSKUitem()
 * ========================================================================
 */
 describe('INTEGRATION TEST: SKUitemController.editSKUitem', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        skuItemDAO.getSKUitemByRFID.mockReset();
        skuItemDAO.updateSKUitem.mockReset();

        /* mocking implementation of skuItemDAO.getSKUitemByRFID */
        skuItemDAO.getSKUitemByRFID.mockImplementationOnce(() => {
            return undefined;
        }).mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementation(() => {
            return skuItemsTestArray[0];
        });

        /* mocking implementation of skuDAO.getSKUByID */
        skuItemDAO.updateSKUitem.mockImplementation(() => {
            return ;
        });
    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR_404
     * ---------------------------------
     */
     testEditSKUitem_MOCK(
        '- SKU not found: ',
        {rfid: skuItemsTestArray[0].RFID},
        skuItemsTestArray[1].RFID,
        ERROR_404
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testEditSKUitem_MOCK(
        '- Error: ',
        {rfid: skuItemsTestArray[0].RFID},
        skuItemsTestArray[1].RFID,
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testEditSKUitem_MOCK(
        '- Success: ',
        {rfid: skuItemsTestArray[0].RFID},
        skuItemsTestArray[1].RFID,
        MESSG_200
    );

});

/**
 * INTEGRATION TEST: SKUitemController.deleteSKUitem()
 * ========================================================================
 */
 describe('INTEGRATION TEST: SKUitemController.deleteSKUitem', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        skuItemDAO.deleteSKUitem.mockReset();

        /* mocking implementation of skuItemDAO.getSKUitemByRFID */
        skuItemDAO.deleteSKUitem.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementation(() => {
            return ;
        });
    });



    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testDeleteSKUitem_MOCK(
        '- Error: ',
        {rfid: skuItemsTestArray[0].RFID},
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testDeleteSKUitem_MOCK(
        '- Success: ',
        {rfid: skuItemsTestArray[0].RFID},
        MESSG_204
    );

});


/*
    + -------------------- +
    |      FUNCTIONS       |
    + -------------------- +
*/
/**
 * INTEGRATION TEST: SKUitemController.getSKUitems()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetSKUitems_MOCK(testName, expectedResult) {
    test(testName, async () => {
        try {
            const result = await SkuItemController.getSKUitems();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}


/**
 * INTEGRATION TEST: SKUitemController.getSKUitemsBySKUId()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} params contains the identifier of the target SKU
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetSKUitemsBySKUId_MOCK(testName, params, expectedResult) {
    test(testName, async () => {
        try {
            const result = await SkuItemController.getSKUitemsBySKUId(params);
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
 function testGetSKUitemsByRFID_MOCK(testName, params, expectedResult) {
    test(testName, async () => {
        try {
            const result = await SkuItemController.getSKUitemsByRFID(params);
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
 function testNewSKUitem_MOCK(testName, body, expectedResult) {
    test(testName, async () => {
        try {
            const result = await SkuItemController.newSKUitem(body);
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
 function testEditSKUitem_MOCK(testName, params, body, expectedResult) {
    test(testName, async () => {
        try {
            const result = await SkuItemController.editSKUitem(params, body);
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
 function testDeleteSKUitem_MOCK(testName, params, expectedResult) {
    test(testName, async () => {
        try {
            const result = await SkuItemController.deleteSKUitem(params);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}