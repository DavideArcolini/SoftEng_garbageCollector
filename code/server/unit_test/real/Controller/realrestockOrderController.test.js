/**
 *  INTEGRATION TEST: restockOrderController
 *           VERSION: real
 * --------------------------------------------
 * Services do access the database (although it
 * is a test database).
*/

/* --------- IMPORT MODULES --------- */
const RestockOrderController         = require('../../../controller/RestockOrderController');
const RestockOrderDAO     = require('../../../db/RestockOrderDAO');
const TestDAO              = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const testDAO               = new TestDAO();
const roDAO                 = new RestockOrderDAO(testDAO);
const ROController          = new RestockOrderController(roDAO)

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
        issueDate: '2021/11/29 09:33',
        state: 'COMPLEDRETURN',
        supplierId: 1,
        SKUId: 180,
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
        itemId: 10,
        description: 'a product',
        price: 10.99,
        qty: 3
      },
      {

        id: 1,
        SKUId: 180,
        itemId: 18,
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
/**
 * INTEGRATION TEST: IOController.createInternalOrder
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: ROController.createRestockOrder', () => {
    

    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testCreateRestockOrder_REAL(
        '- Success: ',
        reqBody,
        {
            code: 201
        }
    );


  
    afterAll(async () => {
        const querySQL = "DELETE FROM RESTOCK_ORDERS";
        await testDAO.run(querySQL);
    });
});

describe("get RO by ID", () => {
    beforeAll(async() => {
        
    })
})

/**
 * INTEGRATION TEST: ROController.getRestockOrdersById()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */

function testGetRestockOrdersById(testName, body, expectedResult) {
    test(testName, async() => {
        try {
            const result = await ROController.testGetRestockOrdersById(body.id);
            expect(result).toEqual(expectedResult)
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    })
}

/**
 * INTEGRATION TEST: ROController.createRestockOrder
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testCreateRestockOrder_REAL(testName, body, expectedResult) {
    test(testName, async () => {
        try {
            const result = await ROController.createRestockOrder(body.issueDate,body.supplierId,body.products)
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}