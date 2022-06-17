/**
 *  INTEGRATION TEST: InternalOrderController
 *           VERSION: mocked
 * --------------------------------------------
 * Services do not access the database. All the
 * function implementations are mocked in order
 * to test all possible behaviors.
*/

/* --------- IMPORT MODULES --------- */
const InternalOrderController     = require('../../../controller/InternalOrderController');
const ioDAO       = require('../Database/mockInternalOrderDAO');

/* --------- INITIALIZATION --------- */
const internalOrderController    = new InternalOrderController(ioDAO);


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
const internalOrderArray = [
    {
        id: 1,
        issueDate: '2022/5/12 16:23',
        state: 'ISSUED',
        customerId: 4,
        SKUId: 1,
        description: 'New description',
        price: 10000,
        qty: 1
    },
    {
        id: 2,
        issueDate: '2022/5/12 16:20',
        state: 'COMPLETED',
        customerId: 4,
        SKUId: 1,
        description: 'New description',
        price: 10000,
        qty: 1
    },
    {
        id: 3,
        issueDate: '2022/5/12 16:20',
        state: 'ACCEPTED',
        customerId: 4,
        SKUId: 1,
        description: 'New description',
        price: 10000,
        qty: 1
    }
    
]
const products =  internalOrderArray.map((x)=>{
    delete x.id
    delete x.issueDate
    delete x.state
    delete x.customerId
    return x;
});
const internalOrdersResult = [
    {
        id: 1,
        issueDate: '2022/5/12 16:23',
        state: 'ISSUED',
        customerId: 4,
        products: [
          { SKUId: 1, description: 'New description', price: 10000, qty: 1 }
        ]
    },
    {
        id: 2,
        issueDate: '2022/5/12 16:20',
        state: 'COMPLETED',
        customerId: 4,
        products: [
          {
            SKUId: 1,
            description: 'New description',
            price: 10000,
            RFID: '12345678901234567890123456789016'
          }
        ]
    },
    {
        id: 3,
        issueDate: '2022/5/12 16:23',
        state: 'ACCEPTED',
        customerId: 4,
        products: [
          { SKUId: 1, description: 'New description', price: 10000, qty: 1 }
        ]
    }
    
]


const skuItems = [
    {
        SKUId: 1,
        description: 'New description',
        price: 10000,
        RFID: '12345678901234567890123456789016'
    }
]
const reqBody = {
    issueDate : "2021/11/29 09:33",
    products : [{SKUId:12,description:"a product",price:10.99,qty:30}, {SKUId:180,description: "another product",price:11.99,qty:20}],
    customerId : 1
   
}

/**
 * INTEGRATION TEST: InternalOrderController.getInternalOrders()
 * ========================================================================
 */
 describe('INTEGRATION TEST: InternalOrderController.getInternalOrders()', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        ioDAO.getInternalOrders.mockReset();
        ioDAO.getProductsOfInternalOrder.mockReset();
        ioDAO.getSkuItemsOfInternalOrder.mockReset();

        /* mocking implementation of roDAO.getRestockOrders */
        ioDAO.getInternalOrders.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return internalOrderArray;
        })

        /* mocking implementation of roDAO.getProductsOfRestockOrder */
        ioDAO.getProductsOfInternalOrder.mockImplementationOnce(()=>{
            return products
        }).mockImplementationOnce(()=>{
            return products
        })

        
        /* mocking implementation of ioDAO.getSkuItemsOfRestockOrder */
        ioDAO.getSkuItemsOfInternalOrder.mockImplementationOnce(()=>{
            return []
        }).mockImplementationOnce(()=>{
            return skuItems
        })


    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testGetInternalOrders_MOCK(
        '- Error: ',
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetInternalOrders_MOCK(
        '- Success: ',
        internalOrdersResult
    );
});

