var crypto = require("crypto");
const {
	timeStamp
} = require("console");

const Client = require("./Client");
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

	getUserProfile(clientSecret, claimList) {
		var decrytedToken = this.decrptyToken();

		const ldap = decrytedToken.split("___")[0];
		const clientID = decrytedToken.split("___")[1];
		const requestDate = new Date(decrytedToken.split("___")[2]).getTime();

		if (new Date() <= new Date(requestDate + authWindow)) {
			const thisClient = new Client(clientID, clientSecret, "");
			return new Promise(async (resolve, reject) => {
				if (thisClient.assertClientCreds()) {
					const user = User.fetchFromDB(ldap);
					user.getClaim(...claimList);
					resolve(user);
				} else {
					resolve(false); //TODO: return Client invalid error
				}
			});
		}
		//TODO: return auth window expired error
	}

	decrptyToken() {
		const decipher = crypto.createDecipheriv(algorithm, key, iv);
		return decipher.update(this.authToken, 'hex', 'utf8') + decipher.final('utf8');
	}
}

module.exports = Token;