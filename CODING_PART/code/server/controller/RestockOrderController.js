"use strict";
const dayjs = require( 'dayjs');

/* SOME ERROR MESSAGES HERE */
const ERROR_400 = {error: 'Bad request'};
const ERROR_404 = {error: '404 Not Found'};
const ERROR_422 = {error: 'Unprocessable Entity'};
const ERROR_500 = {error: 'Internal Server Error'};
const ERROR_503 = {error: 'Service Unavailable'};


class RestockOrderController {
    constructor(dao) {
        this.dao = dao
    }

    createRestockOrder = async (req, res) => {

        if (req.body.issueDate===undefined || req.body.supplierId===undefined || req.body.products===undefined ) {
            return res.status(422).end();           
          }
        try{
            let sql = "SELECT MAX(id) as id FROM RESTOCK_ORDERS"
            let max_id = await this.dao.get(sql);
            let id=1;
            if(max_id.id!==null)
                id = max_id.id+1;
            let data = req.body;
        
            req.body.products.forEach(async (prod)=>
            {
                await Promise.all([...Array(parseInt(prod.qty))].map(async () => {
                   
                    sql = "INSERT INTO RESTOCK_ORDERS(id, issueDate, state, supplierId, SKUId, description, price) VALUES(?,?,?,?,?,?,?)"
                    await this.dao.run(sql,[id, data.issueDate, "ISSUED", data.supplierId, prod.SKUId, prod.description, prod.price])
                }));

            })
            
            return res.status(201).end();
        }
        catch(error){
            return res.status(503).end();

        }
        
        
        
    }
  
   

