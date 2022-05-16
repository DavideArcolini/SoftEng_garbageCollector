"use strict";

class TestResultController {
    constructor(daotr) {
        this.daotr = daotr
    }



    
    getTestResults = async (req, res) =>{

        //Search on DB
        const sql = "SELECT * FROM TEST_RESULTS WHERE rfid==?";
        const result = await this.daotr.all(sql,req.params.rfid,(error, rows) => {
            if (error) {
                return response.status(500).json(ERROR_500);
            }});
        
        return res.status(200).json(result);
    }



    getTestResultById = async (req, res) => {

        //Validation
        if(/^[0-9]+$/.test(req.params.id)===false ){
            return res.status(422).json();
        }

        //Find the RFID
        const sql = "SELECT * FROM TEST_RESULTS WHERE rfid==? "
        const testarray = await this.daotr.all(sql,req.params.rfid,(error, rows) => {
            if (error) {
                return response.status(500).json(ERROR_500);
            }});

        //RFID doesn't exist
        if(testarray[0]==undefined){
            return res.status(404).json();
        }

        //Search the ID
        const result=testarray.filter((test)=>(test.id==req.params.id));

        //ID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json();
        }

        //Deliver json file 
        return res.status(200).json(result);
    }



    createTestResult = async (req, res) => {
        
        //Validation
        if ( /^[0-9]+$/.test(req.body.idTestDescriptor)===false ) {
            return res.status(422).json();           
          }
        
        //Control of RFID
        let sql ="SELECT * FROM SKUITEMS WHERE RFID==?"
        let result = await this.daotr.all(sql,req.body.rfid,(error, rows) => {
            if (error) {
                return response.status(503).json(ERROR_503);
            }});

        //RFID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json();
        }

        //Control of idtest
        sql ="SELECT * FROM TEST_DESCRIPTORS WHERE id==?"
        result = await this.daotr.all(sql,req.body.idTestDescriptor,(error, rows) => {
            if (error) {
                return response.status(503).json(ERROR_503);
            }});

        //idTest doesn't exist
        if(result[0]==undefined){
            return res.status(404).json();
        }

        //Database immission
        sql = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
        await this.daotr.run(sql,[req.body.rfid, req.body.idTestDescriptor, req.body.Date, req.body.Result],(error, rows) => {
            if (error) {
                return response.status(503).json(ERROR_503);
            }});

        return res.status(201).json();

    }



    modifyTestResult = async(req,res) => {

        //Validation
        if(/^[0-9]+$/.test(req.params.id)===false || req.body.newIdTestDescriptor===undefined || req.body.newDate===undefined || req.body.newResult===undefined){
            return res.status(422).json();
        }

        //Control of RFID
        let sql ="SELECT * FROM SKUITEMS WHERE RFID==?"
        let result = await this.daotr.all(sql,req.body.rfid,(error, rows) => {
            if (error) {
                return response.status(503).json(ERROR_503);
            }});

        //RFID doesn't exist (it isn't created)
        if(result[0]==undefined){
            return res.status(404).json();
        }

        //Control of idtest
        sql ="SELECT * FROM TEST_DESCRIPTORS WHERE id==?"
        result = await this.daotr.all(sql,req.body.newIdTestDescriptor,(error, rows) => {
            if (error) {
                return response.status(503).json(ERROR_503);
            }});

        //idTest doesn't exist
        if(result[0]==undefined){
            return res.status(404).json();
        }
 
        //Find the RFID
        sql = "SELECT * FROM TEST_RESULTS WHERE rfid==? "
        const testarray = await this.daotr.all(sql,req.params.rfid,(error, rows) => {
            if (error) {
                return response.status(503).json(ERROR_503);
            }});

        //RFID doesn't exist (don't have a test result)
        if(testarray[0]==undefined){
            return res.status(404).json();
        }

        //Search the ID
        result=testarray.filter((test)=>(test.id==req.params.id));

        //ID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json();
        }

        //Update the object if found
        sql = "UPDATE TEST_RESULTS SET IdtestDescriptor=?, Date=?, Result=?  WHERE id==?";
        result = await this.daotr.run(sql,[req.body.newIdTestDescriptor, req.body.newDate, req.body.newResult, req.params.id],(error, rows) => {
            if (error) {
                return response.status(503).json(ERROR_503);
            }});
        return res.status(200).json();
}



    deleteTestResult = async (req, res) => {

        //Validation
        if(/^[0-9]+$/.test(req.params.id)===false){
            return res.status(422).json();
        }

        //Find the RFID
        let sql = "SELECT * FROM TEST_RESULTS WHERE rfid==? "
        const testarray = await this.daotr.all(sql,req.params.rfid,(error, rows) => {
            if (error) {
                return response.status(503).json(ERROR_503);
            }});

        //RFID doesn't exist
        if(testarray[0]==undefined){
            return res.status(404).json();
        }

        //search the ID
        let result=testarray.filter((test)=>(test.id==req.params.id));

        //ID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json();
        }

        sql = "DELETE FROM TEST_RESULTS WHERE rfid==? AND id==?";
        result = await this.daotr.run(sql,[req.params.rfid, req.params.id],(error, rows) => {
            if (error) {
                return response.status(503).json(ERROR_503);
            }});
        return res.status(204).json();
    }
  

}

module.exports = TestResultController;
