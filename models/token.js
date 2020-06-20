var crypto = require("crypto")
const {timeStamp} = require("console")
var algorithm = "aes-192-cbc"
var password = "Hello darkness"
const key = crypto.scryptSync(password, 'salt', 24)
const iv = Buffer.alloc(16, 0)

function Token(authToken) {
    this.authToken = authToken
}

Token.prototype.generateToken = function (userID, clientID) {
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    this.authToken = cipher.update(userID + "___" + clientID, 'utf8', 'hex') + cipher.final('hex')
}

Token.prototype.getUserProfile = function () {
    var decrytedToken = this.decrptyToken()
    ldap = decrytedToken.split("___")[0]
    clientID = decrytedToken.split("___")[1]
}


Token.prototype.decrptyToken = function () {
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    return decipher.update(this.authToken, 'hex', 'utf8') + decipher.final('utf8')
}

module.exports = Token