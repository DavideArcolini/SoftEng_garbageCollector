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

    createRestockOrder = async (issueDate,supplierId,products) => {

        try{
            let sql = "SELECT MAX(id) as id FROM RESTOCK_ORDERS"
            let max_id = await this.dao.get(sql);
            let id=1;
            if(max_id !==undefined && max_id.id!==null)
                id = max_id.id+1;
            //let data = req.body;
        
            products.forEach(async (prod)=>
            {
                await Promise.all([...Array(parseInt(prod.qty))].map(async () => {
                   
                    sql = "INSERT INTO RESTOCK_ORDERS(id, issueDate, state, supplierId, SKUId, description, price) VALUES(?,?,?,?,?,?,?)"
                    await this.dao.run(sql,[id, issueDate, "ISSUED", supplierId, prod.SKUId, prod.description, prod.price])
                }));

            })
            
            //return res.status(201).end();
            return id;
        }
        catch(error){
            //return res.status(503).end();
            throw error;

        }
        
        
        
    }
  
   

    getRestockOrders = async () =>{
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
            //return res.status(200).json(result);
            return result;
        }catch(error){
            //return res.status(500).end();
            throw error;
        }
    }

    getRestockOrdersIssued = async () =>{
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
            //return res.status(200).json(result);
            return result;
    }catch(error){
        //return res.status(500).end();
        throw error;
    }
    }

    getRestockOrderById = async (id) => {
        //let id = req.params.id;
            try{
            let sql = "SELECT id, issueDate, state, supplierId, SKUId, description, price, deliveryDate, COUNT(*) as qty FROM RESTOCK_ORDERS WHERE id==? GROUP BY id, issueDate, state, supplierId, SKUId, description, price "
            let response = await this.dao.all(sql,id);
            console.log(response);
            if(response ===undefined || response[0]==null){
                //return res.status(404).end();
                return {message: "Not Found"};
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
            result = {...result , products : Array.from(products) };   
            sql = "SELECT SKUId, RFID FROM RESTOCK_ORDERS WHERE id==? AND RFID IS NOT NULL"
            result = {...result , skuItems : await this.dao.all(sql,id) };

            if(result.state==="ISSUED"){
                delete result.transportNote;
            }
           // result.products = result.products.map((x)=> JSON.parse(JSON.stringify(x)));
            
            //return res.status(200).json(result);
            console.log(result);
            return result;
        }catch(error){
            //return res.status(503).end();
            throw error;
        }
      
    }

    deleteRestockOrder = async (id) => {
        //let id = req.params.id;
        try{
        let sql = "DELETE FROM RESTOCK_ORDERS WHERE id==?";
        let _ = await this.dao.run(sql,id);
        //return res.status(204).end();
        return id;
        }catch(error){
            //res.status(503).end();
            throw error;
        }
    }
  
    modifyRestockOrderState = async(id,newState) => {
        //let id = req.params.id;
        try{
            let sql = "SELECT * FROM RESTOCK_ORDERS WHERE id==?";
            let result = await this.dao.get(sql,id);
            if(result==null){
                return {message: "Not Found"};
            }
            sql = "UPDATE RESTOCK_ORDERS SET state=? WHERE id==?";
            result = await this.dao.run(sql,[newState,id]);
            return id;
           // return res.status(200).end();
        }catch(error){
           // return res.status(503).end();
            throw error;
        }

}

    setSkuItems = async(id,skuItems) => {
        //let id = req.params.id;

        try{
        let sql = "SELECT state FROM RESTOCK_ORDERS WHERE id==?";
        let result= await this.dao.get(sql,[id]);
        if(result==null){
            //return res.status(404).end();
            return {message: "Not Found"};
        }

        if( result.state!=="DELIVERED") {
            //return res.status(422).end();
            return {unprocessable: "Cannot put skuItems"}
        }
        for (const s of skuItems) {
            
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

        //return res.status(200).end();
        return id;
    }catch(error){
        //return res.status(503).end();
        throw error;
    }

    }

    addTransportNote = async(id,transportNote) => {
        //let id = req.params.id;
        try{
            let sql = "SELECT state, issueDate FROM RESTOCK_ORDERS WHERE id==?";
            let result= await this.dao.get(sql,[id]);
            if(result==null){
                //return res.status(404).end();
                console.log('here ok')
                return {message: "Not Found"}; 
            }

            if(result.state!=="DELIVERY" || dayjs(transportNote.deliveryDate).isBefore(dayjs(result.issueDate))) {
                //return res.status(422).end();
                return {unprocessable: "Cannot put transport note"}
            }
        
            sql = "UPDATE RESTOCK_ORDERS SET deliveryDate=? WHERE id==?"
            await this.dao.run(sql,[transportNote.deliveryDate,id]);

            //return res.status(200).end();
            return id;
        }catch(error){
            //return res.status(503).end();
            throw error;
        }

    }
    
    getReturnItems = async(id) => {
       // let id = req.params.id;
    
        try{
            let sql = "SELECT * FROM RESTOCK_ORDERS WHERE id==?";
            let result= await this.dao.get(sql,[id]);
            if(result==null){
                //return res.status(404).end();
                return {message: "Not Found"}; 
            }

            if(result.state!=="COMPLETEDRETURN") {
                //return res.status(422).end();
                return {unprocessable: "Cannot get return Items"}
            }

            sql = "SELECT SKUId, RFID FROM RESTOCK_ORDERS WHERE id==? AND RFID IS NOT NULL"
            result = await this.dao.all(sql,id) ;
            
            result = await result.filter(async (x)=>{
                
                sql = "SELECT rfid, Result FROM TEST_RESULTS WHERE rfid==?"
                
                let TestResults = await this.dao.all(sql,[x.RFID]);
                

                if(TestResults!==undefined && TestResults.filter((x)=>x.Result==false).length!=0 ){
                    return x;
                }
               
            })
            
            

            //return res.status(200).json(result);
            if(result==null){
                return []
            }
            return result;
    }catch(error){
        //return res.status(500).end();
        throw error;
    }
    }


}

module.exports = RestockOrderController;