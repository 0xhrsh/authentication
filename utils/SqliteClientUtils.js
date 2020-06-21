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

module.exports = {err_cb, acquireSqlite3DBInstance, stringify, generateInsertionSql};