"use strict";
const dayjs = require( 'dayjs');

class InternalOrderController {
    constructor(daoio) {
        this.daoio = daoio
    }

    createInternalOrder = async (req, res) => {
       
        if (req.body.issueDate===undefined || req.body.customerId===undefined ) {
            return res.status(422).json();           
          }
        let sql = "SELECT MAX(id) as id FROM INTERNAL_ORDERS"
        let max_id = await this.daoio.get(sql);
        let id=1;
        if(max_id.id!==null)
            id = max_id.id+1;
        
        let data = req.body;
        
        for (const prod of req.body.products)
        {
            
            await Promise.all([...Array(prod.qty)].map(async () => {
                sql = "INSERT INTO INTERNAL_ORDERS(id, issueDate, state, customerId, SKUId, description, price) VALUES(?,?,?,?,?,?,?)"
                await this.daoio.run(sql,[id, data.issueDate,"ISSUED", data.customerId, prod.SKUId, prod.description, prod.price])
            }));

        }

    
        
       

        return res.status(201).json()
        
        
        
    }

    getInternalOrders = async (req, res) =>{
        let sql = "SELECT id, issueDate, state, customerId FROM INTERNAL_ORDERS GROUP BY id, issueDate, state, customerId";
        let result = await this.daoio.all(sql);

        await Promise.all(result.map(async (x) => {
            if(x.state!=="COMPLETED"){
                sql = "SELECT id, SKUId, description, price, COUNT(*) as qty FROM INTERNAL_ORDERS WHERE id==? GROUP BY id, SKUId, description, price "
                x.products = await this.daoio.all(sql,x.id);
                
                x.products = x.products.map( (x)=>{
                    
                    
                    delete x.id
                    return x;
                    
                })            
                
                
            }else{
                sql = "SELECT SKUId, description, price, RFID FROM INTERNAL_ORDERS WHERE id==?"
                x.products = await this.daoio.all(sql,x.id);
                
            }
        }));
        
        
        return res.status(200).json(result);
}
    getInternalOrdersIssued = async (req, res) =>{
        let sql = "SELECT id, issueDate, state, customerId FROM INTERNAL_ORDERS WHERE state==? GROUP BY id, issueDate, state, customerId";
        let result = await this.daoio.all(sql,["ISSUED"]);
        await Promise.all(result.map(async (x) => {
            sql = "SELECT id, SKUId, description, price, COUNT(*) as qty FROM INTERNAL_ORDERS WHERE id==? GROUP BY id, SKUId, description, price "
                x.products = await this.daoio.all(sql,x.id);
                x.products = x.products.map( (x)=>{
                  
                    delete x.id
                    return x;
                    
                })            
                
            
    }));
    
    
    return res.status(200).json(result);
}

    getInternalOrdersAccepted = async (req, res) =>{
        let sql = "SELECT id, issueDate, state, customerId FROM INTERNAL_ORDERS WHERE state==? GROUP BY id, issueDate, state, customerId ";
        let result = await this.daoio.all(sql,["ACCEPTED"]);
        
        await Promise.all(result.map(async (x) => {
             sql = "SELECT id, SKUId, description, price, COUNT(*) as qty FROM INTERNAL_ORDERS WHERE id==? GROUP BY id, SKUId, description, price "
                x.products = await this.daoio.all(sql,x.id);
                
                x.products = x.products.map( (x)=>{
                   
                    delete x.id
                    return x;
                    
                })            
            
    }));


    return res.status(200).json(result);
    }


    getInternalOrderById = async (req, res) => {
        let id = req.params.id;
        if(/^[0-9]+$/.test(id)===false){
            return res.status(422).json();
        }
 
        let sql = "SELECT id, issueDate, state, customerId, SKUId, description, price, COUNT(*) as qty FROM INTERNAL_ORDERS WHERE id==? GROUP BY id, issueDate, state, customerId, SKUId, description, price "
        let response = await this.daoio.all(sql,id);
        console.log(response);
        if(response.length==0){
            return res.status(404).json();
        }
           
        let result = {id: response[0].id, issueDate: response[0].issueDate, state: response[0].state, supplierId: response[0].customerId};
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
            result = {...result , products : await this.daoio.all(sql,id)};
            return res.status(200).json(result);
        }
        
        return res.status(200).json(result);
}

    modifyInternalOrderState = async(req,res) => {
        let id = req.params.id;
        if(/^[0-9]+$/.test(id)===false || req.body.newState===undefined || (req.body.newState==="COMPLETED" && req.body.products===undefined)){
            return res.status(422).json();
        }

        let sql = "SELECT * FROM INTERNAL_ORDERS WHERE id==?";
        let result = await this.daoio.get(sql,id);
        if(result==null){
            return res.status(404).json();
        }

        sql = "UPDATE INTERNAL_ORDERS SET state=? WHERE id==?";
        result = await this.daoio.run(sql,[req.body.newState,id]);
        if(req.body.newState === "COMPLETED"){
                for(const prod of req.body.products){
                    sql = "SELECT MIN(key) as min_id  FROM INTERNAL_ORDERS WHERE id==? AND SKUId==? AND RFID IS NULL "
                    let pid= await this.daoio.get(sql,[id,prod.SkuID]);
                    sql = "UPDATE INTERNAL_ORDERS SET RFID=? WHERE SKUId==? AND id==? AND key == ?"
                    await this.daoio.run(sql,[prod.RFID, prod.SkuID, id, pid.min_id])
                }

            
        }
        return res.status(200).json();

}


deleteInternalOrder = async (req, res) => {
    let id = req.params.id;
    if(/^[0-9]+$/.test(id)===false){
        return res.status(422).json();
    }
    let sql = "DELETE FROM INTERNAL_ORDERS WHERE id==?";
    let _ = await this.daoio.run(sql,id);
    
    return res.status(204).json();
}
  
   

    

    

}

module.exports = InternalOrderController;