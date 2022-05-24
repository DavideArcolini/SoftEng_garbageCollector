"use strict";

const sqlite = require('sqlite3');
const bcrypt        = require('bcrypt');
const saltRounds    = 10;

class DAO {
    static db;
    constructor() {
        this.db = new sqlite.Database("ezwh.db", (err)=>{
            if(err) throw err;
        });

        /* ----- TABLES CREATION ----- */
        this.newTableUsers();
        this.newTablePositions();
        this.newTableSKUS();
        this.newTableSKUItems();
        this.newTableTD();
        this.newTableTR();
        this.newTableI();
        this.newTableRO();
        this.newTableIO();
        this.newTableRTO();

        /* ----- TABLES DELETION ----- */
        // this.dropTableUsers();
        // this.dropTableRO();
        // this.dropTableIO();
        // this.dropTableRTO();
        // this.dropTableSKUS();
        // this.dropTablePositions();
        // this.dropTableSKUItems();
        // this.dropTableTD();
        //this.dropTableTR();
        // this.dropTableI();
    }

    /**
     *  + --------------------------------------------- +
     *  |                                               |
     *  |           DATABASE: OPERATIONS                |
     *  |                                               |
     *  + --------------------------------------------- +
     */

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.run(sql, params, function (err) {
            if (err) {
              console.log('Error running sql ' + sql)
              console.log(err)
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


    /**
     *  + --------------------------------------------- +
     *  |                                               |
     *  |           DATABASE: CREATE TABLES             |
     *  |                                               |
     *  + --------------------------------------------- +
     */

    
    /**
     * ========================
     *       SKUS TABLE
     * ========================
     *  - newTableSKUS(): create the SKUS table, if it does not already exist.
     *  - dropTableSKUS(): drop the SKUS table.
    */
     newTableSKUS() {
      return new Promise((resolve, reject) => {
        const query_SQL = "CREATE TABLE IF NOT EXISTS SKUS (                              \
                                id                      INTEGER,                          \
                                description             VARCHAR,                          \
                                weight                  INTEGER,                          \
                                volume                  INTEGER,                          \
                                notes                   VARCHAR,                          \
                                position                VARCHAR,                          \
                                price                   FLOAT,                            \
                                availableQuantity       INTEGER,                          \
                                PRIMARY KEY(id),                            \
                                FOREIGN KEY(position) REFERENCES POSITIONS(positionID)    )";

        this.db.run(query_SQL, (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(this.lastID)
        });
      });
    }

    dropTableSKUS() {
      return new Promise((resolve, reject) => {
        const query_SQL = "DROP TABLE IF EXISTS SKUS";
        this.db.run(query_SQL, (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(this.lastID);
        });
      });
    }

    /**
     * ========================
     *       SKUITEMS TABLE
     * ========================
     *  - newTableSKUItems(): create the SKUitem table, if it does not already exist.
     *  - dropTableSKUItems(): drop the SKUitem table.
    */
     newTableSKUItems() {
      return new Promise((resolve, reject) => {
        // const query_SQL = `CREATE TABLE IF NOT EXISTS SKUITEMS(RFID VARCHAR PRIMARY KEY, SKUId INTEGER, Available INTEGER, DateOfStock VARCHAR)`;
        const query_SQL = "CREATE TABLE IF NOT EXISTS SKUITEMS (                          \
                                RFID                    VARCHAR,                          \
                                SKUId                   INTEGER,                          \
                                Available               INTEGER,                          \
                                DateOfStock             VARCHAR,                          \
                                PRIMARY KEY(RFID),                                        \
                                FOREIGN KEY(SKUId) REFERENCES SKUS(id))"                  ;

        this.db.run(query_SQL, (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(this.lastID)
        });
      });
    }

    dropTableSKUItems() {
      return new Promise((resolve, reject) => {
        const query_SQL = "DROP TABLE IF EXISTS SKUITEMS";
        this.db.run(query_SQL, (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(this.lastID);
        });
      });
    }

    /**
     * ========================
     *     POSITION TABLE
     * ========================
     *  - newTablePositions(): create the positions table, if it does not already exist.
     *  - dropTablePositions(): drop the positions table.
    */
     newTablePositions() {
      return new Promise((resolve, reject) => {
        // const query_SQL = `CREATE TABLE IF NOT EXISTS POSITIONS(positionID INTEGER PRIMARY KEY, aisleID INTEGER, row INTEGER, col INTEGER, maxWeight FLOAT, maxVolume FLOAT, occupiedWeight FLOAT, occupiedVolume FLOAT)`;
        const query_SQL = "CREATE TABLE IF NOT EXISTS POSITIONS (                         \
                              positionID              INTEGER,                            \
                              aisleID                 INTEGER,                            \
                              row                     INTEGER,                            \
                              col                     INTEGER,                            \
                              maxWeight               FLOAT,                              \
                              maxVolume               FLOAT,                              \
                              occupiedWeight          FLOAT,                              \
                              occupiedVolume          FLOAT,                              \
                              PRIMARY KEY(positionID)                                    )";

        this.db.run(query_SQL, (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(this.lastID)
        });
      });
    }

    dropTablePositions() {
      return new Promise((resolve, reject) => {
        const query_SQL = "DROP TABLE IF EXISTS POSITIONS";
        this.db.run(query_SQL, (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(this.lastID);
        });
      });
    }
    
    /**
     * ========================
     *     RESTOCK ORDERS TABLE
     * ========================
     *  - newTableRO(): create the restock orders table, if it does not already exist.
     *  - dropTableRO(): drop the restock order table.
    */
    newTableRO() {
      return new Promise((res, rej)=>{
          const sql = "CREATE TABLE IF NOT EXISTS RESTOCK_ORDERS(key INTEGER PRIMARY KEY, id INTEGER, issueDate DATE, state VARCHAR, supplierId INTEGER, deliveryDate DATE, SKUId INTEGER , description VARCHAR, price FLOAT, RFID VARCHAR) ";
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
  
  /**
     * ========================
     *     RETURN ORDERS TABLE
     * ========================
     *  - newTableRTO(): create the return orders table, if it does not already exist.
     *  - dropTableRTO(): drop the return order table.
    */
  newTableRTO() {
    return new Promise((res, rej)=>{
        const sql = "CREATE TABLE IF NOT EXISTS RETURN_ORDERS(key INTEGER PRIMARY KEY, id INTEGER, returnDate DATE,restockOrderId  INTEGER, SKUId INTEGER , description VARCHAR, price FLOAT, RFID VARCHAR )";
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

    /**
     * ========================
     *     INTERNAL ORDERS TABLE
     * ========================
     *  - newTableIO(): create the internal orders table, if it does not already exist.
     *  - dropTableIO(): drop the internal order table.
    */
  newTableIO() {
    return new Promise((res, rej)=>{
        const sql = "CREATE TABLE IF NOT EXISTS INTERNAL_ORDERS(key INTEGER PRIMARY KEY, id INTEGER, issueDate DATE, state VARCHAR, customerId INTEGER, SKUId INTEGER , description VARCHAR, price FLOAT, RFID VARCHAR ) ";
        this.db.run(sql, (err)=>{
            if (err) {
                rej(err);
                return;
            }
            res(this.lastID);
        });
    });
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

  /**
  * ========================
  *       USER TABLE
  * ========================
  *  - newTableUser(): create the users table, if it does not already exist.
  *  - dropTableUser(): drop the users table.
  */
  newTableUsers() {
    return new Promise(async (res, rej)=>{
      let sql = "CREATE TABLE IF NOT EXISTS USERS(id INTEGER, username VARCHAR UNIQUE, name VARCHAR, surname VARCHAR, password VARCHAR, type VARCHAR, PRIMARY KEY(id)) ";
      this.db.run(sql, (err)=>{
        if (err) {
          rej(err);
            return;
          }
        res(this.lastID);
      });

      let manager = {
        username: "manager1@ezwh.com",
        name: "Dave",
        surname: "Grohl",
        type: "manager",
        password: "testpassword"
      }
      sql = "INSERT OR IGNORE INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)";
      let hash = await bcrypt.hash(manager.password, saltRounds);
      this.db.run(sql, [manager.username, manager.name, manager.surname, hash, manager.type], (err)=>{
        if (err) {
          rej(err);
            return;
          }
        res(this.lastID);
      });
    });
  }
  
  dropTableUsers() {
    return new Promise((res, rej) => {
      const sql = "DROP TABLE IF EXISTS USERS";
      this.db.run(sql, (err)=>{
          if (err) {
              rej(err);
              return;
          }
          res(this.lastID);
      });
    });
  }

  deleteAllUsers() {
    return new Promise((res, rej) => {
      const sql = "DELETE FROM USERS";
      this.db.run(sql, (err)=>{
          if (err) {
              rej(err);
              return;
          }
          res(this.lastID);
      });
    });
  }


 /**
  * ========================
  *       TEST DESCRIPTOR TABLE
  * ========================
  *  - newTableTD(): create the test descriptor table, if it does not already exist.
  *  - dropTableTD(): drop the test descriptor table.
  */


 
  newTableTD() {
    return new Promise((res, rej)=>{
        const sql = "CREATE TABLE IF NOT EXISTS TEST_DESCRIPTORS(id INTEGER PRIMARY KEY, name VARCHAR, procedureDescription VARCHAR, idSKU INTEGER)";
        this.db.run(sql, (err)=>{
            if (err) {
                rej(err);
                return;
            }
            res(this.lastID);
        });
    });
  }
  
  
  dropTableTD() {
    return new Promise((res, rej) => {
      const sql = "DROP TABLE IF EXISTS TEST_DESCRIPTORS";
      this.db.run(sql, (err)=>{
          if (err) {
              rej(err);
              return;
          }
          res(this.lastID);
      });
  });
  }

  /**
  * ========================
  *       TEST RESULT TABLE
  * ========================
  *  - newTableTR(): create the test result table, if it does not already exist.
  *  - dropTableTR(): drop the test result table.
  */

  newTableTR() {
    return new Promise((res, rej)=>{
        const sql = "CREATE TABLE IF NOT EXISTS TEST_RESULTS(id INTEGER PRIMARY KEY, rfid VARCHAR, idTestDescriptor INTEGER, Date DATE, Result BOOLEAN)";
        this.db.run(sql, (err)=>{
            if (err) {
                rej(err);
                return;
            }
            res(this.lastID);
        });
    });
  }


  dropTableTR() {
    return new Promise((res, rej) => {
      const sql = "DROP TABLE IF EXISTS TEST_RESULTS";
      this.db.run(sql, (err)=>{
          if (err) {
              rej(err);
              return;
          }
          res(this.lastID);
      });
  });
  }

  /**
  * ========================
  *       ITEM TABLE
  * ========================
  *  - newTableI(): create the item table, if it does not already exist.
  *  - dropTableItems(): drop the items table.
  */

  newTableI() {
    return new Promise((res, rej)=>{//id, description, price, SKUId, supplierId
        const sql = "CREATE TABLE IF NOT EXISTS ITEMS(id INTEGER, description VARCHAR, price FLOAT, SKUId INTEGER, supplierId INTEGER, PRIMARY KEY(id,supplierId))";
        this.db.run(sql, (err)=>{
            if (err) {
                rej(err);
                return;
            }
            res(this.lastID);
        });
    });
  }


  dropTableI() {
    return new Promise((res, rej) => {
      const sql = "DROP TABLE IF EXISTS ITEMS";
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
