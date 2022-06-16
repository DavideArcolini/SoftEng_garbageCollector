/**
 *  UNIT TEST: RestockOrderDAO
 */

/* --------- IMPORT MODULES --------- */
const RestockOrderDAO    = require('../../../db/RestockOrderDAO');
const mockDAO   = require('../Database/mockDAO');

/* --------- INITIALIZATION --------- */
const roDAO = new RestockOrderDAO(mockDAO);


/*
    + -------------------- +
    |         DATA         |
    + -------------------- +
*/

const restockOrderArray = [
    {
        id: 1,
        issueDate: '2021/11/29 09:33',
        state: 'ISSUED',
        supplierId: 1,
        SKUId: 12,
        itemId: 10,
        description: 'a product',
        price: 10.99,
        deliveryDate: null,
        qty: 3
      },
      {
        id: 2,
        issueDate: '2021/11/29 09:33',
        state: 'COMPLEDRETURN',
        supplierId: 1,
        SKUId: 180,
        itemId: 18,
        description: 'another product',
        price: 11.99,
        deliveryDate: null,
        qty: 2
      },
]

const restockOrderProducts = [
    {
        id: 1,
        SKUId: 12,
        itemId:10,
        description: 'a product',
        price: 10.99,
        qty: 3
      },
      {

        id: 1,
        SKUId: 180,
        itemId:18,
        description: 'another product',
        price: 11.99,
        qty: 2
      },
]

