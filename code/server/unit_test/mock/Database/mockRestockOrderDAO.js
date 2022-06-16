/**
 *  EXPORTING UTILITIES FUNCTIONS FROM restockOrderDAO.
 *  ===============================================
 *  These functions behavior will be mocked in 
 *      - mockSKUController.test.js
 *      - mockPositionController.test.js
 * 
*/

exports.getProductsOfRestockOrder           = jest.fn();
exports.getSkuItemsOfRestockOrder           = jest.fn();
exports.getRestockOrders                    = jest.fn();
exports.getRestockOrdersIssued              = jest.fn();
exports.getRestockOrderById                 = jest.fn();
exports.createRestockOrder                  = jest.fn();
exports.modifyRestockOrderState             = jest.fn();
exports.setSkuItems                         = jest.fn();
exports.addTransportNote                    = jest.fn();
exports.deleteRestockOrder                  = jest.fn();
exports.getReturnItems                      = jest.fn();