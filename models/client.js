const SQLiteClient = require('./SQLiteClient');
const dbclient = new SQLiteClient('./auth.db');

class Client{
	constructor(client_id, client_secret, redirect_uri){
		this.client_id = client_id;
		this.client_secret = client_secret;
		this.redirect_uri = redirect_uri;
	}

	register(){
		return dbclient.insertIntoTable('clients', this);
	}

	static fetchFromDB(client_id){
		return new Promise(async (resolve, reject) => {
			if (await dbclient.exist('clients', 'client_id', client_id)) {
				const client = await dbclient.getFromTable('clients', 'client_id', client_id);
				resolve(new Client(
					client.client_id,
					client.client_secret,
					client.redirect_uri, 
				));
			} else {
				resolve(false);
			}
		});
	}

	static exist(client_id){
		return new Promise((resolve, reject) => {
			dbclient.exist('clients', 'client_id', client_id)
				.then(exist => resolve(exist))
				.catch(err => reject(err));
		});
	}

	static assertCreds(client_id, client_secret){
		return new Promise(async (resolve, reject) => {
			if(await dbclient.exist('clients', 'client_id', client_id)) {
				dbclient.getFromTable('clients' , 'client_id' , client_id)
					.then(res => {
						if(client_secret === res.client_secret){
							resolve(true);
						} else {
							resolve(false);
						}
					})
					.catch (err => {
						reject(err);
					});
			} else {
				return false;
			}
		});
	}

	static getRedirectURI(client_id){
		return new Promise(async (resolve, reject) => {
			if(await dbclient.exist('clients', 'client_id', client_id)){
				dbclient.getFromTable('clients', 'client_id', client_id)
					.then(client => {
						resolve(client.redirect_uri);
					})
					.catch(err => {
						reject(err);
					})
			} else {
				resolve(false);
			}
		});
	}
}

module.exports = Client;