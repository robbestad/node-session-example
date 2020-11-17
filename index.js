const express = require("express");
const expressSession = require("express-session");

const app = express();
app.use(expressSession({
	secret: "zathras knows all",
	resave: true,
	saveUninitialized: true,
	cookie: {secure: false}
}))
app.get("/session", (req, res) => {
	res.send(
		req.session["authenticated"]
	)
})
app.post("/login", (req, res) => {
	req.session["authenticated"] = true;
	res.status(200).redirect("/");
})
app.post("/logout", (req, res) => {
	delete req.session["authenticated"];
	res.status(200).redirect("/");
})
const authMiddleware = (req, res, next) => {
	if (req.session["authenticated"]) {
		return next();
	} else {
		return res.status(401).send()
	}
}
app.get("/hiddenmessage", authMiddleware, (req, res) => {
	res.sendFile(require("path").join(__dirname, "secret/joke.txt"));
})
app.use("*", express.static(require("path").join(__dirname, "public")));

app.listen(process.env.PORT || 8666);
