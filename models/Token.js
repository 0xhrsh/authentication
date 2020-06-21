var crypto = require("crypto");
const Client = require("./client");
const User = require('./User');

var algorithm = "aes-192-cbc";
var password = "*insert_secret_key_here*";
const key = crypto.scryptSync(password, 'salt', 24);

const iv = Buffer.alloc(16, 0);
const auth_window = 10 * 60 * 1000;


// Class Token contains the implementation required for auth token operations,
// including token creation and obtaining user details post credential verification
class Token {

	constructor(user_id, client_id) {
		const cipher = crypto.createCipheriv(algorithm, key, iv);

		let request_date = new Date();
		let info_string = user_id + "___" + client_id + "___" + request_date;

		this.authToken = cipher.update(info_string, 'utf8', 'hex') + cipher.final('hex');
	}

	static async getUserProfile(tkn, client_secret, claim_list) {
		var decryptedToken = this.decryptToken(tkn);
		const user_id = decryptedToken.split("___")[0];
		const client_id = decryptedToken.split("___")[1];
		const request_date = new Date(decryptedToken.split("___")[2]).getTime();

		if (new Date() <= new Date(request_date + auth_window)) {
			if (await Client.assertCreds(client_id, client_secret)) {
				let user = await User.fetchFromDB(user_id);
				user = user.getClaim(...claim_list);
				return {
					success: true,
					user
				};
			} else {
				return {
					success: false,
					err: "client doesn't exist."
				};
			}
		} else {
			return {
				success: false,
				err: "auth window err"
			};
		}
	}

	static decryptToken(tkn) {
		const decipher = crypto.createDecipheriv(algorithm, key, iv);
		return decipher.update(tkn.authToken, 'hex', 'utf8') + decipher.final('utf8');
	}
}

module.exports = Token;
