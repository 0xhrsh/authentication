const sqlite3 = require('sqlite3').verbose();

const err_cb = (err) => {
    if(err) console.log(err);
}

const db = new sqlite3.Database('./auth.db', sqlite3.OPEN_READWRITE, err => err_cb);

const userTableSql = `CREATE TABLE users(
    user_id TEXT, 
    username TEXT, 
    first_name TEXT, 
    middle_name TEXT, 
    last_name TEXT, 
    password_sha256 TEXT, 
    email_id TEXT, 
    phone_no INTEGER, 
    roles TEXT, 
    gender TEXT, 
    birth_date TEXT
)`

db.run(userTableSql, err => err_cb);

const clientTableSql = `CREATE TABLE clients(
    client_id TEXT, 
    client_secret TEXT, 
    redirect_uri TEXT
)`

db.run(clientTableSql, err => err_cb);
db.close(err => err_cb)