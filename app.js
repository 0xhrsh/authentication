const express = require("express"), 
	app = express(), 
	loginPageRenderer = require('./utils/loginPageRender'), 
	cors = require("cors"), 
	bodyParser = require("body-parser"), 
	port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.redirect("/loginPage?client_id=LHC_portal&claims=userid,username,phone_no");
});

app.get("/loginPage", (req, res) => {
	res.send(
		loginPageRenderer(req.query.client_id, req.query.claims.split(','))
	);
});

app.post("/authEP", (req, res) => {
	console.log(req.body);
	res.send();
});

app.post("/dataEP", (req, res)=> {
});

app.listen(port, () => {
	console.log(`Authentication app listening at http://localhost:${port}`);
});