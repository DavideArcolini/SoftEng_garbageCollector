/**
 *  UNIT TEST: InternalOrderDAO
 */

/* --------- IMPORT MODULES --------- */
const InternalOrderDAO    = require('../../../db/InternalOrderDAO');
const mockDAO             = require('../Database/mockDAO');

/* --------- INITIALIZATION --------- */
const ioDAO = new InternalOrderDAO(mockDAO);

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
let reqBody = {
    issueDate : "2021/11/29 09:33",
    products : [{SKUId:12,description:"a product",price:10.99,qty:30}, {SKUId:180,description: "another product",price:11.99,qty:20}],
    customerId : 1
   
}

const skuItems = [
    {
        SKUId: 1,
        description: 'New description',
        price: 10000,
        RFID: '12345678901234567890123456789016'
    }
]

/*
    + -------------------- +
    |         TESTS        |
    + -------------------- +
*/
/**
 * UNIT TEST: ioDAO.getInternalOrderByID(id)
 * ========================================================================
 */
 describe('UNIT TEST: InternalOrderDAO.getInternalOrderByID(id)', () => {
    beforeAll(() => {
        ioDAO.dao.all.mockReset();
        ioDAO.dao.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(new Array(internalOrderArray[0]));
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
  testGetInternalOrderID_MOCK(
    '- Success: ', 
    1,
    new Array(internalOrderArray[0])
);

   /**
     * ---------------------------------
     *      UNIT TEST: EMPTY RESULT
     * ---------------------------------
     */
    testGetInternalOrderID_MOCK(
        '- Success (empty): ', 
        999999,
        []
    );


    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testGetInternalOrderID_MOCK(
        '- Database error: ', 
        1,
        Error
    );
    
});
/**
 * UNIT TEST: ioDAO.getInternalOrderByID(id)
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Number} ID identifier of the target internal order
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetInternalOrderID_MOCK(testName, ID, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await ioDAO.getInternalOrderById(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}
/**
 * UNIT TEST: ioDAO.createInternalOrder()
 * ========================================================================
 */
 describe('UNIT TEST: ioDAO.createInternalOrder()', () => {
    beforeAll(() => {
        ioDAO.dao.run.mockReset();
        ioDAO.dao.run.mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(1);
            });
        });
        ioDAO.dao.get.mockReset();
        ioDAO.dao.get.mockImplementationOnce(() => {
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
     testCreateInternalOrder_MOCK('- Success: ', reqBody, 2);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
    testCreateInternalOrder_MOCK('- Database error: ', reqBody, Error);
    
    /**
     * ---------------------------------
     *      UNIT TEST: TABLE EMPTY
     * ---------------------------------
     */
     testCreateInternalOrder_MOCK('- table empty: ', reqBody, 1);

});


/**
 * UNIT TEST: ioDAO.createInternalOrder()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testCreateInternalOrder_MOCK(testName, reqBody, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await ioDAO.createInternalOrder(reqBody.issueDate, reqBody.products, reqBody.customerId);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}


/**
 * UNIT TEST: ioDAO.getInternalOrders()
 * ========================================================================
 */
 describe('UNIT TEST: ioDAO.getInternalOrders()', () => {
    beforeAll(() => {
        ioDAO.dao.all.mockReset();
        ioDAO.dao.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(internalOrderArray);
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
    testGetInternalOrders_MOCK('- Success: ', internalOrderArray);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
    testGetInternalOrders_MOCK('- Database error: ', Error);
    
});

/**
 * UNIT TEST: ioDAO.getInternalOrders()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetInternalOrders_MOCK(testName, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await ioDAO.getInternalOrders();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}


/**
 * UNIT TEST: ioDAO.getInternalOrdersIssued()
 * ========================================================================
 */
 describe('UNIT TEST: ioDAO.getInternalOrdersIssued()', () => {
    beforeAll(() => {
        ioDAO.dao.all.mockReset();
        ioDAO.dao.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(new Array(internalOrderArray[0]));
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
    testGetInternalOrdersIssued_MOCK('- Success: ', new Array(internalOrderArray[0]));

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
    testGetInternalOrdersIssued_MOCK('- Database error: ', Error);
    
});

/**
 * UNIT TEST: ioDAO.getInternalOrders()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetInternalOrdersIssued_MOCK(testName, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await ioDAO.getInternalOrdersIssued();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}


/**
 * UNIT TEST: ioDAO.getInternalOrdersAccepted()
 * ========================================================================
 */
 describe('UNIT TEST: ioDAO.getInternalOrdersAccepted()', () => {
    beforeAll(() => {
        ioDAO.dao.all.mockReset();
        ioDAO.dao.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(new Array(internalOrderArray[2]));
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
    testGetInternalOrdersAccepted_MOCK('- Success: ', new Array(internalOrderArray[2]));

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
    testGetInternalOrdersAccepted_MOCK('- Database error: ', Error);
    
});

/**
 * UNIT TEST: ioDAO.getInternalOrders()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetInternalOrdersAccepted_MOCK(testName, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await ioDAO.getInternalOrdersAccepted();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}


/**
 * UNIT TEST: ioDAO.modifyInternalOrderState()
 * ========================================================================
 */
 describe('UNIT TEST: ioDAO.modifyInternalOrderState()', () => {
    beforeAll(() => {
        ioDAO.dao.run.mockReset();
        ioDAO.dao.run.mockImplementationOnce(() => {
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
     testModifyInternalOrderState_MOCK('- Success: ', 1, "ACCEPTED", 1);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testModifyInternalOrderState_MOCK('- Database error: ', 1, "ACCEPTED", Error);


});


/**
 * UNIT TEST: ioDAO.modifyInternalOrderState()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testModifyInternalOrderState_MOCK(testName, ID, newState, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await ioDAO.modifyInternalOrderState(ID,newState);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * UNIT TEST: ioDAO.setSkuItems()
 * ========================================================================
 */
 describe('UNIT TEST: ioDAO.setSkuItems()', () => {
    beforeAll(() => {
        ioDAO.dao.get.mockReset();
        ioDAO.dao.get.mockImplementation(()=>{
            return new Promise((resolve, reject) => {
                resolve({min_id: 1});
            })
        })
        ioDAO.dao.run.mockReset();
        ioDAO.dao.run.mockImplementationOnce(() => {
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
     testSetSkuItems_MOCK('- Success: ',1,skuItems,1);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testSetSkuItems_MOCK('- Database error: ', 1, skuItems, Error);


});


/**
 * UNIT TEST: roDAO.setSkuItems()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testSetSkuItems_MOCK(testName, ID, skuItems, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await ioDAO.setSkuItems(ID,skuItems);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * UNIT TEST: ioDAO.deleteInternalOrder()
 * ========================================================================
 */
 describe('UNIT TEST: ioDAO.deleteInternalOrder()', () => {
    beforeAll(() => {

        ioDAO.dao.run.mockReset();
        ioDAO.dao.run.mockImplementationOnce(() => {
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
     testDeleteInternalOrder_MOCK('- Success: ',1,1);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testDeleteInternalOrder_MOCK('- Database error: ', 1, Error);


});


/**
 * UNIT TEST: ioDAO.deleteInternalOrder()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testDeleteInternalOrder_MOCK(testName, ID, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await ioDAO.deleteInternalOrder(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}
/**
 * UNIT TEST: ioDAO.getProductsOfInternalOrder()
 * ========================================================================
 */
 describe('UNIT TEST: roDAO.getProductsOfInternalOrder', () => {
    beforeAll(() => {
        ioDAO.dao.all.mockReset();
        ioDAO.dao.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(internalOrderArray);
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
 
    testGetProductsOfInternalOrder_MOCK('- Success: ',
        1,
        products
       );
    /**
     * ---------------------------------
     *      UNIT TEST: EMPTY
     * ---------------------------------
     */
     testGetProductsOfInternalOrder_MOCK('- Success: ',
     999999,
     []);
    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testGetProductsOfInternalOrder_MOCK('- Database error: ', 
        1,
        Error);
    
});

/**
 * UNIT TEST: roDAO.getProductsOfInternalOrder()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetProductsOfInternalOrder_MOCK(testName, ID, expectedResult) {
    test(testName, async () => {   
        try {
            const result = await ioDAO.getProductsOfInternalOrder(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}
