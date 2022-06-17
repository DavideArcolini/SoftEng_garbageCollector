/**
 *  EXPORTING UTILITIES FUNCTIONS FROM internalOrderDAO.
 *  ===============================================
 *  These functions behavior will be mocked in 
 *      - mockInternalController.test.js
 *      
 * 
*/

exports.getProductsOfInternalOrder           = jest.fn();
exports.getSkuItemsOfInternalOrder           = jest.fn();
exports.getInternalOrders                    = jest.fn();
exports.getInternalOrdersIssued              = jest.fn();
exports.getInternalOrdersAccepted            = jest.fn();
exports.getInternalOrderById                 = jest.fn();
exports.modifyInternalOrderState             = jest.fn();
exports.setSkuItems                          = jest.fn();
exports.deleteInternalOrder                  = jest.fn();
exports.createInternalOrder                  = jest.fn();
