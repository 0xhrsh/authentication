function Client(clientID, clientSecret, redirectURL) {
	this.clientID = clientID;
	this.clientSecret = clientSecret;
	this.redirectURL = redirectURL;
}

Client.prototype.assertClientCreds = function () {
	// match credentials from db
	return true;
};

module.exports = Client;