"use strict";
const dayjs = require( 'dayjs');

class RestockOrderController {
    constructor(daoro) {
        this.daoro = daoro
    }

    createRestockOrder = async (req, res) => {
        //let sql = "INSERT INTO RESTOCK_ORDERS(issueDate, state, supplierId) VALUES (?,?,?)";
        
        if (req.body.issueDate===undefined || req.body.supplierId===undefined ) {
            return res.status(422).json();           
          }
        
        let sql = "SELECT MAX(id) as id FROM RESTOCK_ORDERS"
        let max_id = await this.daoro.get(sql);
        let id=1;
        if(max_id.id!==null)
            id = max_id.id+1;
        console.log(id);
        let data = req.body;
        console.log("req body: " + JSON.stringify(req.body));
        //let response = await this.daoro.run(sql, [ data.issueDate, "ISSUED", data.supplierId])
        //console.log(`${response}`);
        for (const prod of req.body.products)
        {
            console.log(`${prod.SKUId} ${prod.description} ${prod.price} ${prod.qty}`)
            /*for (const i in prod.qty){
                console.log(i);
            sql = "INSERT INTO PRODUCTS_IO(IOId, SKUId, description, price) VALUES(?,?,?,?)"
            await this.daoio.run(sql,[response, prod.SKUId, prod.description, prod.price])}*/
            await Promise.all([...Array(prod.qty)].map(async () => {
                sql = "INSERT INTO RESTOCK_ORDERS(id, issueDate, state, supplierId, SKUId, description, price) VALUES(?,?,?,?,?,?,?)"
                await this.daoro.run(sql,[id, data.issueDate, "ISSUED", data.supplierId, prod.SKUId, prod.description, prod.price])
            }));

        }
        
        return res.status(201).json()
        
        
        
    }
  
   

    getRestockOrders = async (req, res) =>{
        let sql = "SELECT id, issueDate, state, supplierId, deliveryDate FROM RESTOCK_ORDERS GROUP BY id";
        let result = await this.daoro.all(sql);
        console.log(result.length);
        await Promise.all(result.map(async (x) => {
            sql = "SELECT id, SKUId, description, price, COUNT(*) as qty FROM RESTOCK_ORDERS WHERE id==? GROUP BY id, SKUId, description, price "
            x.products = await this.daoro.all(sql,x.id);
                //console.log(result.products.length);
            x.products = x.products.map( (x)=>{
                    //console.log(x.SKUId, x.description, x.price, x.qty);
                    
                    delete x.id
                    delete x.RFID
                    console.log(JSON.stringify(x));
                    return x;

            })
            sql = "SELECT SKUId, RFID FROM RESTOCK_ORDERS WHERE id==? AND RFID IS NOT NULL"
            x.skuItems = await this.daoro.all(sql,x.id);


            /*sql = "SELECT SKUId, description, price, qty FROM PRODUCTS_RO WHERE ROId==?"
            x.products = await this.daoro.all(sql,x.id);
            sql = "SELECT SKUId, RFID FROM SKUITEMS_RO WHERE ROId==?";
            x.skuItems = await this.daoro.all(sql,x.id);*/
            if(x.state==="ISSUED"){
                delete x.deliveryDate;
            }else{
                x.transportNote = {"deliveryDate" : x.deliveryDate};
                delete x.deliveryDate;
            }
            return x;
        }));
        return res.status(200).json(result);
    }

