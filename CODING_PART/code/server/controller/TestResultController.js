"use strict";

class TestResultController {
    constructor(daotr) {
        this.daotr = daotr
    }



    
    getTestResults = async (req, res) =>{

        //search on DB
        const sql = "SELECT * FROM TEST_RESULTS WHERE rfid==?";
        const result = await this.daotr.all(sql,req.params.rfid);

        //controllo da cancellare, ma guarda 
        console.log(result.length);
        
        return res.status(200).json(result);
    }



    getTestResultById = async (req, res) => {

        //control id, rfid by function test (already in js)
        if(/^[0-9]+$/.test(req.params.id)===false || /^[0-9]+$/.test(req.params.rfid)===false){
            return res.status(422).json();
        }

        //Find the RFID
        const sql = "SELECT * FROM TEST_RESULTS WHERE rfid==? "
        const testarray = await this.daotr.all(sql,req.params.rfid);

        //RFID doesn't exist
        if(testarray==null){
            return res.status(404).json();
        }

        //search the ID
        const result=testarray.filter((test)=>(test.id==req.params.id));

        //ID doesn't exist
        if(result==null){
            return res.status(404).json();
        }

        //create and deliver json file 
        //result = {id: objectfinded.id, name: objectfinded.name, procedureDescription: objectfinded.procedureDescription, idSKU: objectfinded.idSKU };
        console.log("RESULT : "+ JSON.stringify(result))
        return res.status(200).json(result);
    }



    createTestResult = async (req, res) => {
        
        //control the validation of the input
        if ( req.body.idTestDescriptor===undefined) {
            return res.status(422).json();           
          }
        
        //aggiungere se rfid or idtest non esiste-> errore 404


        //creation id
        let sql = "SELECT MAX(id) as id FROM TEST_RESULTS WHERE rfid==?"
        const max_id = await this.daotr.get(sql,req.body.rfid); 
        let id=1;
        if(max_id.id!==null)
            id = max_id.id+1;

        //database immission
        sql = "INSERT INTO TEST_RESULTS(id, rfid, idTestDescriptor, Date, Result.) VALUES(?,?,?,?,?)";
        await this.daotr.run(sql,[id, req.body.rfid, req.body.idTestDescriptor, req.body.Date, req.body.Result]);

        return res.status(201).json();

    }



    modifyTestResult = async(req,res) => {

        //newIdtestDescriptor, newDate and newResult
        //control id by function test (already in js)
        if(/^[0-9]+$/.test(req.params.id)===false ||/^[0-9]+$/.test(req.params.rfid)===false|| req.body.newIdtestDescriptor===undefined || req.body.newDate===undefined || req.body.newResult===undefined){
            return res.status(422).json();
        }
        
        //Find the RFID
        let sql = "SELECT * FROM TEST_RESULTS WHERE rfid==? "
        const testarray = await this.daotr.all(sql,req.params.rfid);

        //RFID doesn't exist
        if(testarray==null){
            return res.status(404).json();
        }

        //search the ID
        let result=testarray.filter((test)=>(test.id==req.params.id));

        //ID doesn't exist
        if(result==null){
            return res.status(404).json();
        }

        //Update the object if found
        sql = "UPDATE TEST_RESULTS SET IdtestDescriptor=?, Date=?, Result=?  WHERE id==?";
        result = await this.daotr.run(sql,[req.body.newIdtestDescriptor, req.body.newDate, req.body.newResult, req.params.id]);
        return res.status(200).json();
}



    deleteTestResult = async (req, res) => {

        //control id by function test (already in js)
        if(/^[0-9]+$/.test(req.params.id)===false||/^[0-9]+$/.test(req.params.rfid)===false){
            return res.status(422).json();
        }

        //Find the RFID
        let sql = "SELECT * FROM TEST_RESULTS WHERE rfid==? "
        const testarray = await this.daotr.all(sql,req.params.rfid);

        //RFID doesn't exist
        if(testarray==null){
            return res.status(404).json();
        }

        //search the ID
        let result=testarray.filter((test)=>(test.id==req.params.id));

        //ID doesn't exist
        if(result==null){
            return res.status(404).json();
        }

        sql = "DELETE FROM TEST_RESULTS WHERE rfid==? AND id==?";
        result = await this.daotr.run(sql,[req.params.rfid, req.params.id]);
        return res.status(204).json();
    }
  

}

module.exports = TestResultController;