"use strict";

class TestDescriptorController {
    constructor(daotd) {
        this.daotd = daotd
    }


    
    getTestDescriptors = async (req, res) =>{

        //search on DB
        const sql = "SELECT * FROM TEST_DESCRIPTORS GROUP BY id";
        const result = await this.daotd.all(sql);
        
        return res.status(200).json(result);
    }



    getTestDescriptorById = async (req, res) => {

        //Validation
        if(/^[0-9]+$/.test(req.params.id)===false){
            return res.status(422).json();
        }

        //Find the ID
        let sql = "SELECT * FROM TEST_DESCRIPTORS WHERE id==? "
        let result = await this.daotd.all(sql,req.params.id);

        //ID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json();
        }

        //create and deliver json file
        return res.status(200).json(result);
    }



    createTestDescriptor = async (req, res) => {
        
        //Validation
        if ( req.body.name===undefined || req.body.idSKU===undefined || req.body.procedureDescription===undefined) {
            return res.status(422).json();           
          }
        
        //See if SKUId exist
        let sql ="SELECT * FROM SKUITEMS WHERE SKUid==?"
        let result = await this.daotd.all(sql,req.params.id);

        //SKUID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json();
        }

        //database immission
        sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)";
        await this.daotd.run(sql,[req.body.name, req.body.procedureDescription, req.body.idSKU]);

        return res.status(201).json();

    }



    modifyTestDescriptor = async(req,res) => {

        //Validation
        if(/^[0-9]+$/.test(req.params.id)===false || req.body.newName===undefined || req.body.newIdSKU===undefined || req.body.newProcedureDescription===undefined){
            return res.status(422).json();
        }
        
        //See if SKUId exist
        let sql ="SELECT * FROM SKUITEMS WHERE SKUid==?"
        let result = await this.daotd.all(sql,req.body.newIdSKU);

        //SKUID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json();
        }
        
        //Find the ID
        sql = "SELECT * FROM TEST_DESCRIPTORS WHERE id==?";
        result = await this.daotd.all(sql,req.params.id);
        if(result[0]==undefined){
            return res.status(404).json();
        }

        //Update the object if found
        sql = "UPDATE TEST_DESCRIPTORS SET name=?, procedureDescription=?, idSKU=?  WHERE id==?";
        result = await this.daotd.run(sql,[req.body.newName, req.body.newProcedureDescription, req.body.newIdSKU, req.params.id]);
        return res.status(200).json();
}



    deleteTestDescriptor = async (req, res) => {

        //Validation
        if(/^[0-9]+$/.test(req.params.id)===false){
            return res.status(422).json();
        }

        //Find the ID to check if exist
        let sql = "SELECT * FROM TEST_DESCRIPTORS WHERE id==? "
        let result = await this.daotd.all(sql,req.params.id);

        //ID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json();
        }

        // delete
        sql = "DELETE FROM TEST_DESCRIPTORS WHERE id==?";
        result = await this.daotd.run(sql,req.params.id);
        return res.status(204).json();
    }
  

}

module.exports = TestDescriptorController;