/**
 * INTEGRATION TEST: InternalOrderController.getInternalOrders()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetInternalOrders_MOCK(testName,  expectedResult) {
    test(testName, async () => {
        try {
            const result = await internalOrderController.getInternalOrders();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * INTEGRATION TEST: InternalOrderController.getInternalOrdersIssued()
 * ========================================================================
 */
 describe('INTEGRATION TEST: InternalOrderController.getInternalOrdersIssued()', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        ioDAO.getInternalOrdersIssued.mockReset();
        ioDAO.getProductsOfInternalOrder.mockReset();
        

        /* mocking implementation of roDAO.getRestockOrders */
        ioDAO.getInternalOrdersIssued.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return new Array(internalOrderArray[0]);
        })

        /* mocking implementation of roDAO.getProductsOfRestockOrder */
        ioDAO.getProductsOfInternalOrder.mockImplementationOnce(()=>{
            return products
        })

        
  

    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testGetInternalOrdersIssued_MOCK(
        '- Error: ',
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetInternalOrdersIssued_MOCK(
        '- Success: ',
        new Array(internalOrdersResult[0])
    );
});

/**
 * INTEGRATION TEST: InternalOrderController.getInternalOrdersIssued()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetInternalOrdersIssued_MOCK(testName,  expectedResult) {
    test(testName, async () => {
        try {
            const result = await internalOrderController.getInternalOrdersIssued();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * INTEGRATION TEST: InternalOrderController.getInternalOrdersAccepted()
 * ========================================================================
 */
 describe('INTEGRATION TEST: InternalOrderController.getInternalOrders()', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        ioDAO.getInternalOrdersAccepted.mockReset();
        ioDAO.getSkuItemsOfInternalOrder.mockReset();

        /* mocking implementation of roDAO.getRestockOrders */
        ioDAO.getInternalOrdersAccepted.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return new Array(internalOrderArray[2]);
        })

     

        
        /* mocking implementation of ioDAO.getSkuItemsOfRestockOrder */
        ioDAO.getSkuItemsOfInternalOrder.mockImplementationOnce(()=>{
            return skuItems
        })


    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testGetInternalOrdersAccepted_MOCK(
        '- Error: ',
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetInternalOrdersAccepted_MOCK(
        '- Success: ',
        new Array(internalOrdersResult[2])
    );
});

/**
 * INTEGRATION TEST: InternalOrderController.getInternalOrders()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetInternalOrdersAccepted_MOCK(testName,  expectedResult) {
    test(testName, async () => {
        try {
            const result = await internalOrderController.getInternalOrdersAccepted();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}


/**
 * INTEGRATION TEST: InternalOrderController.getInternalOrderById()
 * ========================================================================
 */
 describe('INTEGRATION TEST: InternalOrderController.getInternalOrderById()', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        ioDAO.getInternalOrderById.mockReset();
        ioDAO.getProductsOfInternalOrder.mockReset();
        ioDAO.getSkuItemsOfInternalOrder.mockReset();

        /* mocking implementation of roDAO.getRestockOrderById */
        ioDAO.getInternalOrderById.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return [];
        }).mockImplementationOnce(() => {
            return new Array(internalOrdersResult[0]);
        }).mockImplementationOnce(()=>{
            return new Array(internalOrdersResult[2]);
        })

        
        /* mocking implementation of roDAO.roDAO.getSkuItemsOfRestockOrder */
        ioDAO.getSkuItemsOfInternalOrder.mockImplementation(()=>{
            return skuItems
        })

        ioDAO.getProductsOfInternalOrder.mockImplementation(()=>{
            return products
        })

    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testGetInternalOrderByID_MOCK(
        '- Error: ',
        Error
    );
        /**
     * ---------------------------------
     *    INTEGRATION TEST: NOT FOUND
     * ---------------------------------
     */
         testGetInternalOrderByID_MOCK(
            'NOT FOUND: ',
            ERROR_404
        );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetInternalOrderByID_MOCK(
        '- Success: ',
        {
            code: 200,
            message: internalOrdersResult[0]
        }
    );
     /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
      testGetInternalOrderByID_MOCK(
        '- Success: ',
        {
            code: 200,
            message: internalOrdersResult[2]
        }
    );
});

