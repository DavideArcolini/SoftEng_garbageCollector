/**
 *  INTEGRATION TEST: restockOrderController
 *           VERSION: mocked
 * --------------------------------------------
 * Services do not access the database. All the
 * function implementations are mocked in order
 * to test all possible behaviors.
*/

/* --------- IMPORT MODULES --------- */
const RestockOrderController     = require('../../../controller/RestockOrderController');
const roDAO       = require('../Database/mockRestockOrderDAO');

/* --------- INITIALIZATION --------- */
const restockOrderController    = new RestockOrderController(roDAO);


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
const restockOrdersResult = [
    {
        id: 1,
        issueDate: '2021/11/29 09:33',
        state: 'ISSUED',
        supplierId: 1,
        products: [
          { SKUId: 12, description: 'a product', price: 10.99, qty: 3 }
        ],
        skuItems: []
    },
    {
        id: 2,
        issueDate: '2022/5/12 17:44',
        state: 'COMPLETEDRETURN',
        supplierId: 1,
        products: [
          { SKUId: 180, description: 'another product', price: 11.99, qty: 2 }
        ],
        transportNote:{deliveryDate: '2022/07/12 17:44'},
        skuItems: [ { SKUId: 1, RFID: '00000000000000000000000000000001' },
                    { SKUId: 1, RFID: '00000000000000000000000000000002' } ]
    }
<<<<<<< HEAD


=======
>>>>>>> delivery_changes
]
const restockOrderArray = [
    {
        id: 1,
        issueDate: '2021/11/29 09:33',
        state: 'ISSUED',
        supplierId: 1,
        SKUId: 12,
        description: 'a product',
        price: 10.99,
        deliveryDate: null,
        qty: 3
      },
      {
        id: 2,
        issueDate: '2022/05/12 17:44',
        state: 'COMPLEDRETURN',
        supplierId: 1,
        SKUId: 1,
        description: 'another product',
        price: 11.99,
        deliveryDate: '2022/07/12 17:44',
        qty: 2
      },
]

<<<<<<< HEAD
=======
const restockOrderArray1 = [
    {
        id: 1,
        issueDate: '2021/11/29 09:33',
        state: 'ISSUED',
        supplierId: 1,
        SKUId: 12,
        description: 'a product',
        price: 10.99,
        deliveryDate: null,
        qty: 3
      },
      {
        id: 2,
        issueDate: '2022/05/12 17:44',
        state: 'COMPLEDRETURN',
        supplierId: 1,
        SKUId: 1,
        description: 'another product',
        price: 11.99,
        deliveryDate: '2022/07/12 17:44',
        qty: 2
    }
]

>>>>>>> delivery_changes

const restockOrderProducts = [
    {
        id: 1,
        SKUId: 12,
        description: 'a product',
        price: 10.99,
        qty: 3
      },
      {

        id: 2,
        SKUId: 1,
        description: 'another product',
        price: 11.99,
        qty: 2
      },
]

const skuItems = [
    { SKUId: 1, RFID: '00000000000000000000000000000001' } ,
    { SKUId: 1, RFID: '00000000000000000000000000000002' } 

]
const products =  restockOrderProducts.map((x)=>{
    delete x.id
    return x;
});
const reqBody = {
    issueDate: restockOrderArray[0].issueDate,
    supplierId: restockOrderArray[0].supplierId,
    products
}
const transportNote = {transportNote:{deliveryDate:"2022/12/29"}}

const restockOrderDelivered = 
    {
        id: 3,
        issueDate: '2022/05/12 17:44',
        state: 'DELIVERED',
        supplierId: 1,
        SKUId: 1,
        description: 'another product',
        price: 11.99,
        deliveryDate: '2022/07/12 17:44',
        qty: 2
    }

    const restockOrderDelivery = 
    {
        id: 4,
        issueDate: '2022/05/12 17:44',
        state: 'DELIVERY',
        supplierId: 1,
        SKUId: 1,
        description: 'another product',
        price: 11.99,
        deliveryDate: '2022/07/12 17:44',
        qty: 2
    }




