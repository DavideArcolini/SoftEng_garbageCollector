/**
 *  EXPORTING UTILITIES FUNCTIONS FROM positionDAO.
 *  ===============================================
 *  These functions behavior will be mocked in 
 *  mockPositionController.test.js
 * 
*/
exports.getTestDescriptors =jest.fn();
exports.getTDIDbySKUid = jest.fn();
exports.getTestDescriptorById  =jest.fn();
exports.createTestDescriptor =jest.fn();
exports.modifyTestDescriptor  =jest.fn();
exports.deleteTestDescriptor  =jest.fn();
