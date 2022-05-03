class UserDAO {
    sqlite = require("sqlite3");

    constructor(){
        this.db = new this.sqlite.Database("user_db", (err)=>{
            if(err) throw err;
        });

        this.newTableName();
       /* const manager = {
            username: "manager1@ezwh.com",
            name: "Mario",
            surname: "Rossi",
            password: "1234",
            type: "M"
        }
        this.storeUser(manager);*/
    }

    dropTable() {
        return new Promise((res, rej) => {
            const sql = "DROP TABLE IF EXISTS NAMES";
            this.db.run(sql, (err)=>{
                if (err) {
                    rej(err);
                    return;
                }
                res(this.lastID);
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

    storeUser(data) {
        return new Promise((res, rej)=>{
            const sql = "INSERT INTO USERS(USERNAME, NAME, SURNAME, PASSWORD, TYPE) VALUES (?,?,?,?,?)";
            this.db.run(sql, [data.username, data.name, data.surname, data.password, data.type], (err)=>{
                if (err) {
                    rej(err);
                    return;
                }
                res(this.lastID);
            });
        });
    }

    getStoredUsers() {
        return new Promise((res, rej)=>{
            const sql = "SELECT * FROM USERS";
            this.db.all(sql, [], (err, rows)=>{
                if (err) {
                    rej(err);
                    return;
                }
                res(rows);
            });
        });
    }
    
    getUser(data) {
        return new Promise((res, rej)=>{
            const sql = "SELECT id, username, name, surname FROM USERS WHERE username=? AND password=?";
            this.db.get(sql, [data.username, data.password], (err, rows)=>{
                if (err) {
                    rej(err);
                    return;
                }
                console.log(rows)
                res(rows[0])
            });
        });
    }
}
module.exports = UserDAO;