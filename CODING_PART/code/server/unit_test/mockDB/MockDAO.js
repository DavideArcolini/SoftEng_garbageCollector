"use strict";

const sqlite = require('sqlite3');

class MockDAO {
    static DB;

    constructor () {
        this.DB = new sqlite.Database("ezwh_mock.DB", (error) => {
            console.log(error);
            throw error;
        });
    }







    
}

module.exports = new MockDAO();