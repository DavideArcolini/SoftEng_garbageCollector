"use strict";

class TestResultController {
    constructor(daotr) {
        this.daotr = daotr
    }

 
    getTestResults = async (req) =>{

        try{

            //Find the RFID
            let sql = "SELECT * FROM SKUITEMS WHERE RFID==?"
            const existrfid = await this.daotr.get(sql,req.rfid);

            //RFID doesn't exist
            if(existrfid==undefined){
                return 404;
            }

            //Search on DB
            sql = "SELECT id, idTestDescriptor, Date, Result FROM TEST_RESULTS WHERE rfid==?";
            let result = await this.daotr.all(sql,req.rfid);

            //If empty return empty otherwisechange result 
            if(result[0]==undefined){
                return result;
            }else{
                result.map((object)=>{object.Result==0 ? object.Result=false :object.Result=true})
                return result;
            }

        }catch(error){
            return 500;
        }
    }


    getTestResultById = async (req) => {

        try{
            //Find the RFID
            let sql = "SELECT * FROM SKUITEMS WHERE RFID==?"
            const testarray = await this.daotr.all(sql,req.rfid);

            //RFID doesn't exist
            if(testarray[0]==undefined){
                return 404;
            }

            //Search the ID
            sql = "SELECT id, idTestDescriptor, Date, Result FROM TEST_RESULTS WHERE rfid==? AND id==?";
            let result = await this.daotr.get(sql,[req.rfid,req.id]);

            //ID doesn't exist
            if(result==undefined){
                return 404;
            }

            //Deliver json file 
            result.Result==0 ? result.Result=false : result.Result=true;
            return result;

        }catch(error){
            return 500
        }
    }



    createTestResult = async (req) => {
        
        try{
             //Control of RFID
            let sql ="SELECT * FROM SKUITEMS WHERE RFID==?"
            let result = await this.daotr.get(sql,req.rfid);

            //RFID doesn't exist
            if(result==undefined){
                return 404;
            }

            //Control of idtest
            sql ="SELECT * FROM TEST_DESCRIPTORS WHERE id==?"
            result = await this.daotr.get(sql,[req.idTestDescriptor]);

            //idTest doesn't exist
            if (result== undefined){
                return 404;
            }

            //Database immission
            sql = "INSERT INTO TEST_RESULTS(rfid, idTestDescriptor, Date, Result) VALUES(?,?,?,?)";
            await this.daotr.run(sql,[req.rfid, req.idTestDescriptor, req.Date, req.Result]);

            return 201;
            }catch(error){
                return 503;
            }
    }



    modifyTestResult = async(req1,req2) => {

        try{
            //Control of RFID
            let sql ="SELECT * FROM SKUITEMS WHERE RFID==?"
            let result = await this.daotr.get(sql,req1.rfid);

            //RFID doesn't exist in general
            if(result==undefined){
                return 404;
            }

            //Control of idtest
            sql ="SELECT * FROM TEST_DESCRIPTORS WHERE id==?"
            result = await this.daotr.get(sql,req2.newIdTestDescriptor);

            //idTest doesn't exist
            if(result==undefined){
                return 404;
            }
 
            //Find all the test with that RFID
            sql = "SELECT * FROM TEST_RESULTS WHERE rfid==? "
            const testarray = await this.daotr.all(sql,req1.rfid);

            //RFID doesn't exist (don't have a test result)
            if(testarray[0]==undefined){
                return 404;
            }

            //Search the ID
            result=testarray.filter((test)=>(test.id==req1.id));

            //ID doesn't exist
            if(result[0]==undefined){
                return 404;
            }

            //Update the object if found
            sql = "UPDATE TEST_RESULTS SET IdtestDescriptor=?, Date=?, Result=?  WHERE id==?";
            result = await this.daotr.run(sql,[req2.newIdTestDescriptor, req2.newDate, req2.newResult, req1.id]);
            return 200;

            }catch(error){
                return 503;
            }
}



    deleteTestResult = async (req) => {

        try{
            //Find the RFID
            let sql = "SELECT * FROM TEST_RESULTS WHERE rfid==? AND id==? "
            let result = await this.daotr.all(sql,[req.rfid,req.id]);

            //RFID doesn't exist
            if(result[0]==undefined){
                return 404;
            }

            //Delete the object because it exists
            sql = "DELETE FROM TEST_RESULTS WHERE rfid==? AND id==?";
            result = await this.daotr.run(sql,[req.rfid, req.id]);
            return 204;
        }catch(error){
            return 503;
        }
    }
  

}

module.exports = TestResultController;

