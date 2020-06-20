const assert = require("assert");
const SQLiteClient = require('../models/SQLiteClient');
const createDB = require("../utils/createDBWithSchemaScript");
const rimraf = require("rimraf");

const dbclient = new SQLiteClient('./auth.db');

describe("SQLiteClient Tests", () => {
	before(async () => {
		await createDB();
	});

	after(async () => {
		await new Promise((resolve, reject) => {
			rimraf('./auth.db', (err) => {
				if(!err){
					resolve();
				} else {
					reject();
				}
			});
		});
	});

	describe("InsertIntoTable Tests", () => {
		it("should insert user object into users table in auth.db", async () => {
			const user = {
				"user_id": "beta.1", 
				"username": "beta.1", 
				"first_name": "alpha", 
				"last_name": "beta", 
				"middle_name": "gamma", 
				"password_sha256": "jsagdhjsgaj2o2i73g3h4", 
				"email_id": "beta.1@iitj.ac.in", 
				"phone_no": 1234567890, 
				"roles": ['student', 'pg'], 
				"gender": "male", 
				"birth_date": "1/1/2000"
			};
			await dbclient.insertIntoTable('users', user);
		});

		it("should insert client object into clients db in auth.db", async () => {
			const client = {
				"client_id": "LHC_portal", 
				"client_secret": "AlphaBetaGamma", 
				"redirect_uri": "https://lhc.iitj.ac.in/login"
			};
			await dbclient.insertIntoTable('clients', client);
		});
	});
    
	describe("GetFromTable Tests", () => {
		describe("Getting user object earlier injected", async () => {
			const user = await dbclient.getFromTable('users', 'username', 'beta.1');
			it("should be equal to the user object injected before", () => {
				assert.equal(user.user_id, "beta.1");
				assert.equal(user.username, "beta.1");
				assert.equal(user.first_name, "alpha");
				assert.equal(user.last_name, "beta");
				assert.equal(user.middle_name, "gamma");
				assert.equal(user.password_sha256, "jsagdhjsgaj2o2i73g3h4");
				assert.equal(user.email_id, "beta.1@iitj.ac.in");
				assert.equal(user.phone_no, 1234567890);
				assert.equal(user.roles, '["student", "pg"]');
				assert.equal(user.gender, 'male');
				assert.equal(user.birth_date, '1/1/2000');
			});
		});

		describe("Getting client object earlier injected", async () => {
			const client = await dbclient.getFromTable('clients', 'client_id', 'LHC_portal');
			it("should be equal to the client object injected before", () => {
				assert.equal(client.client_id, "LHC_portal");
				assert.equal(client.client_secret, "AlphaBetaGamma");
				assert.equal(client.redirect_uri, "https://lhc.iitj.ac.in/login");
			});
		});
	});
});