    getRestockOrders = async (req, res) =>{
        try{
            let sql = "SELECT id, issueDate, state, supplierId, deliveryDate FROM RESTOCK_ORDERS GROUP BY id";
            let result = await this.dao.all(sql);
            await Promise.all(result.map(async (x) => {
                sql = "SELECT id, SKUId, description, price, COUNT(*) as qty FROM RESTOCK_ORDERS WHERE id==? GROUP BY id, SKUId, description, price "
                x.products = await this.dao.all(sql,x.id);
                x.products = x.products.map( (x)=>{
                        delete x.id
                        return x;

                })
                sql = "SELECT SKUId, RFID FROM RESTOCK_ORDERS WHERE id==? AND RFID IS NOT NULL"
                x.skuItems = await this.dao.all(sql,x.id);

                if(x.state==="ISSUED"){
                    delete x.deliveryDate;
                }else{
                    x.transportNote = {"deliveryDate" : x.deliveryDate};
                    delete x.deliveryDate;
                }
                return x;
            }));
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).end();
        }
    }

    getRestockOrdersIssued = async (req, res) =>{
        try{
            let sql = "SELECT id, issueDate, state, supplierId, deliveryDate FROM RESTOCK_ORDERS WHERE state==? GROUP BY id";
            let result = await this.dao.all(sql,["ISSUED"]);
            await Promise.all(result.map(async (x) => {
                sql = "SELECT id, SKUId, description, price, COUNT(*) as qty FROM RESTOCK_ORDERS WHERE id==? GROUP BY id, SKUId, description, price "
                x.products = await this.dao.all(sql,x.id);
                
                x.products = x.products.map( (x)=>{
                    
                        delete x.id
                        delete x.RFID
                        return x;

                })
                sql = "SELECT SKUId, RFID FROM RESTOCK_ORDERS WHERE id==? AND RFID IS NOT NULL"
                x.skuItems = await this.dao.all(sql,x.id);

                delete x.deliveryDate;

                return x;
            }));
            return res.status(200).json(result);
    }catch(error){
        return res.status(500).end();
    }
    }

    getRestockOrderById = async (req, res) => {
        let id = req.params.id;
        if(/^[0-9]+$/.test(id)===false){
            return res.status(422).end();
        }
            try{
            let sql = "SELECT id, issueDate, state, supplierId, SKUId, description, price, deliveryDate, COUNT(*) as qty FROM RESTOCK_ORDERS WHERE id==? GROUP BY id, issueDate, state, supplierId, SKUId, description, price "
            let response = await this.dao.all(sql,id);
            
            if(response[0]==null){
                return res.status(404).end();
            }
            
            let result = {id: response[0].id, issueDate: response[0].issueDate, state: response[0].state, supplierId: response[0].supplierId,  transportNote : {"deliveryDate" : response[0].deliveryDate}};
        
            let products = response.map( (x)=>{
                delete x.id
                delete x.issueDate
                delete x.state
                delete x.supplierId
                delete x.deliveryDate
                delete x.RFID
                
                return x;
                
    }) ;
            result = {...result , products : products };   
            sql = "SELECT SKUId, RFID FROM RESTOCK_ORDERS WHERE id==? AND RFID IS NOT NULL"
            result = {...result , skuItems : await this.dao.all(sql,id) };

            if(result.state==="ISSUED"){
                delete result.transportNote;
            }
            result.products = result.products.map((x)=> JSON.parse(JSON.stringify(x)));
            
            return res.status(200).json(result);
        }catch(error){
            return res.status(503).end();
        }
      
    }

    deleteRestockOrder = async (req, res) => {
        let id = req.params.id;
        if(/^[0-9]+$/.test(id)===false){
            return res.status(422).json();
        }
        try{
        let sql = "DELETE FROM RESTOCK_ORDERS WHERE id==?";
        let _ = await this.dao.run(sql,id);
        return res.status(204).end();
        }catch(error){
            res.status(503).end();
        }
    }
  
    modifyRestockOrderState = async(req,res) => {
        let id = req.params.id;
        if(/^[0-9]+$/.test(id)===false || req.body.newState===undefined){
            return res.status(422).end();
        }
        try{
            let sql = "SELECT * FROM RESTOCK_ORDERS WHERE id==?";
            let result = await this.dao.get(sql,id);
            if(result==null){
                return res.status(404).end();
            }
            sql = "UPDATE RESTOCK_ORDERS SET state=? WHERE id==?";
            result = await this.dao.run(sql,[req.body.newState,id]);
            return res.status(200).end();
        }catch(error){
            return res.status(503).end();
        }

}

    setSkuItems = async(req,res) => {
        let id = req.params.id;
       
        if(/^[0-9]+$/.test(id)===false || req.body.skuItems===undefined){
            return res.status(422).end();
        }
        try{
        let sql = "SELECT state FROM RESTOCK_ORDERS WHERE id==?";
        let result= await this.dao.get(sql,[id]);
        if(result==null){
            return res.status(404).end();
        }

        if( result.state!=="DELIVERED") {
            return res.status(422).end();
        }
        for (const s of req.body.skuItems) {
            
            sql = `
                SELECT MIN(key) as min_id 
                FROM RESTOCK_ORDERS 
                WHERE id = (?) AND SKUId = (?) AND RFID IS NULL `
            let pid= await this.dao.get(sql,[id,s.SKUId]);
            
            sql = `
                UPDATE RESTOCK_ORDERS 
                SET RFID = (?) 
                WHERE SKUId = (?) AND id = (?) AND key = (?)`
            await this.dao.run(sql,[s.rfid, s.SKUId, id, pid.min_id])
           
        }

        return res.status(200).end();
    }catch(error){
        return res.status(503).end();
    }

    }

    addTransportNote = async(req,res) => {
        let id = req.params.id;
        if(/^[0-9]+$/.test(id)===false || req.body.transportNote===undefined){
            return res.status(422).end();
        }
        try{
            let sql = "SELECT state, issueDate FROM RESTOCK_ORDERS WHERE id==?";
            let result= await this.dao.get(sql,[id]);
            if(result==null){
                return res.status(404).end();
            }

            if(result.state!=="DELIVERY" || dayjs(req.body.transportNote.deliveryDate).isBefore(dayjs(result.issueDate))) {
                return res.status(422).end();
            }
        
            sql = "UPDATE RESTOCK_ORDERS SET deliveryDate=? WHERE id==?"
            await this.dao.run(sql,[req.body.transportNote.deliveryDate,id]);

            return res.status(200).end();
        }catch(error){
            return res.status(503).end();
        }

    }
    
    getReturnItems = async(req,res) => {
        let id = req.params.id;
    
        if(/^[0-9]+$/.test(id)===false){
            return res.status(422).end();
        }
        try{
            let sql = "SELECT * FROM RESTOCK_ORDERS WHERE id==?";
            let result= await this.dao.get(sql,[id]);
            if(result==null){
                return res.status(404).end();
            }

            if(result.state!=="COMPLETEDRETURN") {
                return res.status(422).end();
            }

            sql = "SELECT SKUId, RFID FROM RESTOCK_ORDERS WHERE id==? AND RFID IS NOT NULL"
            result = await this.dao.all(sql,id) ;
            
            result = await result.filter(async (x)=>{
                
                sql = "SELECT rfid, Result FROM TEST_RESULTS WHERE rfid==?"
                
                let TestResults = await this.dao.all(sql,[x.RFID]);
                

                if(TestResults.filter((x)=>x.Result==false).length!=0 ){
                    return x;
                }
               
            })
            
            

            return res.status(200).json(result);
    }catch(error){
        return res.status(500).end();
    }
    }


}

module.exports = RestockOrderController;