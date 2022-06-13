"use strict";

/* --------- IMPORT MODULES --------- */
const SKUDAO        = require("../db/skuDAO");
const testDescriptorDAO=require("../db/testDescriptorsDAO");

/* --------- ERROR MESSAGES --------- */
const MESSG_200 = {code: 200, message: 'Ok'}
const MESSG_201 = {code: 201, message: 'Created'};
const MESSG_204 = {code: 204, message: 'No Content'};
const ERROR_404 = {code: 404, message: 'Not Found'};


class TestDescriptorController {
    constructor(generalPurposeDAO) {
        this.skuDAO     = new SKUDAO(generalPurposeDAO);
        this.testDescriptorDAO= new testDescriptorDAO(generalPurposeDAO)
    }

    
    getTestDescriptors = async () =>{

        try{
             //search on DB
            const testdescriptors = await this.testDescriptorDAO.getTestDescriptors();
            return {
                code: 200,
                message: testdescriptors
            };
        }catch(error){
            throw error;
        }
    } 

    getTestDescriptorById = async (params) => {

        const targetId=params.id;

        try{
            //search on DB
            const testdescriptor = await this.testDescriptorDAO.getTestDescriptorById(targetId);
            return (testdescriptor === undefined) ? ERROR_404 : {code: 200, message: testdescriptor};

        }catch(error){
            throw error;
        }
    }


    createTestDescriptor = async (body) => {
        
        try{
            /* checking if SKUid actually exists */
            const sku = await this.skuDAO.getSKUByID(body.idSKU);
            if (sku === undefined) {
                return ERROR_404;
            }

            /* creating test descriptor in the DB */
            await this.testDescriptorDAO.createTestDescriptor(body);
            return MESSG_201;

        }catch(error){
            throw error;
        }
    }


    modifyTestDescriptor = async(body, params) => {

        const targetId = params.id;
        const data = body;
        
        try{

            /* checking if SKUid actually exists */
            const sku = await this.skuDAO.getSKUByID(data.newIdSKU);
            console.log(sku)
            if (sku === undefined) {
                return ERROR_404;
            }

            /* check if TestDescriptor exists */
            const testdescriptor = await this.testDescriptorDAO.getTestDescriptorById(targetId);
            if (testdescriptor === undefined) {
                return ERROR_404;
            }

            /* update testdescriptor */
            await this.testDescriptorDAO.modifyTestDescriptor(targetId, data);
            return MESSG_200;

        }catch(error){
            throw error;
        }
    }



    deleteTestDescriptor = async (params) => {

        const targetId=params.id;

        try{
            /* accessing DB through DAO */
            await this.testDescriptorDAO.deleteTestDescriptor(targetId);
            return MESSG_204;

        }catch(error){
            throw error;
        }
    }

}

module.exports = TestDescriptorController;