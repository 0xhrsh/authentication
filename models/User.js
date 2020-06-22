const SQLiteClient = require('./SQLiteClient');
const dbclient = new SQLiteClient('./auth.db');


//users database 
/*
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
*/


class User{

	constructor(user_id, username, first_name, middle_name, last_name, 
		password_sha256, email_id, 
		phone_no, roles, gender, birth_date){
		this.user_id = user_id;
		this.username = username;
		this.first_name  = first_name;
		this.middle_name = middle_name;
		this.last_name = last_name;
		this.password_sha256 = password_sha256;
		this.email_id = email_id;
		this.phone_no = phone_no;
		this.roles = roles;
		this.gender = gender;
		this.birth_date = birth_date; 
	}
    
	static fetchFromDB(username){
		return new Promise(async (resolve, reject) => {
			try{
				if (await dbclient.exist('users', 'username', username)) {
					const user = await dbclient.getFromTable('users', 'username', username);
					resolve(new User(
						user.user_id, 
						user.username, 
						user.first_name, 
						user.middle_name, 
						user.last_name, 
						user.password_sha256, 
						user.email_id, 
						user.phone_no, 
						user.roles, 
						user.gender, 
						user.birth_date, 
					));
				} else {
					resolve(false);
				}
			} catch(err) {
				reject(err);
			}
		});
	}
    
	register() {
		return dbclient.insertIntoTable('users', this);
	}
    
	getClaim(){
		var obj = {};
		Object.values(arguments).forEach(argument => {
			obj[argument] = this[argument]; 
		});
		return obj;
	}
    
	static exist(username){
		return new Promise((resolve, reject) => {
			dbclient.exist('users', 'username' , username)
				.then(exist => resolve(exist))
				.catch(err => reject(err));
		});
	}
    
	static assertlogin(username, password)
	{
		return new Promise(async (resolve, reject) => {
			try{
				if(await dbclient.exist('users', 'username', username)){
					dbclient.getFromTable('users' , 'username' , username)
						.then(res => {
							if(password === res.password_sha256){
								resolve(true);
							} else {
								resolve(false);
							}
						});
				} else {
					resolve(false);
				}
			} catch(err) {
				reject(err);
			}
		});
	}
}

module.exports = User;