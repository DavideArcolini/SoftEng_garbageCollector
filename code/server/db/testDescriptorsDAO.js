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

 class TestDescriptorDAO {
 
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

    /**
      * Retrieves the TestDescriptors 
      * ------------------------------------------------------------------------
      * @returns an Array object containing all TestDescriptors 
    */

     getTestDescriptors= async () => {
        const querySQL = "SELECT * FROM TEST_DESCRIPTORS";
        return this.dao.all(
            querySQL,
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }


     /**
      * Retrieves the TestDescriptor with a particular ID
      * ------------------------------------------------------------------------
      * @returns an object with the same id
    */
      getTestDescriptorById = async (id) => {
        const querySQL = "SELECT * FROM TEST_DESCRIPTORS WHERE id==?";
        return this.dao.get(
            querySQL,
            [
                id
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }



      /**
      * Insert testDescriptorObject into DB
      * ------------------------------------------------------------------------
      * @returns nothing
    */
        createTestDescriptor  = async (testDescriptorObject) => {
        const querySQL = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)";
        return this.dao.run(
            querySQL,
            [
                testDescriptorObject.name,
                testDescriptorObject.procedureDescription,
                testDescriptorObject.idSKU
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }




    /**
      * Update testDescriptorObject in DB
      * ------------------------------------------------------------------------
      * @returns nothing 
      *          
    */
    modifyTestDescriptor  = async (id,testDescriptorObject) => {
    const querySQL = "UPDATE TEST_DESCRIPTORS SET name=?, procedureDescription=?, idSKU=?  WHERE id==?";
    return this.dao.run(
        querySQL,
        [
            testDescriptorObject.newName,
            testDescriptorObject.newProcedureDescription,
            testDescriptorObject.newIdSKU,
            id
        ]
    ).then((result) => {
        return result;
    }).catch((error) => {
        throw new Error(error.message);
    });
}




    /**
      * Delete testDescriptorObject in DB
      * ------------------------------------------------------------------------
      * @returns nothing 
      *          
    */
     deleteTestDescriptor  = async (id) => {
        const querySQL = "DELETE FROM TEST_DESCRIPTORS WHERE id==?";
        return this.dao.run(
            querySQL,
            [
                id
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }






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
 
 module.exports = TestDescriptorDAO;