/**
 * INTEGRATION TEST: RestockOrderController.getRestockOrderByID()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetInternalOrderByID_MOCK(testName,  ID, expectedResult) {
    test(testName, async () => {
        try {
            const result = await internalOrderController.getInternalOrderById(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}


/**
 * INTEGRATION TEST: RestockOrderController.modifyRestockOrderState()
 * ========================================================================
 */
 describe('INTEGRATION TEST: RestockOrderController.modifyRestockOrderState', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        ioDAO.modifyInternalOrderState.mockReset();
        ioDAO.getInternalOrderById.mockReset();
       

        /* mocking implementation of roDAO.getRestockOrderById */
        ioDAO.getInternalOrderById.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return [];
        }).mockImplementationOnce(() => {
            return new Array(internalOrderArray[0]);
        }).mockImplementationOnce(()=>{
            return new Array(internalOrderArray[2]);
        })

        
        /* mocking implementation of roDAO.roDAO.getSkuItemsOfRestockOrder */
        ioDAO.modifyInternalOrderState.mockImplementationOnce(()=>{
            return 1
        })


    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testModifyInternalOrderState_MOCK(
        '- Error: ',
        1,
        "ACCEPTED",
        Error
    );
        /**
     * ---------------------------------
     *    INTEGRATION TEST: NOT FOUND
     * ---------------------------------
     */
         testModifyInternalOrderState_MOCK(
            'NOT FOUND: ',
            1,
            [],
            "ACCEPTED",
            ERROR_404
        );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testModifyInternalOrderState_MOCK(
        '- Success: ',
        1,
        "ACCEPTED",
        [],
        {code: 200}
    );

      /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
       testModifyInternalOrderState_MOCK(
        '- Success: ',
        1,
        "COMPLETED",
        products,
        {code: 200}
    );

});

/**
 * INTEGRATION TEST: RestockOrderController.modifyRestockOrderState()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testModifyInternalOrderState_MOCK(testName,  ID, newState, products, expectedResult) {
    test(testName, async () => {
        try {
            const result = await internalOrderController.modifyInternalOrderState(ID,newState,products);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * INTEGRATION TEST: InternalOrderController.deleteInternalOrder()
 * ========================================================================
 */
 describe('INTEGRATION TEST: InternalOrderController.deleteInternalOrder()', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        ioDAO.deleteInternalOrder.mockReset();
       
        /* mocking implementation of roDAO.roDAO.getSkuItemsOfRestockOrder */
        ioDAO.deleteInternalOrder.mockImplementationOnce(()=>{
            return 1
        }).mockImplementationOnce(() => {
            throw new Error();
        });


    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testDeleteInternalOrder_MOCK(
        'SUCCESS: ',
        1,
        {code: 204}
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testDeleteInternalOrder_MOCK(
        '- Error: ',
        1,
        Error
    );
});

/**
 * INTEGRATION TEST: InternalOrderController.deleteInternalOrder()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testDeleteInternalOrder_MOCK(testName,  ID, expectedResult) {
    test(testName, async () => {
        try {
            const result = await internalOrderController.deleteInternalOrder(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}
/**
 * INTEGRATION TEST: InternalOrderController.createInternalOrder()
 * ========================================================================
 */
 describe('INTEGRATION TEST: InternalOrderController.createInternalOrder()', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        ioDAO.createInternalOrder.mockReset();
       

        
        /* mocking implementation of roDAO.roDAO.getSkuItemsOfRestockOrder */
        ioDAO.createInternalOrder.mockImplementation(()=>{
            throw new Error();

           })
        })




    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testCreateInternalOrder_MOCK(
        '- Error: ',
        reqBody,
        Error
    );

            
 

  

});

/**
 * INTEGRATION TEST: InternalOrderController.createInternalOrder()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testCreateInternalOrder_MOCK(testName,  reqBody, expectedResult) {
    test(testName, async () => {
        try {
            const result = await internalOrderController.createInternalOrder(reqBody.issueDate,reqBody.products,reqBody.customerId);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}