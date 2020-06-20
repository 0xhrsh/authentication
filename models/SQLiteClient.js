const sqlite3 = require('sqlite3').verbose();

const err_cb = (err) => {
	if(err) console.log(err);
};

const acquireSqlite3DBInstance = db_path => {
	return new sqlite3.Database(db_path, sqlite3.OPEN_READWRITE, err => err_cb);
};

const stringify = obj => {
	switch(typeof(obj)){
	case 'number':
		return `${obj}`;
		break;

	case 'string': 
		return `'${obj}'`;
		break;

	case 'object':
		if(Array.isArray(obj)){
			return `'${JSON.stringify(obj)}'`;
		} else {
			throw new Error(`${obj} is not an Array.`);
		}
		break;

	default: 
		throw new Error(`${obj} is not in the scope to be saved into DB.`);
		break;
	}
};

const generateInsertionSql = (table_name, entity_object) => {
	var keys = "";
	var values = "";
	Object.keys(entity_object).forEach(key => {
		keys = keys + key + ', ';
		values = values + stringify(entity_object[key]) + ', ';
	});
	keys = keys.substr(0, keys.length-2);
	values = values.substr(0, values.length-2);
    
	const sql = `INSERT INTO ${table_name}(${keys}) VALUES(${values})`;
	// console.log(sql);
	return sql;
};

class SQLiteClient{

	constructor(db_name){
		this.db_name = db_name;
	}

	insertIntoTable(table_name, entity_object){
		const db = acquireSqlite3DBInstance(this.db_name);
		const insertion_sql = generateInsertionSql(table_name, entity_object);
		return new Promise( (resolve, reject) => {
			db.run(insertion_sql, (err) => {
				db.close(err => err_cb);
				if(!err){
					resolve();
				} else {
					reject(err);
				}
			});
		});
	}

	getFromTable(table_name, selector_column, value){
		const querySql = `SELECT * FROM ${table_name} WHERE ${selector_column}='${value}'`;
		const db = acquireSqlite3DBInstance(this.db_name);
		return new Promise((resolve, reject) => {
			db.get(querySql, (err, row) => {
				db.close(err => err_cb);
				if(!err) {
					if(row){
						resolve(row);
					} else {
						reject(new Error("doesn't exist!"));
					}
				} else {
					reject(err);
				}
			});
		});
	}
}

// const a = {
//     "user_id": "abc", 
//     "username": "abc", 
//     // "first_name": "abc", 
//     "last_name": "", 
//     "middle_name": "", 
//     // "password_sha256": "", 
//     "email_id": "", 
//     "phone_no": 55647483, 
//     "roles": ['abcd', 'pqrs'], 
//     "gender": "male", 
//     "birth_date": "1/1/2000"
// }

// const client = new SQLiteClient('./auth.db');
// client.insertIntoTable('users', a);
// client.getFromTaable('users', 'username', 'abc').then(console.log)

module.exports = SQLiteClient;