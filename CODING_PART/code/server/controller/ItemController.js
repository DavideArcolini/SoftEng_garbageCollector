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
        const sql = "SELECT * FROM ITEMS WHERE id==? "
        const result = await this.daoi.all(sql,req.params.id);

        //ID doesn't exist
        if(result==null){
            return res.status(404).json();
        }

        //create and deliver json file
        console.log("RESULT : "+ JSON.stringify(result))
        return res.status(200).json(result);
    }



    createItem = async (req, res) => {///api/item
        
        //control the validation of the input
        if ( req.body.description===undefined || req.body.price===undefined || req.body.SKUId===undefined || req.body.supplierId===undefined) {
            return res.status(404).json();           
          }

        //creation id
        let sql = "SELECT MAX(id) as id FROM ITEMS WHERE id==?"
        const max_id = await this.daoi.get(sql,req.body.id); 
        let id=1;
        if(max_id.id!==null)
            id = max_id.id+1;
        console.log(id);

        //database immission 
        debugger;
        sql = "INSERT INTO ITEMS(id, description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
        await this.daoi.run(sql,[id, req.body.description, req.body.price, req.body.SKUId, req.body.supplierId]);

        return res.status(201).json();

    }



    modifyItem = async(req,res) => { //     /api/item/:id

        //control id by function test (already in js)
        if(/^[0-9]+$/.test(req.params.id)===false){
            return res.status(422).json();
        }
        
        //Find the ID
        let sql = "SELECT * FROM ITEMS WHERE id==? "
        let result = await this.daoi.all(sql,req.params.id);

        //ID doesn't exist
        if(result==null){
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

        //control id by function test (already in js)
        if(/^[0-9]+$/.test(req.params.id)===false){
            return res.status(422).json();
        }

        //Find the ID
        let sql = "SELECT * FROM ITEMS WHERE id==? "
        let result = await this.daoi.all(sql,req.params.id);
        console.log(result);


        //ID doesn't exist
        if(result.lenght==0){
            return res.status(404).json();
        }

        sql = "DELETE FROM ITEMS WHERE id==?";
        result = await this.daoi.run(sql,req.params.id);
        return res.status(204).json();
    }
  

}

module.exports = ItemController;