    getRestockOrdersIssued = async (req, res) =>{
        /*let sql = "SELECT id, issueDate, state, supplierId, deliveryDate, SKUId, description, price, COUNT(*) as qty FROM RESTOCK_ORDERS WHERE state==? GROUP BY id, issueDate, state, supplierId, deliveryDate, SKUId, description, price "
        let response = await this.daoro.all(sql,["ISSUED"]);
        console.log(JSON.stringify(response));
        if(response==null){
            return res.status(404).json();
        }*/
        
    
        let sql = "SELECT id, issueDate, state, supplierId, deliveryDate FROM RESTOCK_ORDERS WHERE state==? GROUP BY id";
        let result = await this.daoro.all(sql,["ISSUED"]);
        console.log(result.length);
        await Promise.all(result.map(async (x) => {
            sql = "SELECT id, SKUId, description, price, COUNT(*) as qty FROM RESTOCK_ORDERS WHERE id==? GROUP BY id, SKUId, description, price "
            x.products = await this.daoro.all(sql,x.id);
                //console.log(result.products.length);
            x.products = x.products.map( (x)=>{
                    //console.log(x.SKUId, x.description, x.price, x.qty);
                    
                    delete x.id
                    delete x.RFID
                    console.log(JSON.stringify(x));
                    return x;

            })
            sql = "SELECT SKUId, RFID FROM RESTOCK_ORDERS WHERE id==? AND RFID IS NOT NULL"
            x.skuItems = await this.daoro.all(sql,x.id);


            /*sql = "SELECT SKUId, description, price, qty FROM PRODUCTS_RO WHERE ROId==?"
            x.products = await this.daoro.all(sql,x.id);
            sql = "SELECT SKUId, RFID FROM SKUITEMS_RO WHERE ROId==?";
            x.skuItems = await this.daoro.all(sql,x.id);*/
            delete x.deliveryDate;
            /*else{
                x.transportNote = {"deliveryDate" : x.deliveryDate};
                delete x.deliveryDate;
            }*/
            return x;
        }));
        return res.status(200).json(result);
    }

    getRestockOrderById = async (req, res) => {
        let id = req.params.id;
        if(/^[0-9]+$/.test(id)===false){
            //console.log(typeof id);
            return res.status(422).json();
        }
        /*let sql = "SELECT * FROM RESTOCK_ORDERS WHERE id==?";
        let result = await this.daoro.get(sql,id);
        if(result==null){
            return res.status(404).json();
        }*/
        let sql = "SELECT id, issueDate, state, supplierId, SKUId, description, price, COUNT(*) as qty FROM RESTOCK_ORDERS WHERE id==? GROUP BY id, issueDate, state, supplierId, SKUId, description, price "
        let response = await this.daoro.all(sql,id);
        console.log(JSON.stringify(response));
        if(response==null){
            return res.status(404).json();
        }
       // let result = {id , response.issueDate, state , supplierId, products: [], skuItems :[] };
        let result = {id: response[0].id, issueDate: response[0].issueDate, state: response[0].state, supplierId: response[0].supplierId,  transportNote : {"deliveryDate" : response[0].deliveryDate}};
      
        console.log(JSON.stringify(result));
        let products = response.map( (x)=>{
            //console.log(x.SKUId, x.description, x.price, x.qty);

            delete x.id
            delete x.issueDate
            delete x.state
            delete x.supplierId
            delete x.RFID
            //delete x.deliveryDate
            console.log(JSON.stringify(x));
            return x;
            
}) ;
       result = {...result , products : products };   
        /*sql = "SELECT SKUId, description, price, qty FROM PRODUCTS_RO WHERE ROId==?"
        let products = await this.daoro.all(sql,id);
        sql = "SELECT SKUId, RFID FROM SKUITEMS_RO WHERE ROId==?";
        result.skuItems = await this.daoro.all(sql,id);*/
        sql = "SELECT SKUId, RFID FROM RESTOCK_ORDERS WHERE id==? AND RFID IS NOT NULL"
               // [..result, skuItems: result.skuItems = await this.daoro.all(sql,id);
                //console.log(result.products.length);
        result = {...result , skuItems : await this.daoro.all(sql,id) };
                
                    
           
        /*for(const i in products.length){
            products[i] = JSON.stringify(products[i]
        }*/
        if(result.state==="ISSUED"){
            delete result.transportNotee;
        }
        result.products = result.products.map((x)=> JSON.parse(JSON.stringify(x)));
        console.log("RESULT : "+ JSON.stringify(result))
        return res.status(200).json(result);
    }

