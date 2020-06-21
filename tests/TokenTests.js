const Token = require('../models/Token');
const assert = require('assert');
const Client = require('../models/client');
// const rimraf = require("rimraf");

describe("Token Tests", () => {

	let token;
	let user;
	describe("Creating Token.", () => {
		it("Shouldn't cause any Errors.", () => {
			token = new Token("beta.1", "sampleID");
		});
	});

	describe("Static Tests", () => {
		describe("#decryptToken() Test.", () => {
			it("Shouldn't cause any Errors", async () => {
				const decryptedToken = Token.decryptToken(token);
				const fields = decryptedToken.split("___");
				assert.equal(fields.length, 3);
				assert.equal(fields[0], "beta.1");
				assert.equal(fields[1], "sampleID");
			});
		});

		describe("#getUserProfile() Tests", () => {
			it("should return a asked fields after token verification", () => {
				const client = new Client("sampleID", "sampleSecret", "");
				client.register();

				user = Token.getUserProfile(token, "sampleSecret", ["user_id"]);
				user.then(function(result) {
					assert.equal(result["success"], true);	
				});

				user = Token.getUserProfile(token, "!sampleSecret", ["user_id"]);
				user.then(function(result) {
					assert.equal(result["success"], false);	
				});

				token = new Token("!beta.1", "sampleID");
				user = Token.getUserProfile(token, "sampleSecret", ["user_id"]);
				user.then(function(result) {
					assert.equal(result["success"], false);	
				});

			});
		});
	});

});