/**
 * INTEGRATION TEST: RestockOrderController.getRestockOrders()
 * ========================================================================
 */
 describe('INTEGRATION TEST: RestockOrderController.getRestockOrders', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        roDAO.getRestockOrders.mockReset();
        roDAO.getProductsOfRestockOrder.mockReset();
        roDAO.getSkuItemsOfRestockOrder.mockReset();

        /* mocking implementation of roDAO.getRestockOrders */
        roDAO.getRestockOrders.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return restockOrderArray;
        })

        /* mocking implementation of roDAO.getProductsOfRestockOrder */
        roDAO.getProductsOfRestockOrder.mockImplementationOnce(()=>{
            return []
        }).mockImplementationOnce(()=>{
            return new Array(products[0])
        }).mockImplementationOnce(()=>{
            return new Array(products[1])
        })

        
        /* mocking implementation of roDAO.roDAO.getSkuItemsOfRestockOrder */
        roDAO.getSkuItemsOfRestockOrder.mockImplementationOnce(()=>{
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
     testGetRestockOrders_MOCK(
        '- Error: ',
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetRestockOrders_MOCK(
        '- Success: ',
        restockOrdersResult
    );
});

/**
 * INTEGRATION TEST: RestockOrderController.getRestockOrders()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetRestockOrders_MOCK(testName,  expectedResult) {
    test(testName, async () => {
        try {
            const result = await restockOrderController.getRestockOrders();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * INTEGRATION TEST: RestockOrderController.getRestockOrdersIssued()
 * ========================================================================
 */
 describe('INTEGRATION TEST: RestockOrderController.getRestockOrdersIssued', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        roDAO.getRestockOrdersIssued.mockReset();
        roDAO.getProductsOfRestockOrder.mockReset();
        roDAO.getSkuItemsOfRestockOrder.mockReset();

        /* mocking implementation of roDAO.getRestockOrdersIssued */
        roDAO.getRestockOrdersIssued.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return new Array(restockOrderArray[0]);
        })

        /* mocking implementation of roDAO.getProductsOfRestockOrder */
        roDAO.getProductsOfRestockOrder.mockImplementationOnce(()=>{
            return new Array(products[0])
        })
        
        /* mocking implementation of roDAO.roDAO.getSkuItemsOfRestockOrder */
        roDAO.getSkuItemsOfRestockOrder.mockImplementationOnce(()=>{
            return []
        })


    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testGetRestockOrdersIssued_MOCK(
        '- Error: ',
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetRestockOrdersIssued_MOCK(
        '- Success: ',
        new Array(restockOrdersResult[0])
    );
});

/**
 * INTEGRATION TEST: RestockOrderController.getRestockOrdersIssued()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetRestockOrdersIssued_MOCK(testName,  expectedResult) {
    test(testName, async () => {
        try {
            const result = await restockOrderController.getRestockOrdersIssued();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * INTEGRATION TEST: RestockOrderController.getRestockOrderById()
 * ========================================================================
 */
 describe('INTEGRATION TEST: RestockOrderController.getRestockOrderById', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
<<<<<<< HEAD
=======
        roDAO.getRestockOrders.mockReset();
>>>>>>> delivery_changes
        roDAO.getRestockOrderById.mockReset();
        roDAO.getProductsOfRestockOrder.mockReset();
        roDAO.getSkuItemsOfRestockOrder.mockReset();

        /* mocking implementation of roDAO.getRestockOrderById */
        roDAO.getRestockOrderById.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return [];
        }).mockImplementationOnce(() => {
            return new Array(restockOrderArray[0]);
        }).mockImplementationOnce(()=>{
            return new Array(restockOrderArray[1]);
        })

        
        /* mocking implementation of roDAO.roDAO.getSkuItemsOfRestockOrder */
        roDAO.getSkuItemsOfRestockOrder.mockImplementationOnce(()=>{
            return []
        }).mockImplementationOnce(()=>{
            return skuItems
        })

<<<<<<< HEAD
=======
        roDAO.getRestockOrders.mockImplementationOnce(() => {
            return restockOrderArray;
        });

>>>>>>> delivery_changes

    });

    /**
     * ---------------------------------
<<<<<<< HEAD
=======
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetRestockOrdersByID_MOCK(
        '- Success (state !== issued): ',
        {
            code: 200,
            message: restockOrdersResult[1]
        }
    );

    /**
     * ---------------------------------
>>>>>>> delivery_changes
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testGetRestockOrdersByID_MOCK(
        '- Error: ',
        Error
    );
        /**
     * ---------------------------------
     *    INTEGRATION TEST: NOT FOUND
     * ---------------------------------
     */
         testGetRestockOrdersByID_MOCK(
            'NOT FOUND: ',
            ERROR_404
        );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetRestockOrdersByID_MOCK(
        '- Success: ',
        {
            code: 200,
            message: restockOrdersResult[0]
        }
    );
     /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
      testGetRestockOrdersByID_MOCK(
        '- Success: ',
        {
            code: 200,
            message: restockOrdersResult[1]
        }
    );
<<<<<<< HEAD
=======

>>>>>>> delivery_changes
});

