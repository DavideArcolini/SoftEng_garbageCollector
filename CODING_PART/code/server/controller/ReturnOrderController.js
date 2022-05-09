"use strict";
const dayjs = require( 'dayjs');

class ReturnOrderController {
    constructor(daorto) {
        this.daorto = daorto
    }

    createReturnOrder = async (req, res) => {
        //let sql = "INSERT INTO RETURN_ORDERS(returnDate, restockOrderId) VALUES (?,?)";
        //console.log("I AM HERE");
        if (req.body.returnDate===undefined || req.body.restockOrderId===undefined ) {
            return res.status(422).json();           
          }
        let sql = "SELECT MAX(id) as id FROM RETURN_ORDERS"
        let max_id = await this.daorto.get(sql);
        let id=1;
        if(max_id.id!==null)
            id = max_id.id+1;
        console.log(id);
        let data = req.body;
        console.log("req body: " + JSON.stringify(req.body));
        //let response = await this.daorto.run(sql, [ data.returnDate,  data.restockOrderId])
        //console.log(`${response}`);
        for (const prod of req.body.products)
        {
            console.log(`${prod.SKUId} ${prod.description} ${prod.price} ${prod.qty}`)
            /*for (const i in prod.qty){
                console.log(i);
            sql = "INSERT INTO PRODUCTS_IO(IOId, SKUId, description, price) VALUES(?,?,?,?)"
            await this.daoio.run(sql,[response, prod.SKUId, prod.description, prod.price])}*/
           // await Promise.all([...Array(prod.qty)].map(async () => {
                sql = "INSERT INTO RETURN_ORDERS(id, returnDate, restockOrderId, SKUId, description, price, RFID) VALUES(?,?,?,?,?,?,?)"
                await this.daorto.run(sql,[id, data.returnDate,  data.restockOrderId, prod.SKUId, prod.description, prod.price, prod.RFID])
            //}));

        }
        
       
        
        return res.status(201).json()
        
        
        
    }
        
        
        
    





    getReturnOrderById = async (req, res) => {
        let id = req.params.id;
        if(/^[0-9]+$/.test(id)===false){
            //console.log(typeof id);
            return res.status(422).json();
        }
        /*let sql = "SELECT * FROM RETURN_ORDERS WHERE id==?";
        let result = await this.daorto.get(sql,id);
        if(result==null){
            return res.status(404).json();
        }
        
        sql = "SELECT SKUId, description, price, RFID FROM PRODUCTS_RTO WHERE RTOId==? "
        result.products = await this.daorto.all(sql,id);*/
          
        let sql = "SELECT id, returnDate, restockOrderId, SKUId, description, price, RFID FROM RETURN_ORDERS WHERE id==? GROUP BY id, returnDate, restockOrderId, SKUId, description, price,RFID"
        let response = await this.daorto.all(sql,id);
        console.log(JSON.stringify(response));
        if(response==null){
            return res.status(404).json();
        }
       // let result = {id , response.issueDate, state , supplierId, products: [], skuItems :[] };
        let result = {id: response[0].id, returnDate: response[0].returnDate, restockOrderId: response[0].restockOrderId};
      
        console.log(JSON.stringify(result));
        let products = response.map( (x)=>{
            //console.log(x.SKUId, x.description, x.price, x.qty);

            delete x.id
            delete x.returnDate
            delete x.restockOrderId
            console.log(JSON.stringify(x));
            return x;
            
}) ;
       result = {...result , products : products };   
        /*sql = "SELECT SKUId, description, price, qty FROM PRODUCTS_RO WHERE ROId==?"
        let products = await this.daoro.all(sql,id);
        sql = "SELECT SKUId, RFID FROM SKUITEMS_RO WHERE ROId==?";
        result.skuItems = await this.daoro.all(sql,id);*/
        //sql = "SELECT SKUId, RFID FROM RESTOCK_ORDERS WHERE id==? AND RFID IS NOT NULL"
            
        
        //result.products = products.map((x)=> JSON.parse(JSON.stringify(x)));
        return res.status(200).json(result);
    }
    getReturnOrders = async (req, res) =>{
        let sql = "SELECT id, returnDate, restockOrderId FROM RETURN_ORDERS GROUP BY id, returnDate, restockOrderId";
        let result = await this.daorto.all(sql);
        console.log(result.length);
        await Promise.all(result.map(async (x) => {
                sql = "SELECT SKUId, description, price, RFID FROM RETURN_ORDERS WHERE id==? "
                x.products = await this.daorto.all(sql,x.id);
                //console.log(result.products.length);
               
        }));

        
        return res.status(200).json(result);
}
   
deleteReturnOrder = async (req, res) => {
    let id = req.params.id;
    if(/^[0-9]+$/.test(id)===false){
        //console.log(typeof id);
        return res.status(422).json();
    }
    let sql = "DELETE FROM RETURN_ORDERS WHERE id==?";
    let _ = await this.daorto.run(sql,id);
    /*sql = "DELETE FROM PRODUCTS_RTO WHERE RTOId==?";
    _ = await this.daorto.run(sql,id);*/
    
    return res.status(204).json();
}
    

    

}

module.exports = ReturnOrderController;