const skuItems = [
    { SKUId: 1, itemId: 10, RFID: '00000000000000000000000000000001' } ,
    { SKUId: 1, itemId: 10, RFID: '00000000000000000000000000000002' } 

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
/*
    + -------------------- +
    |         TESTS        |
    + -------------------- +
*/
/**
 * UNIT TEST: roDAO.getRestockOrderByID(id)
 * ========================================================================
 */
 describe('UNIT TEST: restockOrderDAO.getRestockOrderByID(id)', () => {
    beforeAll(() => {
        roDAO.dao.all.mockReset();
        roDAO.dao.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(new Array(restockOrderArray[0]));
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
  testGetRestockOrderID_MOCK(
    '- Success: ', 
    1,
    new Array(restockOrderArray[0])
);

   /**
     * ---------------------------------
     *      UNIT TEST: EMPTY RESULT
     * ---------------------------------
     */
    testGetRestockOrderID_MOCK(
        '- Success (empty): ', 
        999999,
        []
    );


    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testGetRestockOrderID_MOCK(
        '- Database error: ', 
        1,
        Error
    );
    
});
/**
 * UNIT TEST: roDAO.getRestockOrderByID(id)
 * ========================================================================
 * @param {String} testName Description of the test executed
 * @param {Number} ID identifier of the target restock order
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetRestockOrderID_MOCK(testName, ID, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await roDAO.getRestockOrderById(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}


/**
 * UNIT TEST: roDAO.getRestockOrders()
 * ========================================================================
 */
 describe('UNIT TEST: roDAO.getRestockOrders()', () => {
    beforeAll(() => {
        roDAO.dao.all.mockReset();
        roDAO.dao.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(restockOrderArray);
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
     testGetRestockOrders_MOCK('- Success: ', restockOrderArray);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
    testGetRestockOrders_MOCK('- Database error: ', Error);
    
});

/**
 * UNIT TEST: roDAO.getRestockOrders()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetRestockOrders_MOCK(testName, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await roDAO.getRestockOrders();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * UNIT TEST: roDAO.getProductsOfRestockOrder()
 * ========================================================================
 */
 describe('UNIT TEST: roDAO.getProductsOfRestockOrder', () => {
    beforeAll(() => {
        roDAO.dao.all.mockReset();
        roDAO.dao.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(restockOrderProducts);
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
 
    testGetProductsOfRestockOrder_MOCK('- Success: ',
        1,
        products
       );
    /**
     * ---------------------------------
     *      UNIT TEST: EMPTY
     * ---------------------------------
     */
     testGetProductsOfRestockOrder_MOCK('- Success: ',
     999999,
     []);
    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testGetProductsOfRestockOrder_MOCK('- Database error: ', 
        1,
        Error);
    
});

/**
 * UNIT TEST: roDAO.getProductsOfRestockOrder()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetProductsOfRestockOrder_MOCK(testName, ID, expectedResult) {
    test(testName, async () => {   
        try {
            const result = await roDAO.getProductsOfRestockOrder(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * UNIT TEST: roDAO.getSkuItemsOfRestockOrder()
 * ========================================================================
 */
 describe('UNIT TEST: roDAO.getSkuItemsOfRestockOrder', () => {
    beforeAll(() => {
        roDAO.dao.all.mockReset();
        roDAO.dao.all.mockImplementationOnce(() => {
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

    testGetSkuItemsOfRestockOrder_MOCK('- Success: ',
        1,
       skuItems
       );
    /**
     * ---------------------------------
     *      UNIT TEST: EMPTY
     * ---------------------------------
     */
     testGetSkuItemsOfRestockOrder_MOCK('- Success: ',
     999999,
     []);
    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testGetSkuItemsOfRestockOrder_MOCK('- Database error: ', 
        1,
        Error);
    
});

/**
 * UNIT TEST: roDAO.getSkuItemsOfRestockOrder()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetSkuItemsOfRestockOrder_MOCK(testName, ID, expectedResult) {
    test(testName, async () => {   
        try {
            const result = await roDAO.getSkuItemsOfRestockOrder(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * UNIT TEST: roDAO.createRestockOrder()
 * ========================================================================
 */
 describe('UNIT TEST: roDAO.createRestockOrder()', () => {
    beforeAll(() => {
        roDAO.dao.run.mockReset();
        roDAO.dao.run.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve(1);
            });
        })
        roDAO.dao.get.mockReset();
        roDAO.dao.get.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve({id: 1});
            })
        }).mockImplementationOnce(()=>{
            return new Promise((res, rej) => {rej(error)})
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
     testCreateRestockOrder_MOCK('- Success: ', reqBody, 2);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
    testCreateRestockOrder_MOCK('- Database error: ', reqBody, Error);
    
    /**
     * ---------------------------------
     *      UNIT TEST: TABLE EMPTY
     * ---------------------------------
     */
     testCreateRestockOrder_MOCK('- table empty: ', reqBody, 1);

});


/**
 * UNIT TEST: roDAO.createRestockOrder()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testCreateRestockOrder_MOCK(testName, reqBody, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await roDAO.createRestockOrder(reqBody.issueDate, reqBody.supplierId,reqBody.products);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    }); 
}

/**
 * UNIT TEST: roDAO.modifyRestockOrderState()
 * ========================================================================
 */
 describe('UNIT TEST: roDAO.modifyRestockOrderState()', () => {
    beforeAll(() => {
        roDAO.dao.run.mockReset();
        roDAO.dao.run.mockImplementationOnce(() => {
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
     testModifyRestockOrderState_MOCK('- Success: ', 1, "DELIVERY", 1);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testModifyRestockOrderState_MOCK('- Database error: ', 1, "DELIVERY", Error);


});


/**
 * UNIT TEST: roDAO.modifyRestockOrderState()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testModifyRestockOrderState_MOCK(testName, ID, newState, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await roDAO.modifyRestockOrderState(ID,newState);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * UNIT TEST: roDAO.setSkuItems()
 * ========================================================================
 */
 describe('UNIT TEST: roDAO.setSkuItems()', () => {
    beforeAll(() => {
        roDAO.dao.get.mockReset();
        roDAO.dao.get.mockImplementation(()=>{
            return new Promise((resolve, reject) => {
                resolve({min_id: 1});
            })
        })
        roDAO.dao.run.mockReset();
        roDAO.dao.run.mockImplementationOnce(() => {
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
            const result = await roDAO.setSkuItems(ID,skuItems);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * UNIT TEST: roDAO.addTransportNote()
 * ========================================================================
 */
 describe('UNIT TEST: roDAO.addTransportNote()', () => {
    beforeAll(() => {

        roDAO.dao.run.mockReset();
        roDAO.dao.run.mockImplementationOnce(() => {
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
     testAddTransportNote_MOCK('- Success: ',1,transportNote,1);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testAddTransportNote_MOCK('- Database error: ', 1, transportNote, Error);


});


/**
 * UNIT TEST: roDAO.addTransportNote()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testAddTransportNote_MOCK(testName, ID, transportNote, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await roDAO.addTransportNote(ID,transportNote);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * UNIT TEST: roDAO.deleteRestockOrder()
 * ========================================================================
 */
 describe('UNIT TEST: roDAO.deleteRestockOrder()', () => {
    beforeAll(() => {

        roDAO.dao.run.mockReset();
        roDAO.dao.run.mockImplementationOnce(() => {
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
     testDeleteRestockOrder_MOCK('- Success: ',1,transportNote,1);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
     testDeleteRestockOrder_MOCK('- Database error: ', 1, transportNote, Error);


});


/**
 * UNIT TEST: roDAO.deleteRestockOrder()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testDeleteRestockOrder_MOCK(testName, ID, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await roDAO.deleteRestockOrder(ID);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}


/**
 * UNIT TEST: roDAO.getRestockOrdersIssued()
 * ========================================================================
 */
 describe('UNIT TEST: roDAO.getRestockOrdersIssued()', () => {
    beforeAll(() => {
        roDAO.dao.all.mockReset();
        roDAO.dao.all.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                resolve([restockOrderArray[0]]);
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
     testGetRestockOrdersIssued_MOCK('- Success: ', [restockOrderArray[0]]);

    /**
     * ---------------------------------
     *      UNIT TEST: DATABASE ERROR
     * ---------------------------------
     */
    testGetRestockOrdersIssued_MOCK('- Database error: ', Error);
    
});

/**
 * UNIT TEST: roDAO.getRestockOrdersIssued()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetRestockOrdersIssued_MOCK(testName, expectedResult) {
    test(testName, async () => {
       
        try {
            const result = await roDAO.getRestockOrdersIssued();
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}
