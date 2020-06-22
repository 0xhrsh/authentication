const User = require('../models/User');
const assert = require('assert');
const createDB = require("../utils/createDBWithSchemaScript");
const rimraf = require("rimraf");

describe("User Tests", () => {

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
    
	let user;
	describe("Instantiating a new User", () => {
		it("Shouldn't cause any Errors.", () => {
			user = new User(
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
		});
	});

	describe("Regestring Earlier created user into database.", () => {
		it("Shouldn't cause any Errors", async () => {
			await user.register();
		});
	});

	describe("Static Tests", () => {
		describe("#exists() Test", () => {
			it("should return true for earlier registered user", async () => {
				assert.equal(await User.exist("beta.1"), true);
			});

			it("should return false for non-existent user", async () => {
				assert.equal(await User.exist("beta.2"), false);
			});
		});

		describe("#assertLogin() Tests", () => {
			it("should return true for correct password", async () => {
				assert.equal(await User.assertlogin("beta.1", "1234"), true);
			});

			it("should return false for incorrect password", async () => {
				assert.equal(await User.assertlogin("beta.1", "124"), false);
			});

			it("should return false for incorrect username", async () => {
				assert.equal(await User.assertlogin("beta.2", "1234"), false);
			});
		});

		describe("#fetchFromDB() Tests", () => {
			it("should return User object for earlier registered user", async () => {
				const new_user = await User.fetchFromDB("beta.1");
				Object.keys(user).forEach(key => {
					assert.equal(new_user[key], user[key]);
				});
				user = new_user;
			});

			it("should return false for non-existent users", async () => {
				assert.equal(await User.fetchFromDB("beta.2"), false);
			});
		});
	});

	describe("#getClaim() Tests", () => {
		it("should return a subset of asked fields", () => {
			const claim = user.getClaim("user_id", "username", "phone_no");
			const supposed_claim = {
				"user_id": "beta.1", 
				"username": "beta.1", 
				"phone_no": 1234567890
			};
            
			Object.keys(supposed_claim).forEach(key => {
				assert.equal(claim[key], supposed_claim[key]);
			});
            
			Object.keys(claim).forEach(key => {
				assert.equal(claim[key], supposed_claim[key]);
			});
		});
	});

	describe("Error Tests", () => {
		describe("#exists() with some query manipulation", () => {
			it("should return SQLITE_ERROR", () => {
				return User.exist("abcd, 'pqrs'").then(
					() => {}, 
					(err) => {
						assert.equal(err.code, "SQLITE_ERROR");
					}
				);
			});
		});

		describe("#fetchFromDB() with some query manipulation", () => {
			it("should return SQLITE_ERROR", () => {
				return User.fetchFromDB("abcd, 'pqrs'").then(
					() => {}, 
					(err) => {
						assert.equal(err.code, "SQLITE_ERROR");
					}
				);
			});
		});

		describe("#assertLogin() with some query manipulation", () => {
			it("should return SQLITE_ERROR", () => {
				return User.assertlogin("abcd, 'pqrs'", 'abcd').then(
					() => {}, 
					(err) => {
						assert.equal(err.code, "SQLITE_ERROR");
					}
				);
			});
		});
	});
});