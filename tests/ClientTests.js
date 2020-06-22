const Client = require("../models/client");
const assert = require('assert');
const createDB = require("../utils/createDBWithSchemaScript");
const rimraf = require("rimraf");


describe("Client Tests", () => {

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

	let client;
	describe("Instantiating a new Client", () => {
		it("Shouldn't cause any errors", () => {
			client = new Client(
				"LHC_portal",
				"hHNj4C2cG2GThHNj4C2cG2GT",
				"http://localhost:3000"
			);
		});
	});

	describe("Registering the client now in the database", () => {
		it("Shouldn't cause any errors", async () => {
			await client.register();
		});
	});

	describe("Static Tests", () => {

		describe("#fetchFromDB() Test", () => {
			it("should return true for earlier registered client", async () => {
				const new_client = await Client.fetchFromDB("LHC_portal");
				Object.keys(client).forEach(key => {
					assert.equal(new_client[key], client[key]);
				});
				client = new_client;
			});

			it("should return false for non-existent client", async () => {
				assert.equal(await Client.fetchFromDB("Library_portal"), false);
			});
		});

		describe("#exists() Test", () => {
			it("should return true for earlier registered client", async () => {
				assert.equal(await Client.exist("LHC_portal"), true);
			});

			it("should return false for non-existent client", async () => {
				assert.equal(await Client.exist("Library_portal"), false);
			});
		});

		describe("#assertCreds() Tests", () => {
			it("should return true for correct client_secret", async () => {
				assert.equal(await Client.assertCreds("LHC_portal", "hHNj4C2cG2GThHNj4C2cG2GT"), true);
			});

			it("should return false for incorrect client_secret", async () => {
				assert.equal(await Client.assertCreds("LHC_portal", "hHNj4C2cG2GThHNj4C2cG2"), false);
			});

			it("should return false for incorrect client_id", async () => {
				assert.equal(await Client.assertCreds("Library_portal", "hHNj4C2cG2GThHNj4C2cG2GT"), false);
			});
		});

		describe("#getRedirectURI() Test", () => {
			it("Should return correct redirect uri of the client", async () => {
				const expected_redirectedURI = "http://localhost:3000";

				assert.equal(await Client.getRedirectURI("LHC_portal"), expected_redirectedURI);
			});

			it("Should return false for incorrect client id", async () => {
				const expected_redirectedURI = "http://localhost:3000/login";

				assert.equal(await Client.getRedirectURI("Library"), false);
			});
		});
	});

	describe("Error Testing", () => {
		describe("#exist()", () => {
			it("should raise SQLITE_ERROR", () => {
				return Client.exist(`abcd, 'pqrs'`)
					.then(
						() => {}, 
						(err) => {
							assert.equal(err.code, "SQLITE_ERROR");
						}
					);
			});
		});

		describe("#assertCreds()", () => {
			it("should raise ", () => {
				return Client.assertCreds(`abcd, 'ab'`, `abcd, 'ab'`)
					.then(
						() => {}, 
						(err) => {
							assert.equal(err.code, "SQLITE_ERROR");
						}
					);
			});
		});

		describe("#getRedirectURI()", () => {
			it("should raise ", () => {
				return Client.getRedirectURI(`abcd, 'pqrs'`)
					.then(
						() => {}, 
						(err) => {
							assert.equal(err.code, "SQLITE_ERROR");
						}
					);
			});
		});
	});
});