/**
 * INTEGRATION TEST: RestockOrderController.getRestockOrderByID()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetRestockOrdersByID_MOCK(testName,  ID, expectedResult) {
    test(testName, async () => {
        try {
            const result = await restockOrderController.getRestockOrderById(ID);
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
        roDAO.modifyRestockOrderState.mockReset();
        roDAO.getRestockOrderById.mockReset();
       

        /* mocking implementation of roDAO.getRestockOrderById */
        roDAO.getRestockOrderById.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return [];
        }).mockImplementationOnce(() => {
            return new Array(restockOrderArray[0]);
        })

        
        /* mocking implementation of roDAO.roDAO.getSkuItemsOfRestockOrder */
        roDAO.modifyRestockOrderState.mockImplementationOnce(()=>{
            return 1
        })


    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testModifyRestockOrderState_MOCK(
        '- Error: ',
        1,
        "DELIVERY",
        Error
    );
        /**
     * ---------------------------------
     *    INTEGRATION TEST: NOT FOUND
     * ---------------------------------
     */
         testModifyRestockOrderState_MOCK(
            'NOT FOUND: ',
            1,
            "DELIVERY",
            ERROR_404
        );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testModifyRestockOrderState_MOCK(
        '- Success: ',
        1,
        "DELIVERY",
        MESSG_200
    );

});

/**
 * INTEGRATION TEST: RestockOrderController.modifyRestockOrderState()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testModifyRestockOrderState_MOCK(testName,  ID, newState, expectedResult) {
    test(testName, async () => {
        try {
            const result = await restockOrderController.modifyRestockOrderState(ID,newState);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}


/**
 * INTEGRATION TEST: RestockOrderController.setSkuItems()
 * ========================================================================
 */
 describe('INTEGRATION TEST: RestockOrderController.setSkuItems', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        roDAO.getRestockOrderById.mockReset();
        roDAO.setSkuItems.mockReset();
       

        /* mocking implementation of roDAO.getRestockOrderById */
        roDAO.getRestockOrderById.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return [];
        }).mockImplementationOnce(() => {
            return new Array(restockOrderArray[0]);
        }).mockImplementationOnce(() => {
            return restockOrderDelivered
        })

        
        /* mocking implementation of roDAO.roDAO.getSkuItemsOfRestockOrder */
        roDAO.setSkuItems.mockImplementationOnce(()=>{
            return 3
        })


    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testSetSkuItems_MOCK(
        '- Error: ',
        1,
        skuItems,
        Error
    );
        /**
     * ---------------------------------
     *    INTEGRATION TEST: NOT FOUND
     * ---------------------------------
     */
         testSetSkuItems_MOCK(
            'NOT FOUND: ',
            9999,
            skuItems,
            ERROR_404
        );
                /**
     * ---------------------------------
     *    INTEGRATION TEST: NOT FOUND
     * ---------------------------------
     */
        testSetSkuItems_MOCK(
        'UNPROCESSABLE: ',
        1,
        skuItems,
        ERROR_422
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testSetSkuItems_MOCK(
        'SUCCESS: ',
        3,
        skuItems,
        MESSG_200
    );

});

/**
 * INTEGRATION TEST: RestockOrderController.setSkuItems()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testSetSkuItems_MOCK(testName,  ID, skuItems, expectedResult) {
    test(testName, async () => {
        try {
            const result = await restockOrderController.setSkuItems(ID,skuItems);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}


/**
 * INTEGRATION TEST: RestockOrderController.addTransportNote()
 * ========================================================================
 */
 describe('INTEGRATION TEST: RestockOrderController.addTransportNote', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        roDAO.getRestockOrderById.mockReset();
        roDAO.addTransportNote.mockReset();
       

        /* mocking implementation of roDAO.getRestockOrderById */
        roDAO.getRestockOrderById.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return [];
        }).mockImplementationOnce(() => {
            return new Array(restockOrderArray[0]);
        }).mockImplementationOnce(() => {
            return restockOrderDelivery
        }).mockImplementationOnce(() => {
            return restockOrderDelivery
        })

        
        /* mocking implementation of roDAO.roDAO.getSkuItemsOfRestockOrder */
        roDAO.addTransportNote.mockImplementationOnce(()=>{
            return 3
        })


    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testAddTransportNote_MOCK(
        '- Error: ',
        1,
        transportNote,
        Error
    );
        /**
     * ---------------------------------
     *    INTEGRATION TEST: NOT FOUND
     * ---------------------------------
     */
         testAddTransportNote_MOCK(
            'NOT FOUND: ',
            9999,
            transportNote,
            ERROR_404
        );
                /**
     * ---------------------------------
     *    INTEGRATION TEST: NOT FOUND
     * ---------------------------------
     */
        testAddTransportNote_MOCK(
        'UNPROCESSABLE: ',
        1,
        transportNote,
        ERROR_422
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testAddTransportNote_MOCK(
        'SUCCESS: ',
        4,
        transportNote,
        MESSG_200
    );
    /**
     * ---------------------------------
     *    INTEGRATION TEST: UNPROCESSABLE
     * ---------------------------------
     */
     testAddTransportNote_MOCK(
        'UNPROCESSABLE: ',
        4,
        {deliveryDate: '2020/01/12 03:46'},
        ERROR_422
    );


});

