"use strict";

class ItemController {
    constructor(daoi) {
        this.daoi = daoi
    }
    
    getItems = async () =>{ 

        try{
            //search on DB
            let sql = "SELECT * FROM ITEMS";
            let result = await this.daoi.all(sql);
            
            return result;
            
        }catch{
            return 500;
        }
    }


    getItemById = async (req) => { 

        try {

            //Find the item
            //let sql = "SELECT * FROM ITEMS WHERE id==? AND supplierId==? "
            let sql = "SELECT * FROM ITEMS WHERE id=(?)"
            let result = await this.daoi.get(sql,[req.id]);

            //Item doesn't exist
            if(result==undefined){
                return 404;
            }

            //deliver json file
            return result;
        } catch (error) {
            return 500;
        }
    }


    createItem = async (json) => {
        
        try {
            //See if SKUId exist
            let sql = "SELECT * FROM SKUS WHERE id == ?"
            let result = await this.daoi.get(sql, [json.SKUId]);

            //SKUID doesn't exist
            if(result === undefined){
                return 404;
            }
            
            //Search if supplier already sell another item with same id
            sql = "SELECT * FROM ITEMS WHERE Id == ? AND supplierId == ?"
            let search = await this.daoi.get(sql,[json.id,json.supplierId]);
            if(search!==undefined ){  
                return 422;
            } 

            //Search if supplier already sell another item with same SKUId
            sql = "SELECT * FROM ITEMS WHERE SKUId == ? AND supplierId == ?"
            search = await this.daoi.get(sql,[json.SKUId,json.supplierId]);
            if(search!==undefined ){  
                return 422;
            } 


            //database immission 
            sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
            await this.daoi.run(sql,[json.id, json.description, json.price, json.SKUId, json.supplierId]);

            return 201;
        } catch (error) {
            return 503;
        }
    }


    modifyItem = async(json,id) => { 
        
        try{
            //Find if item exist
            let sql = "SELECT * FROM ITEMS WHERE ITEMS.id == ?"
            let result = await this.daoi.get(sql, [id]);

            //Item doesn't exist
            // console.log(result);
            // if(result === undefined){
            //     return 404;
            // }

            //Update the object if found
            sql = `UPDATE ITEMS SET description=(?), price=(?) WHERE id==?`;
            result = await this.daoi.run(sql,[json.newDescription,json.newPrice, id]);
            return 200;
        }
        catch(error){
            return 503;
        }
}



    deleteItem = async (req) => {
        try{

            //Find if the item exist
            let sql = "SELECT * FROM ITEMS WHERE id=(?)"
            let result = await this.daoi.get(sql,[req.id]);

            //Item doesn't exist
            if(result==undefined){
                return 404;
            }

            //delete item
            sql = "DELETE FROM ITEMS WHERE id=(?)";
            result = await this.daoi.run(sql,[req.id]);
            return 204;
        }catch(error){
            return 503;
        }
    }
  

}

module.exports = ItemController;
