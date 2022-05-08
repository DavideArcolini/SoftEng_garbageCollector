"use strict";

const sqlite = require('sqlite3');

class DAORTO {
    static db;
    constructor() {
        this.db = new sqlite.Database("ezwh_db", (err)=>{
            if(err) throw err;
        });

        //this.dropTableRTO();
        //this.dropTableProductsIO();
        //this.dropTableSkuItemIO();
        this.newTableRTO();
        this.newTableProductsRTO();
        //this.newTableSkuItemsIO();
       
    }
    dropTableRTO() {
      return new Promise((res, rej) => {
          const sql = "DROP TABLE IF EXISTS RETURN_ORDERS";
          this.db.run(sql, (err)=>{
              if (err) {
                  rej(err);
                  return;
              }
              res(this.lastID);
          });
      });
  }
  dropTableProductsRTO() {
    return new Promise((res, rej) => {
        const sql = "DROP TABLE IF EXISTS PRODUCTS_RTO";
        this.db.run(sql, (err)=>{
            if (err) {
                rej(err);
                return;
            }
            res(this.lastID);
        });
    });
}

/*dropTableSkuItemIO() {
    return new Promise((res, rej) => {
        const sql = "DROP TABLE IF EXISTS SKUITEMS_IO";
        this.db.run(sql, (err)=>{
            if (err) {
                rej(err);
                return;
            }
            res(this.lastID);
        });
    });
  }*/
  


    run(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.run(sql, params, function (err) {
            if (err) {
              reject(503)
            } else {
              resolve(this.lastID);
            }
          })
        })
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.get(sql, params, (err, result) => {
            if (err) {
              console.log('Error running sql: ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve(result)
            }
          })
        })
    }
    
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.all(sql, params, (err, rows) => {
            if (err) {
              console.log('Error running sql: ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve(rows)
            }
          })
        })
    }

    newTableRTO() {
      return new Promise((res, rej)=>{
          const sql = "CREATE TABLE IF NOT EXISTS RETURN_ORDERS(id INTEGER PRIMARY KEY AUTOINCREMENT, returnDate DATE,restockOrderId  INTEGER )";
          this.db.run(sql, (err)=>{
              if (err) {
                  rej(err);
                  return;
              }
              res(this.lastID);
          });
      });
  }

  newTableProductsRTO() {
    return new Promise((res, rej)=>{
        const sql = "CREATE TABLE IF NOT EXISTS PRODUCTS_RTO(id INTEGER PRIMARY KEY AUTOINCREMENT, RTOId INTEGER, SKUId INTEGER , description VARCHAR, price FLOAT, RFID VARCHAR)";
        this.db.run(sql, (err)=>{
            if (err) {
                rej(err);
                return;
            }
            res(this.lastID);
        });
    });
}

/*newTableSkuItemsIO() {
  return new Promise((res, rej)=>{
      const sql = "CREATE TABLE IF NOT EXISTS SKUITEMS_IO(id INTEGER PRIMARY KEY AUTOINCREMENT, IOId INTEGER, SKUId INTEGER , RFID VARCHAR)";
      this.db.run(sql, (err)=>{
          if (err) {
              rej(err);
              return;
          }
          res(this.lastID);
      });
  });
}*/


}


module.exports = DAORTO;