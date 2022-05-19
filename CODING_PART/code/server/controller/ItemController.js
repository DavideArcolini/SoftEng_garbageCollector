"use strict";

/* SOME ERROR MESSAGES HERE */
const ERROR_400 = {error: 'Bad request'};
const ERROR_404 = {error: '404 Not Found'};
const ERROR_422 = {error: 'Unprocessable Entity'};
const ERROR_500 = {error: 'Internal Server Error'};
const ERROR_503 = {error: 'Service Unavailable'};

class ItemController {
    constructor(daoi) {
        this.daoi = daoi
    }



    
    getItems = async (req, res) =>{ 

        //search on DB
        const sql = "SELECT * FROM ITEMS";
        const result = await this.daoi.all(sql,(error, rows) => {
            if (error) {
                return res.status(500).json(ERROR_500);
            }});
        
        return res.status(200).json(result);
    }



    getItemById = async (req, res) => { 

        try {

            //Find the item
            //let sql = "SELECT * FROM ITEMS WHERE id==? AND supplierId==?  "
            let sql = "SELECT * FROM ITEMS WHERE id=(?)"
            let result = await this.daoi.get(sql,[req.params.id],(error, rows) => {
                if (error) {
                    return res.status(500).json(ERROR_500);
                }});

            //Item doesn't exist
            if(result==undefined){
                return res.status(404).json({message : "Item not found"});
            }

            //deliver json file
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json(ERROR_500);
        }
    }



    createItem = async (req, res) => {
        
        try {
            
            //See if SKUId exist
            let sql ="SELECT * FROM SKUITEMS WHERE SKUId=(?)"
            let result = await this.daoi.all(sql,req.body.SKUId,(error, rows) => {
                if (error) {
                    return res.status(503).json(ERROR_503);
                }});

            //SKUID doesn't exist
            if(result[0]==undefined){
                return res.status(404).json();
            }
            /*
            //Search if supplier already sell another item with same id
            sql = "SELECT * FROM ITEMS WHERE Id == ? AND supplierId == ?"
            let search = await this.daoi.all(sql,[req.body.id,req.body.supplierId],(error, rows) => {
                if (error) {
                    return res.status(503).json(ERROR_503);
                }});
            if(search[0]!==undefined ){  
                return res.status(422).json();
            } 

            //Search if supplier already sell another item with same SKUId
            sql = "SELECT * FROM ITEMS WHERE SKUId == ? AND supplierId == ?"
            search = await this.daoi.all(sql,[req.body.SKUId,req.body.supplierId],(error, rows) => {
                if (error) {
                    return res.status(503).json(ERROR_503);
                }});
            if(search[0]!==undefined ){  
                return res.status(422).json();
            } */

            /* -------------- JOINING TABLES -------------- */

            sql = `
                SELECT *
                FROM ITEMS I, SKUITEMS S
                WHERE id = (?) AND supplierId = (?) AND I.SKUId = (?) AND I.SKUId = S.SKUId
            `;
            let search = await this.daoi.get(sql,[req.body.id, req.body.supplierId, req.body.SKUId],(error, rows) => {
                if (error) {
                    return res.status(503).json(ERROR_503);
                }});
            if(search !==undefined ){  
                return res.status(422).json();
            } 

            /* -------------- END JOINING TABLES -------------- */

            //database immission 
            sql = "INSERT INTO ITEMS(id,description, price, SKUId, supplierId) VALUES(?,?,?,?,?)";
            await this.daoi.run(sql,[req.body.id, req.body.description, req.body.price, req.body.SKUId, req.body.supplierId],(error, rows) => {
                if (error) {
                    return res.status(503).json(ERROR_503);
                }});

            return res.status(201).json({message: "Item created"});
        } catch (error) {
            console.log(error);
            return res.status(503).json(ERROR_503);
        }

        

    }



    modifyItem = async(req,res) => { 
        try{
            
            //Find if item exist
            let sql = "SELECT * FROM ITEMS WHERE id=?"
            let result = await this.daoi.all(sql,[req.params.id],(error, rows) => {
                if (error) {
                    return res.status(503).json(ERROR_503);
                }});

            //Item doesn't exist
            if(result[0]==undefined){
                return res.status(404).json();
            }

            //Update the object if found
            sql = `
                UPDATE ITEMS 
                SET  
                    description=(?), 
                    price=(?) 
                WHERE id=(?)`;
            result = await this.daoi.run(sql,[req.body.newDescription,req.body.newPrice, req.params.id],(error, rows) => {
                if (error) {
                    return res.status(503).json(ERROR_503);
                }});
            return res.status(200).json({message: "Item modified"});
        }
        catch(error){
            return res.status(500).json(ERROR_500);
        }
}



    deleteItem = async (req, res) => {
        try{

            //Find if the item exist
            let sql = "SELECT * FROM ITEMS WHERE id=(?)"
            let result = await this.daoi.get(sql,[req.params.id],(error, rows) => {
                if (error) {
                    return res.status(503).json(ERROR_503);
                }});

            //Item doesn't exist
            if(result==undefined){
                return res.status(404).json();
            }

            //delete item
            sql = "DELETE FROM ITEMS WHERE id=(?)";
            result = await this.daoi.run(sql,[req.params.id],(error, rows) => {
                if (error) {
                    return res.status(503).json(ERROR_503);
                }});
            return res.status(204).json({message: "Item deleted"});
        }catch(error){
            return res.status(500).json(ERROR_500);
        }
    }
  

}

module.exports = ItemController;
