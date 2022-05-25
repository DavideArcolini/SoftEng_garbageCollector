"use strict";
const dayjs = require( 'dayjs');


class InternalOrderController {
    constructor(dao) {
        this.dao = dao
    }

    createInternalOrder = async (issueDate,products,customerId) => {
       
        if (issueDate===undefined || customerId===undefined ) {
            return res.status(422).end();           
        }
        try{
        let sql = "SELECT MAX(id) as id FROM INTERNAL_ORDERS"
        let max_id = await this.dao.get(sql);
        
        let id=1;
        if(max_id !==null && max_id.id!==null)
            id = max_id.id+1;
       
        
       // let data = req.body;
        
        for (const prod of products)
        {
           
            await Promise.all([...Array(parseInt(prod.qty))].map(async () => {
                sql = "INSERT INTO INTERNAL_ORDERS(id, issueDate, state, customerId, SKUId, description, price) VALUES(?,?,?,?,?,?,?)"
                await this.dao.run(sql,[id, issueDate,"ISSUED", customerId, prod.SKUId, prod.description, prod.price])
            }));

        }

        //return res.status(201).end()
       
        return id;
    }catch(error){
        //return res.status(500).end();
        throw error;
    }
        
        
    }

    getInternalOrders = async () =>{
        try{
        let sql = "SELECT id, issueDate, state, customerId FROM INTERNAL_ORDERS GROUP BY id, issueDate, state, customerId";
        let result = await this.dao.all(sql);
        await Promise.all(result.map(async (x) => {
            if(x.state!=="COMPLETED"){
                sql = "SELECT id, SKUId, description, price, COUNT(*) as qty FROM INTERNAL_ORDERS WHERE id==? GROUP BY id, SKUId, description, price "
                x.products = await this.dao.all(sql,x.id);
                
                x.products = x.products.map( (x)=>{
                    
                    
                    delete x.id
                    delete x.RFID
                    return x;
                    
                })            
                
                
            }else{
                sql = "SELECT SKUId, description, price, RFID FROM INTERNAL_ORDERS WHERE id==?"
                x.products = await this.dao.all(sql,x.id);
                
            }
        }));
        
        
        //return res.status(200).json(result);
        return result;
    }catch(error){
        //return res.status(500).end();
        throw error;
    }
}
    getInternalOrdersIssued = async () =>{
        try{
            let sql = "SELECT id, issueDate, state, customerId FROM INTERNAL_ORDERS WHERE state==? GROUP BY id, issueDate, state, customerId";
            let result = await this.dao.all(sql,["ISSUED"]);
           
            await Promise.all(result.map(async (x) => {
                sql = "SELECT id, SKUId, description, price, COUNT(*) as qty FROM INTERNAL_ORDERS WHERE id==? GROUP BY id, SKUId, description, price "
                   
                    x.products = await this.dao.all(sql,x.id);
                   
                    x.products = x.products.map( (x)=>{
                    
                        delete x.id
                        return x;
                        
                    })            
                    
                
        }));
        
        
        //return res.status(200).json(result);
        return result;
    }catch(error){
        //return res.status(500).end();
        throw error;
    }
}

    getInternalOrdersAccepted = async (req, res) =>{
        try{
        let sql = "SELECT id, issueDate, state, customerId FROM INTERNAL_ORDERS WHERE state==? GROUP BY id, issueDate, state, customerId ";
        let result = await this.dao.all(sql,["ACCEPTED"]);
        await Promise.all(result.map(async (x) => {
             sql = "SELECT id, SKUId, description, price, COUNT(*) as qty FROM INTERNAL_ORDERS WHERE id==? GROUP BY id, SKUId, description, price "
                x.products = await this.dao.all(sql,x.id);
                x.products = x.products.map( (x)=>{
                   
                    delete x.id
                    return x;
                    
                })            
            
    }));


   // return res.status(200).json(result);
   return result;
    }catch(error){
        //return res.status(500).end();
        throw error;
    }
 }

    getInternalOrderById = async (id) => {
        //let id = req.params.id;
        try{
            let sql = "SELECT id, issueDate, state, customerId, SKUId, description, price, COUNT(*) as qty FROM INTERNAL_ORDERS WHERE id==? GROUP BY id, issueDate, state, customerId, SKUId, description, price "
            let response = await this.dao.all(sql,id);
            if(response.length==0){
                //return res.status(404).json();
                return {message: "Not Found"}; 
            }
            
            let result = {id: response[0].id, issueDate: response[0].issueDate, state: response[0].state,customerId: response[0].customerId};
            if(result.state!=="COMPLETED"){
            let products = response.map( (x)=>{
                
                delete x.id
                delete x.issueDate
                delete x.state
                delete x.customerId
                
                return x;
                
            }) 
            result = {...result , products : products }           
            
            } 
            else{

                sql = "SELECT SKUId, description, price, RFID FROM INTERNAL_ORDERS WHERE id==?"
                result = {...result , products : await this.dao.all(sql,id)};
                return result;
            }
            
            //return res.status(200).json(result);
            return result;
        }catch(error){
            //return res.status(500).end();
            throw error;
        }
}

    modifyInternalOrderState = async(id,newState,products) => {
        //let id = req.params.id;
        try{
            let sql = "SELECT * FROM INTERNAL_ORDERS WHERE id==?";
            let result = await this.dao.get(sql,id);
            if(result==null){
               // return res.status(404).end();
               return {message: "Not Found"}; 
            }

            sql = "UPDATE INTERNAL_ORDERS SET state=? WHERE id==?";
            result = await this.dao.run(sql,[newState,id]);
            if(newState === "COMPLETED"){
                    for(const prod of products){
                        sql = "SELECT MIN(key) as min_id  FROM INTERNAL_ORDERS WHERE id==? AND SKUId==? AND RFID IS NULL "
                        let pid= await this.dao.get(sql,[id,prod.SkuID]);
                        sql = "UPDATE INTERNAL_ORDERS SET RFID=? WHERE SKUId==? AND id==? AND key == ?"
                        await this.dao.run(sql,[prod.RFID, prod.SkuID, id, pid.min_id])
                    }

                
            }
            //return res.status(200).end();
            return id;
    }catch(error){
        //return res.status(503).end();
        throw error;
    }

}


deleteInternalOrder = async (id) => {
    //let id = req.params.id;
    try{
        let sql = "DELETE FROM INTERNAL_ORDERS WHERE id==?";
        let _ = await this.dao.run(sql,id);
        
        //return res.status(204).end();
        return id;
    }catch(error){
        //return res.status(500).end();
        throw error;
    }
}
  
   

    

    

}

module.exports = InternalOrderController;