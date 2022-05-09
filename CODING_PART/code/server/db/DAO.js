"use strict";

const sqlite = require('sqlite3');

class DAO {
    static db;
    constructor() {
        this.db = new sqlite.Database("ezwh_db", (err)=>{
            if(err) throw err;
        });

        //this.dropTableRO();
        this.newTableName();
        this.newTableRO();
        //this.dropTableIO();
        this.newTableIO();
        //this.dropTableRTO();
        this.newTableRTO();

    }

    dropTableIO() {
      return new Promise((res, rej) => {
          const sql = "DROP TABLE IF EXISTS INTERNAL_ORDERS";
          this.db.run(sql, (err)=>{
              if (err) {
                  rej(err);
                  return;
              }
              res(this.lastID);
          });
      });
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
  

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.run(sql, params, function (err) {
            if (err) {
              //console.log('Error running sql ' + sql)
              //console.log(err)
              reject(err)
            } else {
              resolve({ id: this.lastID })
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

    newTableName() {
      return new Promise((res, rej)=>{
          const sql = "CREATE TABLE IF NOT EXISTS USERS(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR UNIQUE, name VARCHAR, surname VARCHAR, password VARCHAR, type VARCHAR)";
          this.db.run(sql, (err)=>{
              if (err) {
                  rej(err);
                  return;
              }
              res(this.lastID);
          });
      });
  }
  newTableRO() {
    return new Promise((res, rej)=>{
        const sql = "CREATE TABLE IF NOT EXISTS RESTOCK_ORDERS(key INTEGER PRIMARY KEY AUTOINCREMENT, id INTEGER, issueDate DATE, state VARCHAR, supplierId INTEGER, deliveryDate DATE, SKUId INTEGER , description VARCHAR, price FLOAT, RFID VARCHAR)";
        this.db.run(sql, (err)=>{
            if (err) {
                rej(err);
                return;
            }
            res(this.lastID);
        });
    });
}

newTableRTO() {
  return new Promise((res, rej)=>{
      const sql = "CREATE TABLE IF NOT EXISTS RETURN_ORDERS(key INTEGER PRIMARY KEY AUTOINCREMENT, id INTEGER, returnDate DATE,restockOrderId  INTEGER, SKUId INTEGER , description VARCHAR, price FLOAT, RFID VARCHAR )";
      this.db.run(sql, (err)=>{
          if (err) {
              rej(err);
              return;
          }
          res(this.lastID);
      });
  });
}
newTableIO() {
  return new Promise((res, rej)=>{
      const sql = "CREATE TABLE IF NOT EXISTS INTERNAL_ORDERS(key INTEGER PRIMARY KEY AUTOINCREMENT, id INTEGER, issueDate DATE, state VARCHAR, customerId INTEGER, SKUId INTEGER , description VARCHAR, price FLOAT, RFID VARCHAR )";
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


module.exports = DAO;