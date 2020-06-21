const Token = require('../models/Token');
const assert = require('assert');
// const rimraf = require("rimraf");

describe("Token Tests", () => {

	let token;
	describe("Creating Token.", () => {
		it("Shouldn't cause any Errors.", () => {
			token = new Token("beta.1", "test");
		});
	});

	describe("Static Tests", () => {
		describe("#decryptToken() Test.", () => {
			it("Shouldn't cause any Errors", async () => {
				let token = new Token("beta.1", "test");
				const decryptedToken = Token.decryptToken(token.authToken);
				const fields = decryptedToken.split("___");
				assert.equal(fields.length, 3);
				assert.equal(fields[0], "beta.1");
				assert.equal(fields[1], "test");
			});
		});

		// describe("#getUserProfile() Tests", () => {
		// 	it("should return a asked fields after token verification", () => {
		// 		const user = Token.getUserProfile(token.authToken, "test2", ["user_id", "username", "phone_no"]);
		// 		const supposed_user = {
		// 			"user_id": "beta.1",
		// 			"username": "beta.1",
		// 			"phone_no": 1234567890
		// 		};

		// 		Object.keys(supposed_user).forEach(key => {
		// 			assert.equal(user[key], supposed_user[key]);
		// 		});

		// 		Object.keys(user).forEach(key => {
		// 			assert.equal(user[key], supposed_user[key]);
		// 		});
		// 	});
		// });
	});

});