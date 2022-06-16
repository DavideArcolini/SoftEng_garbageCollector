"use strict";

/* --------- IMPORT MODULES --------- */
const SKUitemDAO    = require("../db/skuItemDAO");
const SKUDAO        = require("../db/skuDAO");
const testDescriptorDAO=require("../db/testDescriptorsDAO");
const testResultDAO=require("../db/testResultDAO");

/* --------- ERROR MESSAGES --------- */
const MESSG_200 = {code: 200, message: 'Ok'}
const MESSG_201 = {code: 201, message: 'Created'};
const MESSG_204 = {code: 204, message: 'No Content'};
const ERROR_404 = {code: 404, message: 'Not Found'};





class TestResultController {
    constructor(generalPurposeDAO) {
        this.skuItemDAO = new SKUitemDAO(generalPurposeDAO);
        this.skuDAO     = new SKUDAO(generalPurposeDAO);
        this.testDescriptorDAO= new testDescriptorDAO(generalPurposeDAO);
        this.testResultDAO= new testResultDAO(generalPurposeDAO);
    }

 
    getTestResults = async (params) =>{

        const targetRFID=params.rfid

        try{
            /* check if SKUitem exists */
            const skuitem = await this.skuItemDAO.getSKUitemByRFID(targetRFID);
            if (skuitem === undefined) {
                return ERROR_404;
            }

            const testresults = await this.testResultDAO.getTestResults(targetRFID);

            //If empty return empty otherwisechange result 
            if(testresults[0]==undefined){
                return {
                    code: 200,
                    message: testresults
                };
            }else{
                testresults.map((object)=>{object.Result==0 ? object.Result=false :object.Result=true})
                return {
                    code: 200,
                    message: testresults
                };
            }

        }catch(error){
            throw error;
        }
    }


    getTestResultById = async (params) => {

        const targetRFID=params.rfid
        const targetId=params.id
        try{
            /* check if SKUitem exists */
            const skuitem = await this.skuItemDAO.getSKUitemByRFID(targetRFID);
            if (skuitem === undefined) {
                return ERROR_404;
            }
            //check for null return or to modify the result(why SQL can't have boolean);
            let testresult = await this.testResultDAO.getTestResultById(targetId,targetRFID);
            if(testresult === undefined){
                return ERROR_404;
            }else{
                testresult.Result==0 ? testresult.Result=false : testresult.Result=true;
                return  {code: 200, message: testresult}
            }

        }catch(error){
            throw error;
        }
    }



    createTestResult = async (body) => {

        const targetRFID=body.rfid;
        const targetID=body.idTestDescriptor;
        
        try{
            /* check if SKUitem exists */
            const skuitem = await this.skuItemDAO.getSKUitemByRFID(targetRFID);
            if (skuitem === undefined) {
                return ERROR_404;
            }

            /* check if test descriptor exists */
            const testdescriptor = await this.testDescriptorDAO.getTestDescriptorById(targetID);
            if (testdescriptor === undefined) {
                return ERROR_404;
            }

            /* creating new testreult in the DB */
            await this.testResultDAO.createTestResult(body);
            return MESSG_201;

            }catch(error){
                throw error;
            }
    }



    modifyTestResult = async(params,body) => {

        const targetRFID=params.rfid
        const targetID=params.id

        try{
             /* check if SKUitem exists */
             const skuitem = await this.skuItemDAO.getSKUitemByRFID(targetRFID);
             if (skuitem === undefined) {
                 return ERROR_404;
             }
 
             /* check if test descriptor exists */
             const testdescriptor = await this.testDescriptorDAO.getTestDescriptorById(body.newIdTestDescriptor);
             if (testdescriptor === undefined) {
                 return ERROR_404;
             }
 
            //Find all the test with that RFID and ID
            const testresult = await this.testResultDAO.getTestResultById(targetID,targetRFID);
            if (testresult === undefined) {
                return ERROR_404;
            }

             /* update SKUitem */
             await this.testDescriptorDAO.modifyTestDescriptor(targetID, body);
             return MESSG_200;

            }catch(error){
                throw error;
            }
    }



    deleteTestResult = async (params) => {

        const targetRFID=params.rfid;
        const targetId=params.id;

        try{
            /* check if SKUitem exists */
            const skuitem = await this.skuItemDAO.getSKUitemByRFID(targetRFID);
            if (skuitem === undefined) {
                return ERROR_404;
            }

             /* accessing DB through DAO */
             await this.testResultDAO.deleteTestResult(targetId);
             return MESSG_204;

        }catch(error){
            throw error;
        }
    }
  

}


module.exports = TestResultController;