/**
 *  EXPORTING UTILITIES FUNCTIONS FROM positionDAO.
 *  ===============================================
 *  These functions behavior will be mocked in 
 *      - mockSKUController.test.js
 *      - mockPositionController.test.js
 * 
*/

exports.getSKUs             = jest.fn();
exports.getSKUByID          = jest.fn();
exports.getSKUByPositionID  = jest.fn();
exports.newSKU              = jest.fn();
exports.updateSKU           = jest.fn();
exports.updateSKUpositionID = jest.fn();
exports.deleteSKU           = jest.fn();