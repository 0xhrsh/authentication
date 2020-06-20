function client(clientID, clientSecret, redirectURL) {
	this.clientID = clientID;
	this.clientSecret = clientSecret;
	this.redirectURL = redirectURL;
}

client.prototype.assertClientCreds = function () {
	// match credentials from db
	return true;
};

module.exports = client;