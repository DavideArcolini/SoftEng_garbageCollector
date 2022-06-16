/**
 *  INTEGRATION TEST: skuController
 *           VERSION: real
 * --------------------------------------------
 * Services do access the database (although it
 * is a test database).
*/

/* --------- IMPORT MODULES --------- */
const InternalOrderController         = require('../../../controller/InternalOrderController');
const InternalOrderDAO     = require('../../../db/InternalOrderDAO');
const TestDAO              = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const testDAO               = new TestDAO();
const ioDAO                 = new InternalOrderDAO(testDAO);
const IOController          = new InternalOrderController(ioDAO);

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

let reqBody = {
    issueDate : "2021/11/29 09:33",
    products : [{SKUId:12,description:"a product",price:10.99,qty:30}],
    customerId : 1
   
}

const internalOrdersResult = [
        {
            id: 1,
            issueDate: '2021/11/29 09:33',
            state: 'ISSUED',
            customerId: 1,
            products: [
                {SKUId:12,description:"a product",price:10.99,qty:30}
            ]
        },
        {
            id: 2,
            issueDate: '2021/11/29 09:33',
            state: 'ISSUED',
            customerId: 1,
            products: [
                {SKUId:12,description:"a product",price:10.99,qty:30}
            ]
        }
    ]



/**
 * INTEGRATION TEST: IOController.createInternalOrder
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: IOController.createInternalOrder', () => {
    

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testCreateInternalOrder_REAL(
        '- Success: ',
        reqBody,
        {
            code: 201
        }
    );


  
    afterAll(async () => {
        const querySQL = "DELETE FROM INTERNAL_ORDERS";
        await testDAO.run(querySQL);
    });
});

/**
 * INTEGRATION TEST: IOController.createInternalOrder
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testCreateInternalOrder_REAL(testName, body, expectedResult) {
    test(testName, async () => {
        try {
            const result = await IOController.createInternalOrder(body.issueDate,body.products,body.customerId);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * INTEGRATION TEST: IOController.getInternalOrders
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: IOController.getInternalOrders', () => {
    
    beforeAll(async()=>{
        await IOController.createInternalOrder(reqBody.issueDate,reqBody.products,reqBody.customerId);
        await IOController.createInternalOrder(reqBody.issueDate,reqBody.products,reqBody.customerId);
    })

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testGetInternalOrders_REAL(
        '- Success: ',
        internalOrdersResult
    );


  
    afterAll(async () => {
        const querySQL = "DELETE FROM INTERNAL_ORDERS";
        await testDAO.run(querySQL);
    });
});

/**
 * INTEGRATION TEST: IOController.createInternalOrder
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetInternalOrders_REAL(testName, expectedResult) {
    test(testName, async () => {
        try {
            const result = await IOController.getInternalOrders(expectedResult);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}