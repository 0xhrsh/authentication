const express = require("express"), 
	app = express(), 
	loginPageRenderer = require('./utils/loginPageRender'), 
	cors = require("cors"), 
	bodyParser = require("body-parser"), 
	port = 3000, 
	User = require("./models/User"), 
	Client = require("./models/client"), 
	Token = require("./models/token");

///////////////////////////////// SETTINGS
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

///////////////////////////////// ROUTES
app.get("/", (req, res) => {
	res.redirect("/loginPage?client_id=abc&claims=user_id,username,phone_no");
});

app.get("/loginPage", (req, res) => {
	res.send(
		loginPageRenderer(req.query.client_id, req.query.claims.split(','))
	);
});

app.post("/authEP", async (req, res) => {
	console.log(req.body);
	if(await User.assertlogin(req.body.username, req.body.password)){
		let tkn = new Token(req.body.username, req.body.client_id);
		let redirect_uri = await Client.getRedirectURI(req.body.client_id);
		res.redirect(redirect_uri+"?tkn="+tkn.authToken);
	} else {
		res.send({
			success: false, 
			err: "Username/Password Doesn't match"
		});
	}
});

app.get("/dataEP", async (req, res)=> {
	let tkn = req.query.tkn;
	let secret = req.query.client_secret;
	res.send(await Token.getUserProfile({authToken: tkn}, secret, ["username", "email_id", "phone_no"]));
});

///////////////////////////////// EXAMPLE
app.get("/exampleRedirectPoint", (req, res) => {
	res.redirect("/dataEP?tkn="+req.query.tkn+"&client_secret=def");
});

///////////////////////////////// LISTENING
app.listen(port, () => {
	console.log(`Authentication app listening at http://localhost:${port}`);
});