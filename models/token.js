var crypto = require("crypto");
const Client = require("./client");
const User = require('./User');

var algorithm = "aes-192-cbc";
var password = "*insert_secret_key_here*";
const key = crypto.scryptSync(password, 'salt', 24);

const iv = Buffer.alloc(16, 0);
const authWindow = 10 * 60 * 1000;


// Class Token contains the implementation required for auth token operations,
// including token creation and obtaining user details post credential verification
class Token {

	constructor(userID, clientID) {
		const cipher = crypto.createCipheriv(algorithm, key, iv);

		let requestDate = new Date();
		let infoString = userID + "___" + clientID + "___" + requestDate;

		this.authToken = cipher.update(infoString, 'utf8', 'hex') + cipher.final('hex');
	}

	static async getUserProfile(tkn, clientSecret, claimList) {
		var decryptedToken = this.decryptToken(tkn);

		const ldap = decryptedToken.split("___")[0];
		const clientID = decryptedToken.split("___")[1];
		const requestDate = new Date(decryptedToken.split("___")[2]).getTime();

		if (new Date() <= new Date(requestDate + authWindow)) {
			if (Client.assertCreds(clientID, clientSecret)) {
				let user = await User.fetchFromDB(ldap);
				user = user.getClaim(...claimList);
				return {
					success: true,
					user
				};
			} else {
				return {
					success: false,
					err: "client Err"
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