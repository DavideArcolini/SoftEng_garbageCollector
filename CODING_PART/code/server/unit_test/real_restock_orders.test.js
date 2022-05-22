const dao = require("./mockDB/mock_dao");
const ROController = require("../controller/RestockOrderController");
const RO = new ROController(dao);


/**
 * API:
 *         GET /api/restockOrders/:id
 * =================================================
 */
function getRestockOrderById(req,expected){
    describe('get restok order by id',()=>{
      
      beforeEach(async() => {
        await RO.createRestockOrder('2022/5/12 17:44',7, [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ])
      })

    test('get restock order by id',async()=>{
        let res = await RO.getRestockOrderById(req);
        expect(res).toEqual(expected);
    })
  });
}

getRestockOrderById(1,{
    id: 1,
    issueDate: '2022/5/12 17:44',
    state: 'ISSUED',
    supplierId: 7,
    products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
    skuItems: []
  });
/*describe('get restock order by id', () => {
    beforeEach( () => {
        dao.all.mockReset();
        dao.all.mockReturnValueOnce([
            {
              id: 2,
              issueDate: '2022/5/12 17:44',
              state: 'COMPLETEDRETURN',
              supplierId: 7,
              SKUId: 1,
              description: null,
              price: 0.01,
              deliveryDate: '2022/5/12 17:46',
              qty: 1,
              RFID: '00000000000000000000000000000001'
            }
          ]).mockReturnValueOnce([
            {
               
                SKUId: 1,
                RFID: '00000000000000000000000000000001'
              }
          ]).mockReturnValueOnce([
            {
              id: 33,
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
              id: 33,
              issueDate: '2021/11/29 09:33',
              state: 'ISSUED',
              supplierId: 1,
              SKUId: 180,
              description: 'another product',
              price: 11.99,
              deliveryDate: null,
              qty: 2
            }
          ]).mockReturnValueOnce([])
    })

    
    test('get restock order by id', async() => {
        let res = await RO.getRestockOrderById(2);
        console.log(res)
        expect(res).toEqual({
            id: 2,
            issueDate: '2022/5/12 17:44',
            state: 'COMPLETEDRETURN',
            supplierId: 7,
            transportNote: { deliveryDate: '2022/5/12 17:46' },
            products: [ { SKUId: 1, description: null, price: 0.01, qty: 1 } ],
            skuItems: [ { SKUId: 1, RFID: '00000000000000000000000000000001' } ]
          });
        res = await RO.getRestockOrderById(33);
        console.log(res)
        expect(res).toEqual({
            id: 33,
            issueDate: '2021/11/29 09:33',
            state: 'ISSUED',
            supplierId: 1,
            products: [
              { SKUId: 12, description: 'a product', price: 10.99, qty: 3 },
              {
                SKUId: 180,
                description: 'another product',
                price: 11.99,
                qty: 2
              }
            ],
            skuItems: []
          });
    })
    
});*/
