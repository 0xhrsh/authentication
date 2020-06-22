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
app.get("/loginPage", async (req, res) => {
	if(await Client.exist(req.query.client_id)){
		res.send(
			loginPageRenderer(req.query.client_id, req.query.claims.split(','))
		);
	} else {
		res.send("Client is not registered");
	}
});

app.post("/authEP", async (req, res) => {
	if(await User.assertlogin(req.body.username, req.body.password)){
		let tkn = new Token(req.body.username, req.body.client_id, req.body.claims.split(','));
		let redirect_uri = await Client.getRedirectURI(req.body.client_id);
		redirect_uri?
			res.redirect(redirect_uri+"?tkn="+tkn.authToken):
			res.send("Client is not registered");
	} else {
		res.send({
			success: false, 
			err: "Username/Password Doesn't match"
		});
	}
});

app.get("/dataEP", async (req, res)=> {
	res.send(await Token.getUserProfile(
		{ authToken: req.query.tkn }, 
		req.query.client_secret
	));
});

///////////////////////////////// EXAMPLE
app.get("/", (req, res) => {
	res.redirect(`/loginPage?client_id=LHC_portal&claims=user_id,username,phone_no`);
});

app.get("/exampleRedirectPoint", (req, res) => {
	res.redirect(`/dataEP?tkn=${req.query.tkn}&client_secret=top_secret`);
});

///////////////////////////////// LISTENING
app.listen(port, () => {
	console.log(`Authentication app listening at http://localhost:${port}`);
});