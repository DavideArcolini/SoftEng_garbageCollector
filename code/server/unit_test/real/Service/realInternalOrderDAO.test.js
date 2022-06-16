/**
 *  UNIT TEST: IODAO
 *    VERSION: real
 * ===========================
 */

/* --------- IMPORT MODULES --------- */
const InternalOrderDAO        = require('../../../db/InternalOrderDAO');
const DAO           = require('../Database/testDAO');

/* --------- INITIALIZATION --------- */
const dao         = new DAO();
const IODAO      = new InternalOrderDAO(dao);

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
 * UNIT TEST: IODAO.getSkuItemsOfInternalOrder()
 * ========================================================================
 */
 describe('UNIT TEST: IODAO.getSkuItemsOfInternalOrder()', () => {
    beforeAll(async () => {

        const querySQL = "INSERT INTO INTERNAL_ORDERS(id, issueDate, state, customerId, SKUId, description, price, RFID ) VALUES(?,?,?,?,?,?,?,?)";
        await dao.run(querySQL,[reqBody.id, reqBody.issueDate,"COMPLETED", reqBody.customerId, reqBody.products[0].SKUId, reqBody.products[0].description, reqBody.products[0].price, skuItems[0]])
       
    });

    /**
     * ---------------------------------
     *      UNIT TEST: SUCCESS
     * ---------------------------------
     */
     testGetSkuItemsOfInternalOrder_REAL(
        '- Success: ', 
        skuItems
    );

    afterAll(async () => {
        
        await dao.deleteAllIO();
    });

});

/**
 * INTEGRATION TEST: IODAO.getSkuItemsOfInternalOrder()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetSkuItemsOfInternalOrder_REAL(testName, expectedResult) {
    test(testName, async () => {
        try {
            const result = await IODAO.getSkuItemsOfInternalOrder(1);
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}