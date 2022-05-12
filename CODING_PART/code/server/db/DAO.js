"use strict";

const sqlite = require('sqlite3');

class DAO {
    static db;
    constructor() {
        this.db = new sqlite.Database("ezwh_db.sqlite", (err)=>{
            if(err) throw err;
        });

        this.newTableName();
        this.newTablePositions();
        this.newTableSKUS();
        this.newTableSKUItems();
        // this.dropTableSKUS();
        // this.dropTablePositions();
        // this.dropTableSKUItems();
        
    }

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
                                PRIMARY KEY(id AUTOINCREMENT),                            \
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
}

module.exports = DAO;