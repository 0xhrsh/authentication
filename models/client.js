const SQLiteClient = require('./SQLiteClient');
const dbclient = new SQLiteClient('./auth.db');

class Client{
	constructor(clientID, clientSecret, redirectURL){
		this.client_id = clientID;
		this.client_secret = clientSecret;
		this.redirect_uri = redirectURL;
	}

	register(){
		return dbclient.insertIntoTable('clients', this);
	}

	static fetchFromDB(clientID){
		return new Promise(async (resolve, reject) => {
			if (await dbclient.exist('clients', 'client_id', clientID)) {
				const user = await dbclient.getFromTable('clients', 'client_id', clientID);
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

	static exist(clientID){
		return new Promise((resolve, reject) => {
			dbclient.exist('clients', 'client_id', clientID)
				.then(exist => resolve(exist))
				.catch(err => reject(err));
		});
	}

	static assertCreds(clientID, clientSecret){
		return new Promise((resolve, reject) => {
			dbclient.getFromTable('clients' , 'client_id' , clientID)
				.then(res => {
					if(clientSecret === res.client_secret){
						resolve(true);
					} else {
						resolve(false);
					}
				})
				.catch (err => {
					reject(err);
				});
		});
	}

	static getRedirectURI(clientID){
		return new Promise((resolve, reject) => {
			dbclient.getFromTable('clients', 'client_id', clientID)
				.then(client => {
					if(client){
						resolve(client.redirect_uri);
					} else {
						resolve(false);
					}
				});
		});
	}
}

// const client = new Client("abc", "def", "ghi")
// async function main(){
// 	client.register();
//     var obj = await Client.fetchFromDB("abc");
//     console.log(obj.client_id);
//     var p=Client.assertCreds("abc", "def");
//     p.then(function(val) { 
//         console.log(val); 
//     });
//     var p=Client.exist("abc");
//     p.then(function(val) { 
//         console.log(val); 
//     }); 	
// }
// main();

module.exports = Client;