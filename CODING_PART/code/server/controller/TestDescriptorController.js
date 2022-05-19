"use strict";

/* SOME ERROR MESSAGES HERE */
const ERROR_400 = {error: 'Bad request'};
const ERROR_404 = {error: '404 Not Found'};
const ERROR_422 = {error: 'Unprocessable Entity'};
const ERROR_500 = {error: 'Internal Server Error'};
const ERROR_503 = {error: 'Service Unavailable'};


class TestDescriptorController {
    constructor(daotd) {
        this.daotd = daotd
    }


    
    getTestDescriptors = async (req, res) =>{

        //search on DB
        const sql = "SELECT * FROM TEST_DESCRIPTORS GROUP BY id";
        const result = await this.daotd.all(sql,(error, rows) => {
            if (error) {
                return res.status(500).json(ERROR_500);
            }});
        
        return res.status(200).json(result);
    }



    getTestDescriptorById = async (req, res) => {

        //Find the ID
        let sql = "SELECT * FROM TEST_DESCRIPTORS WHERE id==? "
        let result = await this.daotd.all(sql,req.params.id,(error, rows) => {
            if (error) {
                return res.status(500).json(ERROR_500);
            }});

        //ID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json(ERROR_404);
        }

        //create and deliver json file
        return res.status(200).json(result);
    }



    createTestDescriptor = async (req, res) => {
        
        //See if SKUId exist
        let sql ="SELECT * FROM SKUITEMS WHERE SKUId==?"
        let result = await this.daotd.all(sql,req.body.idSKU,(error, rows) => {
            if (error) {
                return res.status(503).json(ERROR_503);
            }});

        //SKUID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json(ERROR_404);
        }

        //database immission
        sql = "INSERT INTO TEST_DESCRIPTORS(name, procedureDescription, idSKU) VALUES(?,?,?)";
        await this.daotd.run(sql,[req.body.name, req.body.procedureDescription, req.body.idSKU],(error, rows) => {
            if (error) {
                return res.status(503).json(ERROR_503);
            }});

        return res.status(201).json();

    }



    modifyTestDescriptor = async(req,res) => {
        
        //See if SKUId exist
        let sql ="SELECT * FROM SKUITEMS WHERE SKUId==?"
        let result = await this.daotd.all(sql,req.body.newIdSKU,(error, rows) => {
            if (error) {
                return res.status(503).json(ERROR_503);
            }});

        //SKUID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json(ERROR_404);
        }
        
        //Find the ID
        sql = "SELECT * FROM TEST_DESCRIPTORS WHERE id==?";
        result = await this.daotd.all(sql,req.params.id,(error, rows) => {
            if (error) {
                return res.status(503).json(ERROR_503);
            }});
        if(result[0]==undefined){
            return res.status(404).json(ERROR_404);
        }

        //Update the object if found
        sql = "UPDATE TEST_DESCRIPTORS SET name=?, procedureDescription=?, idSKU=?  WHERE id==?";
        result = await this.daotd.run(sql,[req.body.newName, req.body.newProcedureDescription, req.body.newIdSKU, req.params.id],(error, rows) => {
            if (error) {
                return res.status(503).json(ERROR_503);
            }});
        return res.status(200).json();
}



    deleteTestDescriptor = async (req, res) => {

        //Find the ID to check if exist
        let sql = "SELECT * FROM TEST_DESCRIPTORS WHERE id==? "
        let result = await this.daotd.all(sql,req.params.id,(error, rows) => {
            if (error) {
                return res.status(503).json(ERROR_503);
            }});

        //ID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json(ERROR_404);
        }

        // delete
        sql = "DELETE FROM TEST_DESCRIPTORS WHERE id==?";
        result = await this.daotd.run(sql,req.params.id,(error, rows) => {
            if (error) {
                return res.status(503).json(ERROR_503);
            }});
        return res.status(204).json();
    }
  

}

module.exports = TestDescriptorController;