/**
 * INTEGRATION TEST: RestockOrderController.addTransportNote()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testAddTransportNote_MOCK(testName,  ID, transportNote, expectedResult) {
    test(testName, async () => {
        try {
            const result = await restockOrderController.addTransportNote(ID,transportNote);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * INTEGRATION TEST: RestockOrderController.deleteRestockOrder()
 * ========================================================================
 */
 describe('INTEGRATION TEST: RestockOrderController.deleteRestockOrder', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
<<<<<<< HEAD
        roDAO.getRestockOrderById.mockReset();
        roDAO.deleteRestockOrder.mockReset();
       

        /* mocking implementation of roDAO.getRestockOrderById */
        roDAO.getRestockOrderById.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return new Array(restockOrderArray[0]);
        })

        
        /* mocking implementation of roDAO.roDAO.getSkuItemsOfRestockOrder */
        roDAO.deleteRestockOrder.mockImplementationOnce(()=>{
=======
        roDAO.deleteRestockOrder.mockReset();
        
        /* mocking implementation of roDAO.getSkuItemsOfRestockOrder */
        roDAO.deleteRestockOrder.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(()=>{
>>>>>>> delivery_changes
            return 1
        })


    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testDeleteRestockOrder_MOCK(
        '- Error: ',
        1,
        Error
    );

            
 

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testDeleteRestockOrder_MOCK(
        'SUCCESS: ',
        1,
        MESSG_204
    );

});

/**
 * INTEGRATION TEST: RestockOrderController.deleteRestockOrder()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
<<<<<<< HEAD
 function testDeleteRestockOrder_MOCK(testName,  ID) {
=======
 function testDeleteRestockOrder_MOCK(testName, ID, expectedResult) {
>>>>>>> delivery_changes
    test(testName, async () => {
        try {
            const result = await restockOrderController.deleteRestockOrder(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
<<<<<<< HEAD
            expect(error).toBeInstanceOf(Error);
=======
            expect(error).toBeInstanceOf(expectedResult);
>>>>>>> delivery_changes
        }
    }); 
}


/**
 * INTEGRATION TEST: RestockOrderController.getReturnItems()
 * ========================================================================
 */
 describe('INTEGRATION TEST: RestockOrderController.getReturnItems', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        roDAO.getRestockOrderById.mockReset();
       

        /* mocking implementation of roDAO.getRestockOrderById */
        roDAO.getRestockOrderById.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return [];
        }).mockImplementationOnce(()=>{
            return new Array(restockOrderArray[0]);
        }).mockImplementationOnce(() => {
            return new Array(restockOrderArray[1]);
        })


    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testGetReturnItemsRestockOrder_MOCK(
        '- Error: ',
        1,
        Error
    );

            
    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetReturnItemsRestockOrder_MOCK(
        'NOT FOUND: ',
        1,
        ERROR_404
    );
     /**
     * ---------------------------------
     *    INTEGRATION TEST: UNPROCESSABLE
     * ---------------------------------
     */
      testGetReturnItemsRestockOrder_MOCK(
        'UNPROCESSABLE: ',
        1,
        ERROR_422
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetReturnItemsRestockOrder_MOCK(
        'SUCCESS: ',
        1,
        []
    );

});

/**
 * INTEGRATION TEST: RestockOrderController.getReturnItems()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetReturnItemsRestockOrder_MOCK(testName,  ID) {
    test(testName, async () => {
        try {
            const result = await restockOrderController.getReturnItems(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

<<<<<<< HEAD
=======
/**
 * INTEGRATION TEST: RestockOrderController.testCreateRestockOrder_MOCK()
 * ========================================================================
 */
 describe('INTEGRATION TEST: RestockOrderController.testCreateRestockOrder_MOCK', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        roDAO.createRestockOrder.mockReset();

       roDAO.createRestockOrder.mockImplementationOnce(()=>{
        throw new Error()
       })

    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testCreateRestockOrder_MOCK(
        '- Error: ',
        reqBody.issueDate,
        reqBody.supplierId,
        reqBody.products,
        Error
    );
  

});

/**
 * INTEGRATION TEST: RestockOrderController.getReturnItems()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testCreateRestockOrder_MOCK(testName, issueDate, supplierId, products,expectedResult) {
    test(testName, async () => {
        try {
            const result = await restockOrderController.createRestockOrder(issueDate, supplierId, products);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}


>>>>>>> delivery_changes
