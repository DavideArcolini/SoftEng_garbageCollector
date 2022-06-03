"use strict";
const dayjs = require( 'dayjs');

class ReturnOrderController {
    constructor(dao) {
        this.dao = dao
    }

    createReturnOrder = async (returnDate,restockOrderId,products) => {
        if (returnDate===undefined || restockOrderId===undefined ) {
            //return res.status(422).end();  
            return {unprocessableEntity: "invalid returnDate/restockOrderId"};         
          }
        try{
            let sql = "SELECT MAX(id) as id FROM RETURN_ORDERS"
            let max_id = await this.dao.get(sql);
            let id=1;
            if(max_id.id!==null)
                id = max_id.id+1;
            
            /* checkinf restock order */
            let sql_check = "SELECT * FROM RESTOCK_ORDERS WHERE RESTOCK_ORDERS.id == ?";
            const result = await this.dao.get(sql_check, [restockOrderId]);
            if (result === undefined) {
                return 404;
            }
            
            for (const prod of products)
            { 
                    sql = "INSERT INTO RETURN_ORDERS(id, returnDate, restockOrderId, SKUId, description, price, RFID) VALUES(?,?,?,?,?,?,?)"
                    await this.dao.run(sql,[id, returnDate,  restockOrderId, prod.SKUId, prod.description, prod.price, prod.RFID])
                
            }
            
        
            
            //return res.status(201).end();
            return id;
    }catch(error){
        //return res.status(503).end();
        throw new TypeError();
    }
        
        
    }
        
        
        
    





    getReturnOrderById = async (id) => {
        //let id = req.params.id;
        try{
            let sql = "SELECT id, returnDate, restockOrderId, SKUId, description, price, RFID FROM RETURN_ORDERS WHERE id==? GROUP BY id, returnDate, restockOrderId, SKUId, description, price,RFID"
            let response = await this.dao.all(sql,id);
            if(response==null || response[0]==null){
                //return res.status(404).end();
                return {message: "Not Found"}; 
            }
        
            let result = {id: response[0].id, returnDate: response[0].returnDate, restockOrderId: response[0].restockOrderId};
        
            let products = response.map( (x)=>{
            
                delete x.id
                delete x.returnDate
                delete x.restockOrderId
                return x;
                
    }) ;
        result = {...result , products : products };   
        return result;
        //return res.status(200).json(result);
    }catch(error){
        //return res.status(500).end();
        throw new TypeError('');
    }

    }
    getReturnOrders = async () =>{
        try{
            let sql = "SELECT id, returnDate, restockOrderId FROM RETURN_ORDERS GROUP BY id, returnDate, restockOrderId";
            let result = await this.dao.all(sql);
            
            await Promise.all(result.map(async (x) => {
                    sql = "SELECT SKUId, description, price, RFID FROM RETURN_ORDERS WHERE id==? "
                    x.products = await this.dao.all(sql,x.id);
                    
                
            }));

        
        //return res.status(200).json(result);
        return result;
    }catch(error){
        //return res.status(500).end();
        throw new TypeError('');
    }
}
   
deleteReturnOrder = async (id) => {
   // let id = req.params.id;
    try{
        let sql = "DELETE FROM RETURN_ORDERS WHERE id==?";
        let _ = await this.dao.run(sql,id);

       // return res.status(204).end();
       return id;
    }catch(error){
        //return res.status(503).end();
        throw new TypeError();
    }
}
    

    

}

module.exports = ReturnOrderController;