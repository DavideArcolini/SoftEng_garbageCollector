/**
 *  EXPORTING UTILITIES FUNCTIONS FROM positionDAO.
 *  ===============================================
 *  These functions behavior will be mocked in 
 *  mockPositionController.test.js
 * 
*/
exports.getTestResults =jest.fn();
exports.getTestResultById  = jest.fn();
exports.createTestResult    =jest.fn();
exports.modifyTestResult  =jest.fn();
exports.deleteTestResult   =jest.fn();
