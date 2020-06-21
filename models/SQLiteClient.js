const {err_cb, acquireSqlite3DBInstance, generateInsertionSql} = require("../utils/SqliteClientUtils");

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

	exist(table_name, selector_column, value){
		const querySql = `SELECT * FROM ${table_name} WHERE ${selector_column}='${value}'`;
		const db = acquireSqlite3DBInstance(this.db_name);
		return new Promise((resolve, reject) => {
			db.get(querySql, (err, row) => {
				db.close(err => err_cb);
				if(!err) {
					if(row){
						{ return resolve(true); }
					} else {
						return resolve(false);
					}
				} else {
					return reject(err);
				}
			});
		});
	}
}

module.exports = SQLiteClient;