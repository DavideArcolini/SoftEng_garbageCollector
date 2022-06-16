/**
 *  EXPORTING UTILITIES FUNCTIONS FROM positionDAO.
 *  ===============================================
 *  These functions behavior will be mocked in 
 *  mockPositionController.test.js
 * 
*/
exports.getItems =jest.fn();
exports.getItemById  = jest.fn();
exports.createItem    =jest.fn();
exports.modifyItem  =jest.fn();
exports.deleteItem   =jest.fn();
exports. getItemBySupSKUID =jest.fn();
exports. getItemBySupId =jest.fn();