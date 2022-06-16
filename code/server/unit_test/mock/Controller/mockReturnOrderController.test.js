/**
 *  INTEGRATION TEST: restockOrderController
 *           VERSION: mocked
 * --------------------------------------------
 * Services do not access the database. All the
 * function implementations are mocked in order
 * to test all possible behaviors.
*/

/* --------- IMPORT MODULES --------- */
const ReturnOrderController     = require('../../../controller/ReturnOrderController');
const reoDAO                    = require('../Database/mockReturnOrderDAO');

/* --------- INITIALIZATION --------- */
const returnOrderController    = new ReturnOrderController(reoDAO);


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

const restockOrder = 
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

const returnOrderResult = [
    {
        id: 1,
        returnDate: '2021/11/29 09:33',
        restockOrderId: 1,
        products: [
          {
            SKUId: 12,
            description: 'a product',
            price: 10.99,
            RFID: '12345678901234567890123456789016',
            itemId: 10
          },
          {
            SKUId: 180,
            description: 'another product',
            price: 11.99,
            RFID: '12345678901234567890123456789038',
            itemId: 18
          }
        ]
      },{
        id: 2,
        returnDate: '2021/11/29 09:33',
        restockOrderId: 1,
        products: [
          {
            SKUId: 12,
            description: 'a product',
            price: 10.99,
            RFID: '12345678901234567890123456789016', 
            itemId: 11
          },
          {
            SKUId: 180,
            description: 'another product',
            price: 11.99,
            RFID: '12345678901234567890123456789038',
            itemId: 19
          }
        ],
      }
]

const skuItems = [
    {
        SKUId: 12,
        RFID: '12345678901234567890123456789016'
      },
      {
        SKUId: 180,
        RFID: '12345678901234567890123456789038'
      }
]

const returnOrderArray = [
    {
        id: 1,
        returnDate: '2021/11/29 09:33',
        restockOrderId: 1,
        SKUId: 12,
        description: 'a product',
        price: 10.99,
        RFID: '12345678901234567890123456789016',
        itemId: 10
      },
      {
        id: 2,
        returnDate: '2021/11/29 09:33',
        restockOrderId: 1,
        SKUId: 180,
        description: 'another product',
        price: 11.99,
        RFID: '12345678901234567890123456789038',
        itemId: 18
      }
]
const reqBody = {
    returnDate : "2021/11/29 09:33",
    products : [{SKUId:12,description:"a product",price:10.99,RFID: '12345678901234567890123456789038'},
                {SKUId:180,description: "another product",price:11.99,RFID: '12345678901234567890123456789038'}],
    restockOrderId: 1

}
/**
 * INTEGRATION TEST: ReturnOrderController.getReturnOrders()
 * ========================================================================
 */
 describe('INTEGRATION TEST: ReturnOrderController.getReturnOrders', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        reoDAO.getReturnOrders.mockReset();
        reoDAO.getSkuItemsOfReturnOrder.mockReset();

        /* mocking implementation of reoDAO.getRestockOrders */
        reoDAO.getReturnOrders.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return returnOrderArray;
        })

        
        /* mocking implementation of roDAO.roDAO.getSkuItemsOfRestockOrder */
        reoDAO.getSkuItemsOfReturnOrder.mockImplementationOnce(()=>{
            return skuItems
        }).mockImplementationOnce(()=>{
            return skuItems
        })


    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testGetReturnOrders_MOCK(
        '- Error: ',
        Error
    );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetReturnOrders_MOCK(
        '- Success: ',
        returnOrderResult
    );
});

/**
 * INTEGRATION TEST: RestockOrderController.getRestockOrders()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetReturnOrders_MOCK(testName,  expectedResult) {
    test(testName, async () => {
        try {
            const result = await returnOrderController.getReturnOrders();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}
/**
 * INTEGRATION TEST: ReturnOrderController.getReturnOrderById()
 * ========================================================================
 */
 describe('INTEGRATION TEST: ReturnOrderController.getReturnOrderById()', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        reoDAO.getReturnOrderById.mockReset();
        

        /* mocking implementation of roDAO.getRestockOrderById */
        reoDAO.getReturnOrderById.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return [];
        }).mockImplementationOnce(() => {
            return new Array(returnOrderArray[0]);
        }).mockImplementationOnce(()=>{
            return new Array(returnOrderArray[1]);
        })

        

    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testGetReturnOrdersByID_MOCK(
        '- Error: ',
        Error
    );
        /**
     * ---------------------------------
     *    INTEGRATION TEST: NOT FOUND
     * ---------------------------------
     */
         testGetReturnOrdersByID_MOCK(
            'NOT FOUND: ',
            ERROR_404
        );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetReturnOrdersByID_MOCK(
        '- Success: ',
        {
            code: 200,
            message: returnOrderResult[0]
        }
    );
     /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
      testGetReturnOrdersByID_MOCK(
        '- Success: ',
        {
            code: 200,
            message: returnOrderResult[1]
        }
    );
});

/**
 * INTEGRATION TEST: ReturnOrderController.getReturnOrderById()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetReturnOrdersByID_MOCK(testName,  ID, expectedResult) {
    test(testName, async () => {
        try {
            const result = await returnOrderController.getReturnOrderById(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}


/**
 * INTEGRATION TEST: ReturnOrderController.createReturnOrder()
 * ========================================================================
 */
 describe('INTEGRATION TEST: ReturnOrderController.createReturnOrder()', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        reoDAO.getRestockOrderById.mockReset();
        

        /* mocking implementation of roDAO.getRestockOrderById */
        reoDAO.getRestockOrderById.mockImplementationOnce(() => {
            throw new Error();
        }).mockImplementationOnce(() => {
            return [];
        }).mockImplementationOnce(() => {
            return new Array(restockOrder);
        })

        

    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testCreateReturnOrder_MOCK(
        '- Error: ',
        reqBody,
        Error
    );
        /**
     * ---------------------------------
     *    INTEGRATION TEST: NOT FOUND
     * ---------------------------------
     */
         testCreateReturnOrder_MOCK(
            'NOT FOUND: ',
            reqBody,
            ERROR_404
        );

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testCreateReturnOrder_MOCK(
        '- Success: ',
        reqBody,
        {
            code: 201,
            
        }
    );
  
});

/**
 * INTEGRATION TEST: ReturnOrderController.createReturnOrderById()
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testCreateReturnOrder_MOCK(testName,  reqBody, expectedResult) {
    test(testName, async () => {
        try {
            const result = await returnOrderController.createReturnOrder(reqBody.returnDate,reqBody.restockOrderId,reqBody.products)
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}


/**
 * INTEGRATION TEST: ReturnOrderController.deleteReturnOrder()
 * ========================================================================
 */
 describe('INTEGRATION TEST: ReturnOrderController.deleteReturnOrder', () => {
    
    /* reset mock implementation before every tests */
    beforeAll(() => {

        /* reset mocked implementations */
        reoDAO.deleteReturnOrder.mockReset();
       

      
      
        
        /* mocking implementation of reoDAO.deleteReturnOrder */
        reoDAO.deleteReturnOrder.mockImplementationOnce(()=>{
            return 1
        })


    });

    /**
     * ---------------------------------
     *    INTEGRATION TEST: ERROR
     * ---------------------------------
     */
     testDeleteReturnOrder_MOCK(
        '- Error: ',
        1,
        Error
    );

            
 

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testDeleteReturnOrder_MOCK(
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
 function testDeleteReturnOrder_MOCK(testName,  ID) {
    test(testName, async () => {
        try {
            const result = await returnOrderController.deleteReturnOrder(ID);S
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}