    deleteRestockOrder = async (req, res) => {
        let id = req.params.id;
        if(/^[0-9]+$/.test(id)===false){
            //console.log(typeof id);
            return res.status(422).json();
        }
        let sql = "DELETE FROM RESTOCK_ORDERS WHERE id==?";
        let _ = await this.daoro.run(sql,id);
        /*sql = "DELETE FROM PRODUCTS_RO WHERE ROId==?";
        _ = await this.daoro.run(sql,id);*/
        /*sql = "DELETE FROM SKUITEMS_RO WHERE ROId==?";
        _ = await this.daoro.run(sql,id);*/
        return res.status(204).json();
    }
  
    modifyRestockOrderState = async(req,res) => {
        let id = req.params.id;
        if(/^[0-9]+$/.test(id)===false || req.body.newState===undefined){
            return res.status(422).json();
        }
        /*for(const prop in req){
            console.log(`${prop} = ${req.get(prop)}`)
        }*/
        console.log(`${req.body.newState}`);
        let sql = "SELECT * FROM RESTOCK_ORDERS WHERE id==?";
        let result = await this.daoro.get(sql,id);
        if(result==null){
            return res.status(404).json();
        }
        sql = "UPDATE RESTOCK_ORDERS SET state=? WHERE id==?";
        result = await this.daoro.run(sql,[req.body.newState,id]);
        return res.status(200).json();

}

    setSkuItems = async(req,res) => {
        let id = req.params.id;
        console.log(id);
        if(/^[0-9]+$/.test(id)===false || req.body.skuItems===undefined){
            return res.status(422).json();
        }
        let sql = "SELECT state FROM RESTOCK_ORDERS WHERE id==?";
        let result= await this.daoro.get(sql,[id]);
        if(result==null){
            return res.status(404).json();
        }

        if( result.state!=="DELIVERED") {
            return res.status(422).json();
        }
        for (const s of req.body.skuItems)
        {
            console.log(`${s.SKUId} ${s.rfid}`)
            /*sql = "INSERT INTO SKUITEMS_RO(ROId, SKUId,RFID) VALUES(?,?,?)"*/
            sql = "SELECT MIN(key) as min_id FROM RESTOCK_ORDERS WHERE id==? AND SKUId==? AND RFID IS NULL "
            let pid= await this.daoro.get(sql,[id,s.SKUId]);
            console.log(pid.min_id);
            sql = "UPDATE RESTOCK_ORDERS SET RFID=? WHERE SKUId==? AND id==? AND key == ?"
            console.log(JSON.stringify(s));
            await this.daoro.run(sql,[s.rfid, s.SKUId, id, pid.min_id])
           // await this.daoro.run(sql,[id,s.SKUId,s.rfid]);

        }

        return res.status(200).json();


    }

    addTransportNote = async(req,res) => {
        let id = req.params.id;
        console.log(id);
        if(/^[0-9]+$/.test(id)===false || req.body.transportNote===undefined){
            return res.status(422).json();
        }
        let sql = "SELECT state, issueDate FROM RESTOCK_ORDERS WHERE id==?";
        let result= await this.daoro.get(sql,[id]);
        console.log(result);
        if(result==null){
            return res.status(404).json();
        }

        if(result.state!=="DELIVERY" || dayjs(req.body.transportNote.deliveryDate).isBefore(dayjs(result.issueDate))) {
            return res.status(422).json();
        }
        console.log(`${req.body.transportNote.deliveryDate} `)
        sql = "UPDATE RESTOCK_ORDERS SET deliveryDate=? WHERE id==?"
        await this.daoro.run(sql,[req.body.transportNote.deliveryDate,id]);

        

        return res.status(200).json();


    }
    getReturnItems = async(req,res) => {
        let id = req.params.id;
        console.log(id);
        if(/^[0-9]+$/.test(id)===false || req.body.transportNote===undefined){
            return res.status(422).json();
        }
        return res.status(200).json();
    }


}

module.exports = RestockOrderController;