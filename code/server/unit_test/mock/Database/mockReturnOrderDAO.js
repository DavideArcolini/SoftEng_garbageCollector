/**
 *  EXPORTING UTILITIES FUNCTIONS FROM returnOrderDAO.
 *  ===============================================
 *  These functions behavior will be mocked in 
 *      - mockSKUController.test.js
 *      - mockPositionController.test.js
 * 
*/

exports.getSkuItemsOfReturnOrder           = jest.fn();
exports.getReturnOrders                    = jest.fn();
exports.getReturnOrderById                 = jest.fn();
exports.createReturnOrder                  = jest.fn();
exports.deleteReturnOrder                  = jest.fn();
exports.getRestockOrderById                = jest.fn();
