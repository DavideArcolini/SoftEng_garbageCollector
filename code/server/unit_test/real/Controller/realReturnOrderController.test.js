/**
 *  INTEGRATION TEST: returnOrderController
 *           VERSION: real
 * --------------------------------------------
 * Services do access the database (although it
 * is a test database).
*/

/* --------- IMPORT MODULES --------- */
const ReturnOrderController         = require('../../../controller/ReturnOrderController');
const ReturnOrderDAO                = require('../../../db/ReturnOrderDAO');
const TestDAO                       = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const testDAO               = new TestDAO();
const reoDAO                 = new ReturnOrderDAO(testDAO);
const REOController         = new ReturnOrderController(reoDAO)

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
const returnOrderArray = [
    {
        id: 1,
        returnDate: '2021/11/29 09:33',
        restockOrderId: 1,
        SKUId: 12,
        description: 'a product',
        price: 10.99,
        RFID: '12345678901234567890123456789016'
      },
      {
        id: 2,
        returnDate: '2021/11/29 09:33',
        restockOrderId: 1,
        SKUId: 180,
        description: 'another product',
        price: 11.99,
        RFID: '12345678901234567890123456789038'
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
    products : [{SKUId:12,description:"a product",price:10.99,RFID: '12345678901234567890123456789038'},
                        {SKUId:180,description: "another product",price:11.99,RFID: '12345678901234567890123456789038'}],
    restockOrderId: 1

}

/**
 * INTEGRATION TEST: REOController.createReturnOrder
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: REOController.createReturnOrder', () => {
    

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testCreateReturnOrder_REAL(
        '- Success: ',
        reqBody,
        {
            code: 201
        }
    );


  
    afterAll(async () => {
        const querySQL = "DELETE FROM RETURN_ORDERS";
        await testDAO.run(querySQL);
    });
});

/**
 * INTEGRATION TEST: ROController.createRestockOrder
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testCreateReturnOrder_REAL(testName, body, expectedResult) {
    test(testName, async () => {
        try {
            const result = await REOController.createReturnOrder(body.returnDate,body.restockOrderId,body.products)
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

