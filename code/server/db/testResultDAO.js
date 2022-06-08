/**
 *                         DAO: TestResultDAO
 * =====================================================================
 * Data Access Objects (DAOs) are used by controllers in order to access
 * the database in a more structural and modular fashion. 
 * ---------------------------------------------------------------------
 * In particular, TestResultDAO is the DAO of the class 
 * TestResultController.
 * It has a constructor, which creates the TestResultDAO object 
 * starting from a general purpose DAO, which implements the functions:
 *      - run() to execute a query without results returned
 *      - get() to execute a query with a single result returned
 *      - all() to execute a query with an array of results returned.
 */

 'use strict'

 class TestResultDAO {
 
     /**
      * CONSTRUCTOR: TestResultDAO
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
      * Retrieves the TestResult 
      * ------------------------------------------------------------------------
      * @returns an Array object containing all TestResult 
    */

     getTestResults= async (rfid) => {
        const querySQL = "SELECT id, idTestDescriptor, Date, Result FROM TEST_RESULTS WHERE rfid==?";
        return this.dao.all(
            querySQL,
            [
                rfid
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }


     /**
      * Retrieves the TestResult with a particular ID
      * ------------------------------------------------------------------------
      * @returns an object with the same id, and it didn't take the rfid
    */
      getTestResultById = async (id,rfid) => {
        const querySQL = "SELECT id, idTestDescriptor, Date, Result FROM TEST_RESULTS WHERE rfid==? AND id==?";
        return this.dao.get(
            querySQL,
            [
                rfid,
                id
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }



      /**
      * Insert testResultObject into DB
      * ------------------------------------------------------------------------
      * @returns nothing
    */
        createTestResult  = async (testResultObject) => {
        const querySQL = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
        return this.dao.run(
            querySQL,
            [
                testResultObject.rfid,
                testResultObject.idTestDescriptor,
                testResultObject.Date,
                testResultObject.Result
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }




    /**
      * Update testResultObject in DB
      * ------------------------------------------------------------------------
      * @returns nothing 
      *          
    */
    modifyTestResult  = async (id,testResultObject) => {
    const querySQL = "UPDATE TEST_RESULTS SET IdtestDescriptor=?, Date=?, Result=?  WHERE id==?";
    return this.dao.run(
        querySQL,
        [
            testResultObject.newIdTestDescriptor,
            testResultObject.newDate,
            testResultObject.newResult,
            id
        ]
    ).then((result) => {
        return result;
    }).catch((error) => {
        throw new Error(error.message);
    });
}




    /**
      * Delete testResultObject in DB
      * ------------------------------------------------------------------------
      * @returns nothing 
      *          
    */
     deleteTestResult  = async (rfid,id) => {
        const querySQL = "DELETE FROM TEST_RESULTS WHERE rfid==? AND id==?";
        return this.dao.run(
            querySQL,
            [
                rfid,
                id
            ]
        ).then((result) => {
            return result;
        }).catch((error) => {
            throw new Error(error.message);
        });
    }

}
 
 module.exports = TestResultDAO;