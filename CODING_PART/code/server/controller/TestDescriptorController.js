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

        //control id by function test (already in js)
        if(/^[0-9]+$/.test(req.params.id)===false){
            return res.status(422).json();
        }

        //Find the ID
        const sql = "SELECT * FROM TEST_DESCRIPTORS WHERE id==? "
        const objectfinded = await this.daotd.all(sql,req.params.id);
        console.log(JSON.stringify(objectfinded));

        //ID doesn't exist
        if(objectfinded==null){
            return res.status(404).json();
        }

        //create and deliver json file
        const result = {id: objectfinded.id, name: objectfinded.name, procedureDescription: objectfinded.procedureDescription, idSKU: objectfinded.idSKU };
        console.log("RESULT : "+ JSON.stringify(result))
        return res.status(200).json(result);
    }



    createTestDescriptor = async (req, res) => {
        
        //control the validation of the input
        if ( req.body.name===undefined || req.body.idSKU===undefined || req.body.procedureDescription===undefined) {
            return res.status(422).json();           
          }
        
        //aggiungere se idSKU non esiste-> errore 404 DUBBIO


        //creation id
        let sql = "SELECT MAX(id) as id FROM TEST_DESCRIPTORS"
        const max_id = await this.daotd.get(sql); 
        let id=1;
        if(max_id.id!==null)
            id = max_id.id+1;

        //database immission
        sql = "INSERT INTO TEST_DESCRIPTORS(id, name, procedureDescription, idSKU) VALUES(?,?,?,?)";
        await this.daotd.run(sql,[id, req.body.name, req.body.procedureDescription, req.body.idSKU]);

        return res.status(201).json();

    }



    modifyTestDescriptor = async(req,res) => {

        //control id by function test (already in js)
        if(/^[0-9]+$/.test(req.params.id)===false || req.body.newName===undefined || req.body.newIdSKU===undefined || req.body.newProcedureDescription===undefined){
            return res.status(422).json();
        }
        //aggiungere se idSKU non esiste-> errore 404
        
        //Find the ID
        let sql = "SELECT * TEST_DESCRIPTORS WHERE id==?";
        let result = await this.daotd.get(sql,req.params.id);
        if(result==null){
            return res.status(404).json();
        }

        //Update the object if found
        sql = "UPDATE TEST_DESCRIPTORS SET name=?, procedureDescription=?, idSKU=?  WHERE id==?";
        result = await this.daotd.run(sql,[req.body.newName, req.body.newProcedureDescription, req.body.newIdSKU, req.params.id]);
        return res.status(200).json();
}



    deleteTestDescriptor = async (req, res) => {

        //control id by function test (already in js)
        if(/^[0-9]+$/.test(req.params.id)===false){
            return res.status(422).json();
        }


        const sql = "DELETE FROM TEST_DESCRIPTORS WHERE id==?";
        const result = await this.daotd.run(sql,req.params.id);
        return res.status(204).json();
    }
  

}

module.exports = TestDescriptorController;