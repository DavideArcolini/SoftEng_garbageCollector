"use strict";

class ItemController {
    constructor(daoi) {
        this.daoi = daoi
    }



    
    getItems = async (req, res) =>{   //   /api/items

        //Search on DB
        const sql = "SELECT * FROM ITEMS";
        const result = await this.daoi.all(sql);
        
        return res.status(200).json(result);
    }



    getItemById = async (req, res) => { // /api/items/:id

        //Validation
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
        
        //Validation
        if (req.body.description===undefined || req.body.price===undefined || req.body.SKUId===undefined || req.body.supplierId===undefined) {
            return res.status(404).json();           
          }

        //See if SKUId exist
        let sql ="SELECT * FROM SKUITEMS WHERE SKUid==?"
        let result = await this.daotd.all(sql,req.params.id);

        //SKUID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json();
        }
        
        //Search if there is another item
        sql = "SELECT * FROM ITEMS WHERE SKUId = ?"
        const search = await this.daoi.get(sql,req.body.SKUId);
        if(search[0]!==undefined ){  
            return res.status(422).json();
        } 

        //Database immission 
        sql = "INSERT INTO ITEMS(description, price, SKUId, supplierId) VALUES(?,?,?,?)";
        await this.daoi.run(sql,[req.body.description, req.body.price, req.body.SKUId, req.body.supplierId]);

        return res.status(201).json();

    }



    modifyItem = async(req,res) => { //     /api/item/:id

        //Validation
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

        //Update the object if found
        if(req.body.newDescription==null){
            sql = "UPDATE ITEMS SET  price=?  WHERE id==?";
            result = await this.daoi.run(sql,[req.body.newPrice, req.params.id]);
            return res.status(200).json();
        }else if(req.body.newPrice==null){
            sql = "UPDATE ITEMS SET  description=?  WHERE id==?";
            result = await this.daoi.run(sql,[req.body.newDescription, req.params.id]);
            return res.status(200).json();
        }else if(req.body.newDescription==null && req.body.newPrice==null){
            return res.status(503).json();
        }else{
            sql = "UPDATE ITEMS SET  description=?, price=? WHERE id==?";
            result = await this.daoi.run(sql,[req.body.newDescription,req.body.newPrice, req.params.id]);
            return res.status(200).json();
        }
}



    deleteItem = async (req, res) => {

        //Validation
        if(/^[0-9]+$/.test(req.params.id)===false){
            return res.status(422).json();
        }

        //Find the ID to check if exist
        let sql = "SELECT * FROM ITEMS WHERE id==? "
        let result = await this.daoi.all(sql,req.params.id);

        //ID doesn't exist
        if(result[0]==undefined){
            return res.status(404).json();
        }

        //Delete item
        sql = "DELETE FROM ITEMS WHERE id==?";
        result = await this.daoi.run(sql,req.params.id);
        return res.status(204).json();
    }
  

}

module.exports = ItemController;
