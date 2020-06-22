const Token = require('../models/Token');
const Client = require('../models/client');
const User = require('../models/User');

const assert = require('assert');
const rimraf = require("rimraf");

const createDB = require("../utils/createDBWithSchemaScript");

describe("Token Tests", () => {

	before(async () => {
		await createDB();
		const user = new User(
			"beta.1", 
			"beta.1", 
			"alpha", 
			"gamma", 
			"beta", 
			"1234", 
			"beta.1@iitj.ac.in", 
			1234567890, 
			"student,pg", 
			"male", 
			"1/1/2000"
		);
		await user.register();

		const client = new Client("sampleID", "sampleSecret", "");
		await client.register();
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

	let token, user;
	describe("Creating Token.", () => {
		it("Shouldn't cause any Errors.", () => {
			token = new Token("beta.1", "sampleID", ["user_id"]);
		});
	});

	describe("Static Tests", () => {
		describe("#decryptToken() Test.", () => {
			it("Shouldn't cause any Errors", async () => {
				const decryptedToken = Token.decryptToken(token);
				const fields = decryptedToken.split("___");
				assert.equal(fields.length, 4);
				assert.equal(fields[0], "beta.1");
				assert.equal(fields[1], "sampleID");
			});
		});

		describe("#getUserProfile() Tests", () => {
			it("should return a asked fields after token verification", async () => {
				user = await Token.getUserProfile(token, "sampleSecret");
				assert.equal(user.user.user_id, "beta.1");
			});
		});

		describe("Error Testing", () => {
			describe("#getUserProfile() Testing", () => {
				it("should return ClientErr error for fake clients", async() => {
					user = await Token.getUserProfile(token, "samplesecret");
					assert.equal(user.err, "ClientErr");
				});

				it("should return AuthWindowErr error for fake clients", async() => {
					Token.auth_window = 1;
					token = new Token("beta.1", "sampleID", ["user_id"]);
					user = await Token.getUserProfile(token, "sampleSecret");
					assert.equal(user.err, "AuthWindowErr");
				});
			});
		});
	});

});