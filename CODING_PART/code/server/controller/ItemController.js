"use strict";

class ItemController {
    constructor(daoi) {
        this.daoi = daoi
    }



    
    getItems = async (req, res) =>{   //   /api/items

        //search on DB
        const sql = "SELECT * FROM ITEMS";
        const result = await this.daoi.all(sql);
        
        return res.status(200).json(result);
    }



    getItemById = async (req, res) => { // /api/items/:id

        //control id by function test (already in js)
        if(/^[0-9]+$/.test(req.params.id)===false){
            return res.status(422).json();
        }

        //Find the ID
        let sql = "SELECT * FROM ITEMS WHERE id==? "
        let result = await this.daoi.all(sql,req.params.id);

        //ID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json();
        }

        //deliver json file
        return res.status(200).json(result);
    }



    createItem = async (req, res) => {///api/item
        
        //control the validation of the input
        if (req.body.id===undefined || req.body.description===undefined || req.body.price===undefined || req.body.SKUId===undefined || req.body.supplierId===undefined) {
            return res.status(404).json();           
          }

        //See if SKUId exist
        let sql ="SELECT * FROM SKUITEMS WHERE SKUid==?"
        let result = await this.daotd.all(sql,req.params.id);

        //SKUID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json();
        }
        
        //Search if supplier already sell another item with same id
        sql = "SELECT * FROM ITEMS WHERE Id == ? AND supplierId == ?"
        let search = await this.daoi.all(sql,[req.body.id,req.body.supplierId]);
        if(search[0]!==undefined ){  
            return res.status(422).json();
        } 

        //Search if supplier already sell another item with same SKUId
        sql = "SELECT * FROM ITEMS WHERE SKUId == ? AND supplierId == ?"
        search = await this.daoi.all(sql,[req.body.SKUId,req.body.supplierId]);
        if(search[0]!==undefined ){  
            return res.status(422).json();
        } 

        //database immission 
        sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
        await this.daoi.run(sql,[req.body.id, req.body.description, req.body.price, req.body.SKUId, req.body.supplierId]);

        return res.status(201).json();

    }



    modifyItem = async(req,res) => { //     /api/item/:id

        //control id by function test (already in js)
        if(/^[0-9]+$/.test(req.params.id)===false){
            return res.status(422).json();
        }
        
        //Find the ID of the supplier
        let sql = "SELECT * FROM ITEMS WHERE id==? AND supplierId==? "
        let result = await this.daoi.all(sql,[req.params.id,req.body.supplierId]);

        //ID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json();
        }

        //Update the object if found
        if(req.body.newDescription==null){
            sql = "UPDATE ITEMS SET  price=?  WHERE id==? AND supplierId==?";
            result = await this.daoi.run(sql,[req.body.newPrice, req.params.id,req.body.supplierId]);
            return res.status(200).json();
        }else if(req.body.newPrice==null){
            sql = "UPDATE ITEMS SET  description=?  WHERE id==?  AND supplierId==?";
            result = await this.daoi.run(sql,[req.body.newDescription, req.params.id, req.body.supplierId]);
            return res.status(200).json();
        }else if(req.body.newDescription==null && req.body.newPrice==null){
            return res.status(503).json();
        }else{
            sql = "UPDATE ITEMS SET  description=?, price=? WHERE id==?  AND supplierId==?";
            result = await this.daoi.run(sql,[req.body.newDescription,req.body.newPrice, req.params.id, req.body.supplierId]);
            return res.status(200).json();
        }
}



    deleteItem = async (req, res) => {

        //control id by function test (already in js)
        if(/^[0-9]+$/.test(req.params.id)===false){
            return res.status(422).json();
        }

        //Find the ID to check if exist
        let sql = "SELECT * FROM ITEMS WHERE id==? AND supplierId==? "
        let result = await this.daoi.all(sql,[req.params.id,req.body.supplierId]);

        //ID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json();
        }

        //delete item
        sql = "DELETE FROM ITEMS WHERE id==? AND supplierId==?";
        result = await this.daoi.run(sql,[req.params.id,req.body.supplierId]);
        return res.status(204).json();
    }
  

}

module.exports = ItemController;
