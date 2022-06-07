/**
 *  EXPORTING UTILITIES FUNCTIONS FROM positionDAO.
 *  ===============================================
 *  These functions behavior will be mocked in 
 *  mockPositionController.test.js
 * 
*/

exports.getPositions                = jest.fn();
exports.getPositionByID             = jest.fn();
exports.newPosition                 = jest.fn();
exports.updatePositionByPositionID  = jest.fn();
exports.updatePositionID            = jest.fn();
exports.updatePositionQuantity      = jest.fn();
exports.removePosition              = jest.fn();