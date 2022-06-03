"use strict";

class TestDescriptorController {
    constructor(daotd) {
        this.daotd = daotd
    }

    
    getTestDescriptors = async () =>{

        //search on DB
        try{

            const sql = "SELECT * FROM TEST_DESCRIPTORS GROUP BY id";
            const result = await this.daotd.all(sql);
            if(result.length !== 0 && result[0].idSKU==null){
                throw(error);
            }else{
                return result;
            }

        }catch(error){
            return 500;
        }
    }
        

    getTestDescriptorById = async (req) => {

        try{
            //Find the ID
            let sql = "SELECT * FROM TEST_DESCRIPTORS WHERE id==? "
            let result = await this.daotd.get(sql,req.id);

            //ID doesn't exist
            if(result==undefined){
                return 404;
            }

            //create and deliver json file
            return result;

        }catch(error){
            return 500;
        }
    }


    createTestDescriptor = async (json) => {
        
        try{
            //See if SKUId exist
            let sql ="SELECT * FROM SKUS WHERE id==?"
            let result = await this.daotd.get(sql,json.idSKU);

            //SKUID doesn't exist
            if(result==undefined){
                return 404;
            }

            //database immission
            sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)";
            await this.daotd.run(sql,[json.name, json.procedureDescription, json.idSKU]);
            return 201;

        }catch(error){
            return 503;
        }
    }


    modifyTestDescriptor = async(json, req) => {
        
        try{

            //See if SKUId exist
            let sql ="SELECT * FROM SKUS WHERE id==?"
            let result = await this.daotd.get(sql,json.newIdSKU);

            //SKUID doesn't exist
            if(result === undefined){
                return 404;
            }
        
            //Find the ID
            sql = "SELECT * FROM TEST_DESCRIPTORS WHERE id==?";
            result = await this.daotd.get(sql,req.id);

            //ID doesn't exist    
            if(result === undefined){
                return 404;
            }

            //Update the object if found
            sql = "UPDATE TEST_DESCRIPTORS SET name=?, procedureDescription=?, idSKU=?  WHERE id==?";
            result = await this.daotd.run(sql,[json.newName, json.newProcedureDescription, json.newIdSKU, req.id]);
            return 200;

        }catch(error){
            return 503;
        }
}



    deleteTestDescriptor = async (req) => {

        try{
            //Find the ID to check if exist
            let sql = "SELECT * FROM TEST_DESCRIPTORS WHERE id==? "
            let result = await this.daotd.get(sql,req.id);

            //ID doesn't exist
            if(result==undefined){
                return 404;
            }

            // delete
            sql = "DELETE FROM TEST_DESCRIPTORS WHERE id==?";
            result = await this.daotd.run(sql,req.id);
            return 204;

        }catch(error){
            return 503;
        }
    }
}

module.exports = TestDescriptorController;

