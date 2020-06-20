const sqlite3 = require('sqlite3').verbose();

const err_cb = (err) => {
	if(err) console.log(err);
};

const main = async () => {
	const db = new sqlite3.Database('./auth.db', err => err_cb);

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
    )`;

	await new Promise((resolve, reject) => {
		db.run(userTableSql, err => {
			if(!err){
				resolve();
			} else {
				reject();
			}
		});
	});

	const clientTableSql = `CREATE TABLE clients(
        client_id TEXT, 
        client_secret TEXT, 
        redirect_uri TEXT
    )`;

	await new Promise((resolve, reject) => {
		db.run(clientTableSql, err => {
			if(!err){
				resolve();
			} else {
				reject();
			}
		});
	});
	db.close(err => err_cb);
};

module.exports = main;