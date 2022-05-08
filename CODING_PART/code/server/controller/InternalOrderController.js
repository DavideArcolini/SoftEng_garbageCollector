"use strict";
const dayjs = require( 'dayjs');

class InternalOrderController {
    constructor(daoio) {
        this.daoio = daoio
    }

    createInternalOrder = async (req, res) => {
        let sql = "INSERT INTO INTERNAL_ORDERS(issueDate, state, customerId) VALUES (?,?,?)";
        
        if (req.body.issueDate===undefined || req.body.customerId===undefined ) {
            return res.status(422).json();           
          }
        let data = req.body;
        console.log("req body: " + JSON.stringify(req.body));
        let response = await this.daoio.run(sql, [ data.issueDate, "ISSUED", data.customerId])
        console.log(`${response}`);
        for (const prod of req.body.products)
        {
            console.log(`${prod.SKUId} ${prod.description} ${prod.price} ${prod.qty}`)
            /*for (const i in prod.qty){
                console.log(i);
            sql = "INSERT INTO PRODUCTS_IO(IOId, SKUId, description, price) VALUES(?,?,?,?)"
            await this.daoio.run(sql,[response, prod.SKUId, prod.description, prod.price])}*/
            await Promise.all([...Array(prod.qty)].map(async () => {
                sql = "INSERT INTO PRODUCTS_IO(IOId, SKUId, description, price) VALUES(?,?,?,?)"
                await this.daoio.run(sql,[response, prod.SKUId, prod.description, prod.price])
            }));

        }
        
       

        return res.status(201).json()
        
        
        
    }

    getInternalOrders = async (req, res) =>{
        let sql = "SELECT * FROM INTERNAL_ORDERS";
        let result = await this.daoio.all(sql);
        console.log(result.length);
        await Promise.all(result.map(async (x) => {
            if(x.state!=="COMPLETED"){
                sql = "SELECT IOId, SKUId, description, price, COUNT(*) as qty FROM PRODUCTS_IO WHERE IOId==? GROUP BY IOId, SKUId, description, price "
                x.products = await this.daoio.all(sql,x.id);
                //console.log(result.products.length);
                x.products = x.products.map( (x)=>{
                    //console.log(x.SKUId, x.description, x.price, x.qty);
                    
                    delete x.IOId
                    delete x.RFID
                    console.log(JSON.stringify(x));
                    return x;
                    
                })            
                /*result.products = await Promise.resolve([result.products].map((x) => {
                    delete x.IOId
                    delete x.RFID
                    console.log(JSON.stringify(x));
                }));*/
                
                
            }else{
                sql = "SELECT SKUId, description, price, RFID FROM PRODUCTS_IO WHERE IOId==?"
                x.products = await this.daoio.all(sql,x.id);
                
            }
        }));
        
        
        return res.status(200).json(result);
}
    getInternalOrdersIssued = async (req, res) =>{
        let sql = "SELECT * FROM INTERNAL_ORDERS WHERE state==?";
        let result = await this.daoio.all(sql,["ISSUED"]);
        console.log(result.length);
        await Promise.all(result.map(async (x) => {
                sql = "SELECT IOId, SKUId, description, price, COUNT(*) as qty FROM PRODUCTS_IO WHERE IOId==? GROUP BY IOId, SKUId, description, price "
                x.products = await this.daoio.all(sql,x.id);
                //console.log(result.products.length);
                x.products = x.products.map( (x)=>{
                    //console.log(x.SKUId, x.description, x.price, x.qty);
                    
                    delete x.IOId
                    delete x.RFID
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
        let sql = "SELECT * FROM INTERNAL_ORDERS WHERE state==?";
        let result = await this.daoio.all(sql,["ACCEPTED"]);
        console.log(result.length);
        await Promise.all(result.map(async (x) => {
                sql = "SELECT IOId, SKUId, description, price, COUNT(*) as qty FROM PRODUCTS_IO WHERE IOId==? GROUP BY IOId, SKUId, description, price "
                x.products = await this.daoio.all(sql,x.id);
                //console.log(result.products.length);
                x.products = x.products.map( (x)=>{
                    //console.log(x.SKUId, x.description, x.price, x.qty);
                    
                    delete x.IOId
                    delete x.RFID
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
        let sql = "SELECT * FROM INTERNAL_ORDERS WHERE id==?";
        let result = await this.daoio.get(sql,id);
        if(result==null){
            return res.status(404).json();
        }
        
        if(result.state!=="COMPLETED"){
            sql = "SELECT IOId, SKUId, description, price, COUNT(*) as qty FROM PRODUCTS_IO WHERE IOId==? GROUP BY IOId, SKUId, description, price "
            result.products = await this.daoio.all(sql,id);
            console.log(result.products.length);
            result.products = result.products.map( (x)=>{
                //console.log(x.SKUId, x.description, x.price, x.qty);
                
                delete x.IOId
                delete x.RFID
                console.log(JSON.stringify(x));
                return x;
                
            })            
          
            
        }else{
            sql = "SELECT SKUId, description, price, RFID FROM PRODUCTS_IO WHERE IOId==?"
            result.products = await this.daoio.all(sql,id);
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
                    sql = "SELECT MIN(id) as id FROM PRODUCTS_IO WHERE IOId==? AND SKUId==? AND RFID IS NULL "
                    let pid= await this.daoio.get(sql,[id,prod.SkuID]);
                    console.log(pid.id);
                    sql = "UPDATE PRODUCTS_IO SET RFID=? WHERE SKUId==? AND IOId==? AND id == ?"
                    console.log(JSON.stringify(prod));
                    await this.daoio.run(sql,[prod.RFID, prod.SkuID, id, pid.id])
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
    sql = "DELETE FROM PRODUCTS_IO WHERE IOId==?";
    _ = await this.daoio.run(sql,id);
    
    return res.status(204).json();
}
  
   

    

    

}

module.exports = InternalOrderController;