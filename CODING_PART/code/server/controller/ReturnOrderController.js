"use strict";
const dayjs = require( 'dayjs');

class ReturnOrderController {
    constructor(daorto) {
        this.daorto = daorto
    }

    createReturnOrder = async (req, res) => {
        if (req.body.returnDate===undefined || req.body.restockOrderId===undefined ) {
            return res.status(422).json();           
          }
        let sql = "SELECT MAX(id) as id FROM RETURN_ORDERS"
        let max_id = await this.daorto.get(sql);
        let id=1;
        if(max_id.id!==null)
            id = max_id.id+1;
        
        let data = req.body;
        
        for (const prod of req.body.products)
        { 
                sql = "INSERT INTO RETURN_ORDERS(id, returnDate, restockOrderId, SKUId, description, price, RFID) VALUES(?,?,?,?,?,?,?)"
                await this.daorto.run(sql,[id, data.returnDate,  data.restockOrderId, prod.SKUId, prod.description, prod.price, prod.RFID])
            
        }
        
       
        
        return res.status(201).json()
        
        
        
    }
        
        
        
    





    getReturnOrderById = async (req, res) => {
        let id = req.params.id;
        if(/^[0-9]+$/.test(id)===false){
            return res.status(422).json();
        }
        
        let sql = "SELECT id, returnDate, restockOrderId, SKUId, description, price, RFID FROM RETURN_ORDERS WHERE id==? GROUP BY id, returnDate, restockOrderId, SKUId, description, price,RFID"
        let response = await this.daorto.all(sql,id);
        if(response==null){
            return res.status(404).json();
        }
       
        let result = {id: response[0].id, returnDate: response[0].returnDate, restockOrderId: response[0].restockOrderId};
      
        let products = response.map( (x)=>{
           
            delete x.id
            delete x.returnDate
            delete x.restockOrderId
            return x;
            
}) ;
       result = {...result , products : products };   
        return res.status(200).json(result);
    }
    getReturnOrders = async (req, res) =>{
        let sql = "SELECT id, returnDate, restockOrderId FROM RETURN_ORDERS GROUP BY id, returnDate, restockOrderId";
        let result = await this.daorto.all(sql);
        
        await Promise.all(result.map(async (x) => {
                sql = "SELECT SKUId, description, price, RFID FROM RETURN_ORDERS WHERE id==? "
                x.products = await this.daorto.all(sql,x.id);
                
               
        }));

        
        return res.status(200).json(result);
}
   
deleteReturnOrder = async (req, res) => {
    let id = req.params.id;
    if(/^[0-9]+$/.test(id)===false){
        return res.status(422).json();
    }
    let sql = "DELETE FROM RETURN_ORDERS WHERE id==?";
    let _ = await this.daorto.run(sql,id);
    
    return res.status(204).json();
}
    

    

}

module.exports = ReturnOrderController;