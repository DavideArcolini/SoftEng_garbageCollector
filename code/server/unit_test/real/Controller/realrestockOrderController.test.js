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
const ROController          = new RestockOrderController(testDAO)

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
        itemId: 11,
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
        itemId: 11,
        description: 'another product',
        price: 11.99,
        qty: 2
      },
]
const skuItems = [
    { SKUId: 12, itemId: 10, RFID: '00000000000000000000000000000001' } ,
    { SKUId: 180, itemId: 11, RFID: '00000000000000000000000000000002' } 

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

const restockOrdersResult = [
    {
        id: 1,
        issueDate: '2021/11/29 09:33',
        state: 'ISSUED',
        supplierId: 1,
        products: [
          { SKUId: 12, itemId : 1, description: 'a product', price: 10.99, qty: 3 }
        ],
        skuItems: []
    },
    {
        id: 2,
        issueDate: '2022/5/12 17:44',
        state: 'COMPLETEDRETURN',
        supplierId: 1,
        products: [
          { SKUId: 180, itemId : 1, description: 'another product', price: 11.99, qty: 2 }
        ],
        transportNote:{deliveryDate: '2022/07/12 17:44'},
        skuItems: [ { SKUId: 1, itemId : 1, RFID: '00000000000000000000000000000001' },
                    { SKUId: 1, itemId : 1, RFID: '00000000000000000000000000000002' } ]
    }


]

/**
 * INTEGRATION TEST: ROController.getRestockOrders()
 * ========================================================================
 */

describe('[REAL] INTEGRATION TEST: ROController.getRestockOrders', () =>{
    beforeAll(async() => {
        await ROController.createRestockOrder(reqBody.issueDate,reqBody.supplierId,reqBody.products);
    })

    testGetRestockOrders_REAL("get ROs", [restockOrdersResult[0]])

    afterAll(async () => {
        const querySQL = "DELETE FROM RESTOCK_ORDERS";
        await testDAO.run(querySQL);
    });

})

/**
 * INTEGRATION TEST: ROController.createRestocklOrder
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: ROController.createRestockOrder', () => {
    

    /**
     * ---------------------------------{ code:200,
        message: {...reqBody, id:1}}
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
     testCreateRestockOrder_REAL(
        '- Success: ',
        reqBody,
        MESSG_201
    );

    testCreateRestockOrder_REAL('error', undefined, Error)

  
    afterAll(async () => {
        const querySQL = "DELETE FROM RESTOCK_ORDERS";
        await testDAO.run(querySQL);
    });
});



describe("get RO by ID", () => {
    beforeAll(async() => {
        await ROController.createRestockOrder(reqBody.issueDate,reqBody.supplierId,reqBody.products);
    })
    testGetRestockOrdersById("not found", {id:40}, {code: 404, message: 'Not Found'})
    testGetRestockOrdersById("get ro by id", {id:1}, { 
        code:200,
        message: {
            id:1,
            issueDate:"2021/11/29 09:33",
            state:"ISSUED",
            supplierId:1,
            products: [
                {SKUId:12,description:10,price:10.99,qty:1}],skuItems:[]}})
    //testGetRestockOrdersById("get ro by id", {id:2}, )

    afterAll(async () => {
        const querySQL = "DELETE FROM RESTOCK_ORDERS";
        await testDAO.run(querySQL);
    });
})

/**
 * INTEGRATION TEST: ROController.getRestockOrdersById()
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */

function testGetRestockOrdersById(testName, body, expectedResult) {
    test(testName, async() => {
        try {
            const result = await ROController.getRestockOrderById(body.id);
            console.log(JSON.stringify(result))
            expect(result).toEqual(expectedResult)
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
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
            expect(error).toBeInstanceOf(expectedResult);
        }
 
    })
}
/**
 * INTEGRATION TEST: ROController.getRestockOrders
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetRestockOrders_REAL(testName, expectedResult) {
    test(testName, async () => {
        try {
            const result = await ROController.getRestockOrders()
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    }); 
}

/**
 * INTEGRATION TEST: IOController.getRestockOrdersIssued
 * ========================================================================
 */
 describe('[REAL] INTEGRATION TEST: ROController.getRestockOrdersIssued', () => {
    beforeAll(async()=>{
       
        await roDAO.createRestockOrder(reqBody.issueDate,reqBody.supplierId,reqBody.products)
        await roDAO.createRestockOrder(reqBody.issueDate,reqBody.supplierId,reqBody.products)

    })



    /**
     * ---------------------------------
     *    INTEGRATION TEST: SUCCESS
     * ---------------------------------
     */
    testGetRestockOrdersIssued_REAL(
        '- Success: ',
        [restockOrdersResult[0]]
    );


  
    afterAll(async () => {
       const querySQL = "DELETE FROM RESTOCK_ORDERS";
        await testDAO.run(querySQL);
    });
});

/**
 * INTEGRATION TEST: IOController.deleteRestockOrder
 * ========================================================================
 */

describe('delete restock order', () => {
    beforeAll(async() => {
        await roDAO.createRestockOrder(reqBody.issueDate,reqBody.supplierId,reqBody.products)
    })

    testDeleteRestockOrder_REAL("error", undefined, Error)
    testDeleteRestockOrder_REAL("deleted successfully", 1, MESSG_204)
})

/**
 * INTEGRATION TEST: ROController.getRestockOrders
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
function testGetRestockOrdersIssued_REAL(testName, expectedResult) {
    test(testName, async () => {
        try {
            const result = await ROController.getRestockOrdersIssued()
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    })
}

describe('get return items', () => {
    beforeAll(async() => {
        await roDAO.createRestockOrder(reqBody.issueDate,reqBody.supplierId,reqBody.products)

        sql = "INSERT INTO test_results(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
        await testDAO.run(sql,[skuItems[0].RFID,14,"2021/11/28",false]);

        //  Create restock order for 200 ok
        await roDAO.createRestockOrder(reqBody.issueDate,reqBody.supplierId,reqBody.products);
        await testDAO.run(`
            UPDATE restock_orders
            SET state=(?)
            WHERE id=2
        `, "COMPLETEDRETURN")
        await ROController.setSkuItems(2, skuItems)
        await testDAO.run(`
            UPDATE restock_orders
            SET RFID=(?)
            WHERE id=2
        `, skuItems[0].RFID)
    })

    testGetReturnItems_REAL("not found", 40, ERROR_404)
    testGetReturnItems_REAL("throws 422", 1, ERROR_422)
    testGetReturnItems_REAL("ok", 2, {code: 200, message: [
        {
            "SKUId": 12,
            "RFID": "00000000000000000000000000000001",
            "itemId": 10
        },
        {
            "SKUId": 12,
            "RFID": "00000000000000000000000000000001",
            "itemId": 10
        },
        {
            "SKUId": 12,
            "RFID": "00000000000000000000000000000001",
            "itemId": 10
        },
        {
            "SKUId": 180,
            "RFID": "00000000000000000000000000000001",
            "itemId": 11
        },
        {
            "SKUId": 180,
            "RFID": "00000000000000000000000000000001",
            "itemId": 11
        }
    ]})


    afterAll(async () => {
        const querySQL = "DELETE FROM RESTOCK_ORDERS";
         await testDAO.run(querySQL);
         await testDAO.run(`DELETE FROM test_results`)
     });
})

/**
 * INTEGRATION TEST: ROController.getReturnItems
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testGetReturnItems_REAL(testName, id, expectedResult) {
    test(testName, async () => {
        try {
            const result = await ROController.getReturnItems(id)
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    })
}

/**
 * INTEGRATION TEST: ROController.deleteRestockOrder
 * ========================================================================
 * @param {Object} expectedResult Either error or an object returned by the function
 */
 function testDeleteRestockOrder_REAL(testName, id, expectedResult) {
    test(testName, async () => {
        try {
            const result = await ROController.deleteRestockOrder(id)
            expect(result).toEqual(expectedResult);
        } catch (error) {
            expect(error).toBeInstanceOf(expectedResult);
        }
    })
}

