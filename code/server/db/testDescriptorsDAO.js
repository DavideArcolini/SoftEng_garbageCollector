/**
 *                         DAO: TestDescriptorsDAO
 * =====================================================================
 * Data Access Objects (DAOs) are used by controllers in order to access
 * the database in a more structural and modular fashion. 
 * ---------------------------------------------------------------------
 * In particular, TestDescriptorsDAO is the DAO of the class 
 * TestDescriptorController.
 * It has a constructor, which creates the TestDescriptorsDAO object 
 * starting from a general purpose DAO, which implements the functions:
 *      - run() to execute a query without results returned
 *      - get() to execute a query with a single result returned
 *      - all() to execute a query with an array of results returned.
 */

 'use strict'

 class TestDescriptorsDAO {
 
     /**
      * CONSTRUCTOR: TestDescriptorsDAO
      * ---------------------------------
      * @param {Object} generalPurposeDAO 
      */
      constructor (generalPurposeDAO) {
         this.dao = generalPurposeDAO;
     }
 
     /*
         + -------------------- +
         |        METHODS       |
         + -------------------- +
     */
     
     /**
      * Retrieves the TestDescriptors ID of a particular SKU identified by SKUid
      * ------------------------------------------------------------------------
      * @returns an Array object containing all TestDescriptors ID associated to 
      *          a specific SKUid.
      */
    getTDIDbySKUid = async (SKUid) => {
        const querySQL = "SELECT TD.id FROM TEST_DESCRIPTORS TD WHERE TD.idSKU == ?";
        return this.dao.all(
            querySQL,
            [
                SKUid
            ]
        ).then((result) => {
            let resultArray = []
            result.map((item) => {
                resultArray.push(item.id);
            });
            return resultArray;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }
 
 }
 
 module.exports = TestDescriptorsDAO;