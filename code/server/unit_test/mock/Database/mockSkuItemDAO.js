/**
 *  EXPORTING UTILITIES FUNCTIONS FROM positionDAO.
 *  ===============================================
 *  These functions behavior will be mocked in 
 *  mockPositionController.test.js
 * 
*/

exports.getSKUitems         = jest.fn();
exports.getSKUitemsBySKUid  = jest.fn();
exports.getSKUitemByRFID    = jest.fn();
exports.newSkuItem          = jest.fn();
exports.updateSKUitem       = jest.fn();
exports.deleteSKUitem       = jest.fn();