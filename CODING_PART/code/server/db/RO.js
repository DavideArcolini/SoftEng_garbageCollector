"use strict";

const sqlite = require('sqlite3');

class DAORO {
    static db;
    constructor() {
        this.db = new sqlite.Database("ezwh_db", (err)=>{
            if(err) throw err;
        });

       // this.dropTableRO();
        //this.dropTableProductsRO();
        this.dropTableSkuItemRO();

        this.newTableRO();
        this.newTableProductsRO();
        //this.newTableSkuItemsRO();
    }
    dropTableRO() {
      return new Promise((res, rej) => {
          const sql = "DROP TABLE IF EXISTS RESTOCK_ORDERS";
          this.db.run(sql, (err)=>{
              if (err) {
                  rej(err);
                  return;
              }
              res(this.lastID);
          });
      });
  }
  dropTableProductsRO() {
    return new Promise((res, rej) => {
        const sql = "DROP TABLE IF EXISTS PRODUCTS_RO";
        this.db.run(sql, (err)=>{
            if (err) {
                rej(err);
                return;
            }
            res(this.lastID);
        });
    });
}
dropTableSkuItemRO() {
  return new Promise((res, rej) => {
      const sql = "DROP TABLE IF EXISTS SKUITEMS_RO";
      this.db.run(sql, (err)=>{
          if (err) {
              rej(err);
              return;
          }
          res(this.lastID);
      });
  });
}

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

    newTableRO() {
      return new Promise((res, rej)=>{
          const sql = "CREATE TABLE IF NOT EXISTS RESTOCK_ORDERS(id INTEGER PRIMARY KEY AUTOINCREMENT, issueDate DATE, state VARCHAR, supplierId INTEGER, deliveryDate DATE)";
          this.db.run(sql, (err)=>{
              if (err) {
                  rej(err);
                  return;
              }
              res(this.lastID);
          });
      });
  }

  newTableProductsRO() {
    return new Promise((res, rej)=>{
        const sql = "CREATE TABLE IF NOT EXISTS PRODUCTS_RO(id INTEGER PRIMARY KEY AUTOINCREMENT, ROId INTEGER, SKUId INTEGER , description VARCHAR, price FLOAT, RFID VARCHAR)";
        this.db.run(sql, (err)=>{
            if (err) {
                rej(err);
                return;
            }
            res(this.lastID);
        });
    });
}

newTableSkuItemsRO() {
  return new Promise((res, rej)=>{
      const sql = "CREATE TABLE IF NOT EXISTS SKUITEMS_RO(id INTEGER PRIMARY KEY AUTOINCREMENT, ROId INTEGER, SKUId INTEGER , RFID VARCHAR)";
      this.db.run(sql, (err)=>{
          if (err) {
              rej(err);
              return;
          }
          res(this.lastID);
      });
  });
}


}


module.exports = DAORO;