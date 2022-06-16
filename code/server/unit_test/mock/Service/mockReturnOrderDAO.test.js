/**
 *  UNIT TEST: ReturnOrderDAO
 */

/* --------- IMPORT MODULES --------- */
const ReturnOrderDAO    = require('../../../db/ReturnOrderDAO');
const mockDAO           = require('../Database/mockDAO');

/* --------- INITIALIZATION --------- */
const reoDAO = new ReturnOrderDAO(mockDAO);

<<<<<<< HEAD
=======
/**
 * CHANGE1 - ISSUE 24: products[i].itemId is now defined
 * DELIVERY_2022-06-22
*/
>>>>>>> delivery_changes
const returnOrderArray = [
    {
        id: 1,
        returnDate: '2021/11/29 09:33',
        restockOrderId: 1,
        SKUId: 12,
        description: 'a product',
        price: 10.99,
<<<<<<< HEAD
        RFID: '12345678901234567890123456789016'
=======
        RFID: '12345678901234567890123456789016',
        itemId: 10
>>>>>>> delivery_changes
      },
      {
        id: 2,
        returnDate: '2021/11/29 09:33',
        restockOrderId: 1,
        SKUId: 180,
        description: 'another product',
        price: 11.99,
<<<<<<< HEAD
        RFID: '12345678901234567890123456789038'
=======
        RFID: '12345678901234567890123456789038',
        itemId: 18
>>>>>>> delivery_changes
      }
]

const skuItems = [
    {
        SKUId: 12,
        description: 'a product',
        price: 10.99,
        RFID: '12345678901234567890123456789016'
      },
      {
        SKUId: 180,
        description: 'another product',
        price: 11.99,
        RFID: '12345678901234567890123456789038'
      }
]

const reqBody = {
    returnDate : "2021/11/29 09:33",
<<<<<<< HEAD
    products : [{SKUId:12,description:"a product",price:10.99,RFID: '12345678901234567890123456789038'},
                        {SKUId:180,description: "another product",price:11.99,RFID: '12345678901234567890123456789038'}],
=======
    products : [{SKUId:12, itemId: 10, description:"a product",price:10.99,RFID: '12345678901234567890123456789038'},
                {SKUId:180, itemId: 18, description: "another product",price:11.99,RFID: '12345678901234567890123456789038'}],
>>>>>>> delivery_changes
    restockOrderId: 1

}
/**
 * UNIT TEST: reoDAO.getSkuItemsOfReturnOrder()
 * ========================================================================
 */
 describe('UNIT TEST: reoDAO.getSkuItemsOfReturnOrder', () => {
    beforeAll(() => {
        reoDAO.dao.all.mockReset();
        reoDAO.dao.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(skuItems);
            });
        }).mockImplementationOnce(()=>{
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

    testGetSkuItemsOfReturnOrder_MOCK('- Success: ',
        1,
       skuItems
       );
    /**
     * ---------------------------------
     *      UNIT TEST: EMPTY
     * ---------------------------------
     */
     testGetSkuItemsOfReturnOrder_MOCK('- Success: ',
     999999,
     []);
    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testGetSkuItemsOfReturnOrder_MOCK('- Database error: ', 
        1,
        Error);
    
});

/**
 * UNIT TEST: reoDAO.getSkuItemsOfReturnOrder()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetSkuItemsOfReturnOrder_MOCK(testName, ID, expectedResult) {
    test(testName, async () => {   
        try {
            const result = await reoDAO.getSkuItemsOfReturnOrder(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}



/**
 * UNIT TEST: reoDAO.getReturnOrderByID(id)
 * ========================================================================
 */
 describe('UNIT TEST: ReturnOrderDAO.getReturnOrderByID(id)', () => {
    beforeAll(() => {
        reoDAO.dao.all.mockReset();
        reoDAO.dao.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(new Array(returnOrderArray[0]));
            });
        }).mockImplementationOnce(()=>{
           return new Promise((resolve,reject)=>{
               resolve([]);
           }); 
        }).mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject(error);
            });
        });
    });

    


 /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
  testGetReturnOrderID_MOCK(
    '- Success: ', 
    1,
    new Array(returnOrderArray[0])
);

   /**
     * ---------------------------------
     *      UNIT TEST: EMPTY RESULT
     * ---------------------------------
     */
    testGetReturnOrderID_MOCK(
        '- Success (empty): ', 
        999999,
        []
    );


    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testGetReturnOrderID_MOCK(
        '- Database error: ', 
        1,
        Error
    );
    
});
/**
 * UNIT TEST: reoDAO.getReturnOrderByID(id)
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Number} ID identifier of the target internal order
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetReturnOrderID_MOCK(testName, ID, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await reoDAO.getReturnOrderById(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * UNIT TEST: reoDAO.getReturnOrders()
 * ========================================================================
 */
 describe('UNIT TEST: reoDAO.getReturnOrders()', () => {
    beforeAll(() => {
        reoDAO.dao.all.mockReset();
        reoDAO.dao.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(returnOrderArray);
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
     testGetReturnOrders_MOCK('- Success: ', returnOrderArray);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
    testGetReturnOrders_MOCK('- Database error: ', Error);
    
});

/**
 * UNIT TEST: reoDAO.getReturnOrders()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetReturnOrders_MOCK(testName, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await reoDAO.getReturnOrders();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * UNIT TEST: reoDAO.createReturnOrder()
 * ========================================================================
 */
 describe('UNIT TEST: reoDAO.createReturnOrder()', () => {
    beforeAll(() => {
        reoDAO.dao.run.mockReset();
        reoDAO.dao.run.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(1);
            });
        });
        reoDAO.dao.get.mockReset();
        reoDAO.dao.get.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve({id: 1});
            })
        }).mockImplementationOnce(()=>{
            return new Promise((resolve, reject) => {
                resolve(undefined);
            });
        })
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testCreateReturnOrder_MOCK('- Success: ', reqBody, 2);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
    testCreateReturnOrder_MOCK('- Database error: ', reqBody, Error);
    
    /**
     * ---------------------------------
     *      UNIT TEST: TABLE EMPTY
     * ---------------------------------
     */
     testCreateReturnOrder_MOCK('- table empty: ', reqBody, 1);

});


/**
 * UNIT TEST: reoDAO.createReturnOrder()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testCreateReturnOrder_MOCK(testName, reqBody, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await reoDAO.createReturnOrder(reqBody.returnDate, reqBod.restockOrderId,reqBody.products);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}


/**
 * UNIT TEST: reoDAO.deleteReturnOrder()
 * ========================================================================
 */
 describe('UNIT TEST: reoDAO.deleteReturnOrder()', () => {
    beforeAll(() => {

        reoDAO.dao.run.mockReset();
        reoDAO.dao.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(1);
            })
        }).mockImplementationOnce(()=>{
            return new Promise((resolve, reject) => {
                reject({message: "Error"});
            });
        })

    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testDeleteReturnOrder_MOCK('- Success: ',1,1);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testDeleteReturnOrder_MOCK('- Database error: ', 1, Error);


});


/**
 * UNIT TEST: roDAO.deleteRestockOrder()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testDeleteReturnOrder_MOCK(testName, ID, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await reoDAO.deleteReturnOrder(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}