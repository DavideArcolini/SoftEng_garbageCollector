"use strict";



/* --------- IMPORT MODULES --------- */
const SKUDAO        = require("../db/skuDAO");
const testDescriptorDAO=require("../db/testDescriptorsDAO");
const itemDAO        = require("../db/itemDAO");

/* --------- ERROR MESSAGES --------- */
const MESSG_200 = {code: 200, message: 'Ok'}
const MESSG_201 = {code: 201, message: 'Created'};
const MESSG_204 = {code: 204, message: 'No Content'};
const ERROR_404 = {code: 404, message: 'Not Found'};
const MESSG_422 = {code: 422, message: 'Unprocessable entity'};


class ItemController {
    constructor(generalPurposeDAO) {
        this.skuDAO     = new SKUDAO(generalPurposeDAO);
        this.testDescriptorDAO= new testDescriptorDAO(generalPurposeDAO);
        this.itemDAO     = new itemDAO(generalPurposeDAO);
    }
    
    getItems = async () =>{ 

        try{
            //search on DB
            const items = await this.itemDAO.getItems();
            return {
                code: 200,
                message: items
            };
  
        }catch{
            throw error;
        }
    }


    getItemById = async (params) => { 
        
        const targetId=params.id;

        try {
            //search on DB
            const item = await this.itemDAO.getItemById(targetId);
            if(item === undefined){
                return ERROR_404
            }else if(item.SKUId==null){
                item.SKUId=1;
                return {code: 200, message: item};
            }else{
                return{code: 200, message: item};
            } 
            
        } catch (error) {
            throw error;
        }
    }


    createItem = async (body) => {
        
        try {
            /* checking if SKUid actually exists */
            const sku = await this.skuDAO.getSKUByID(body.SKUId);
            if (sku === undefined) {
                return ERROR_404;
            }
            
             /* checking  if supplier already sell another item with same id */ 
             let item = await this.itemDAO.getItemBySupId(body.id, body.supplierId);
             if (item !== undefined) {
                 return MESSG_422;
             }

             /* checking  if supplier already sell another item with same SKUId */
             item = await this.itemDAO.getItemBySupSKUID(body.SKUId, body.supplierId);
             if (item !== undefined) {
                 return MESSG_422;
             }


             /* creating item in the DB */
            await this.itemDAO.createItem(body);
            return MESSG_201;

        } catch (error) {
            throw error;
        }
    }


    modifyItem = async(body,params) => { 

        const targetId=params.id;
        
        try{
            /* checking  if exist item with same id */ 
            let item = await this.itemDAO.getItemById(targetId);
            if (item === undefined) {
                return ERROR_404;
            }

            /* update item */
            await this.itemDAO.modifyItem(targetId, body);
            return MESSG_200;
        }
        catch(error){
            throw error;
        }
}



    deleteItem = async (params) => {

        const targetId=params.id;

        try{

            /* accessing DB through DAO */
            await this.itemDAO.deleteItem(targetId);
            return MESSG_204;
        }catch(error){
            throw error;
        }
    }
  

}

module.exports = ItemController;