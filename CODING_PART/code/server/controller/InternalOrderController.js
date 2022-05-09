"use strict";
const dayjs = require( 'dayjs');

class InternalOrderController {
    constructor(daoio) {
        this.daoio = daoio
    }

    createInternalOrder = async (req, res) => {
        //let sql = "INSERT INTO INTERNAL_ORDERS(issueDate, state, customerId) VALUES (?,?,?)";
        
        if (req.body.issueDate===undefined || req.body.customerId===undefined ) {
            return res.status(422).json();           
          }
        let sql = "SELECT MAX(id) as id FROM INTERNAL_ORDERS"
        let max_id = await this.daoio.get(sql);
        let id=1;
        if(max_id.id!==null)
            id = max_id.id+1;
        console.log(id);
        let data = req.body;
        console.log("req body: " + JSON.stringify(req.body));
        //let response = await this.daoio.run(sql, [ data.issueDate, "ISSUED", data.customerId])
        //console.log(`${response}`);
        for (const prod of req.body.products)
        {
            console.log(`${prod.SKUId} ${prod.description} ${prod.price} ${prod.qty}`)
            /*for (const i in prod.qty){
                console.log(i);
            sql = "INSERT INTO PRODUCTS_IO(IOId, SKUId, description, price) VALUES(?,?,?,?)"
            await this.daoio.run(sql,[response, prod.SKUId, prod.description, prod.price])}*/
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
        console.log(result.length);
        await Promise.all(result.map(async (x) => {
            if(x.state!=="COMPLETED"){
                sql = "SELECT id, SKUId, description, price, COUNT(*) as qty FROM INTERNAL_ORDERS WHERE id==? GROUP BY id, SKUId, description, price "
                x.products = await this.daoio.all(sql,x.id);
                //console.log(result.products.length);
                x.products = x.products.map( (x)=>{
                    //console.log(x.SKUId, x.description, x.price, x.qty);
                    
                    delete x.id
                    //delete x.RFID
                    console.log(JSON.stringify(x));
                    return x;
                    
                })            
                /*result.products = await Promise.resolve([result.products].map((x) => {
                    delete x.IOId
                    delete x.RFID
                    console.log(JSON.stringify(x));
                }));*/
                
                
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
        console.log(result.length);
        await Promise.all(result.map(async (x) => {
            sql = "SELECT id, SKUId, description, price, COUNT(*) as qty FROM INTERNAL_ORDERS WHERE id==? GROUP BY id, SKUId, description, price "
                x.products = await this.daoio.all(sql,x.id);
                //console.log(result.products.length);
                x.products = x.products.map( (x)=>{
                    //console.log(x.SKUId, x.description, x.price, x.qty);
                    
                    delete x.id
                   // delete x.RFID
                    console.log(JSON.stringify(x));
                    return x;
                    
                })            
                /*result.products = await Promise.resolve([result.products].map((x) => {
                    delete x.IOId
                    delete x.RFID
                    console.log(JSON.stringify(x));
                }));*/
            
    }));
    
    
    return res.status(200).json(result);
}

    getInternalOrdersAccepted = async (req, res) =>{
        let sql = "SELECT id, issueDate, state, customerId FROM INTERNAL_ORDERS WHERE state==? GROUP BY id, issueDate, state, customerId ";
        let result = await this.daoio.all(sql,["ACCEPTED"]);
        console.log(result.length);
        await Promise.all(result.map(async (x) => {
             sql = "SELECT id, SKUId, description, price, COUNT(*) as qty FROM INTERNAL_ORDERS WHERE id==? GROUP BY id, SKUId, description, price "
                x.products = await this.daoio.all(sql,x.id);
                //console.log(result.products.length);
                x.products = x.products.map( (x)=>{
                    //console.log(x.SKUId, x.description, x.price, x.qty);
                    
                    delete x.id
                    //delete x.RFID
                    console.log(JSON.stringify(x));
                    return x;
                    
                })            
            
    }));


    return res.status(200).json(result);
    }


    getInternalOrderById = async (req, res) => {
        let id = req.params.id;
        if(/^[0-9]+$/.test(id)===false){
            //console.log(typeof id);
            return res.status(422).json();
        }
        /*let sql = "SELECT * FROM INTERNAL_ORDERS WHERE id==?";
        let result = await this.daoio.get(sql,id);
        if(result==null){
            return res.status(404).json();
        }*/

            let sql = "SELECT id, issueDate, state, customerId, SKUId, description, price, COUNT(*) as qty FROM INTERNAL_ORDERS WHERE id==? GROUP BY id, issueDate, state, customerId, SKUId, description, price "
            let response = await this.daoio.all(sql,id);
            console.log(response);
            if(response.length==0){
                return res.status(404).json();
            }
            //console.log(result.products.length);
            let result = {id: response[0].id, issueDate: response[0].issueDate, state: response[0].state, supplierId: response[0].customerId};
            if(result.state!=="COMPLETED"){
            let products = response.map( (x)=>{
                //console.log(x.SKUId, x.description, x.price, x.qty);
                
                delete x.id
                delete x.issueDate
                delete x.state
                delete x.customerId
                console.log(JSON.stringify(x));
                return x;
                
            }) 
            result = {...result , products : products }           
          
        } 
        else{
            sql = "SELECT SKUId, description, price, RFID FROM INTERNAL_ORDERS WHERE id==?"
            result = {...result , products : await this.daoio.all(sql,id)};
            return res.status(200).json(result);
        }
        //result.products = products.map((x)=> JSON.parse(JSON.stringify(x)));
        return res.status(200).json(result);
}

    modifyInternalOrderState = async(req,res) => {
        let id = req.params.id;
        if(/^[0-9]+$/.test(id)===false || req.body.newState===undefined || (req.body.newState==="COMPLETED" && req.body.products===undefined)){
            return res.status(422).json();
        }

        /*for(const prop in req){
            console.log(`${prop} = ${req.get(prop)}`)
        }*/
        console.log(`${req.body.newState}`);
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
                    console.log(pid.min_id);
                    sql = "UPDATE INTERNAL_ORDERS SET RFID=? WHERE SKUId==? AND id==? AND key == ?"
                    console.log(JSON.stringify(prod));
                    await this.daoio.run(sql,[prod.RFID, prod.SkuID, id, pid.min_id])
                }

            
        }
        return res.status(200).json();

}


deleteInternalOrder = async (req, res) => {
    let id = req.params.id;
    if(/^[0-9]+$/.test(id)===false){
        //console.log(typeof id);
        return res.status(422).json();
    }
    let sql = "DELETE FROM INTERNAL_ORDERS WHERE id==?";
    let _ = await this.daoio.run(sql,id);
   /* sql = "DELETE FROM PRODUCTS_IO WHERE IOId==?";
    _ = await this.daoio.run(sql,id);*/
    
    return res.status(204).json();
}
  
   

    

    

}

module.exports = InternalOrderController;