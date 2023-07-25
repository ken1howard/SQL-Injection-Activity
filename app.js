const http = require('http'),
	path = require('path'),
	express = require('express'),
	bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const db = new sqlite3.Database(':memory:');
db.serialize(function () {
	db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
	db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});


app.get('/', function (req, res) {
    res.sendFile('index.html');
});


app.post('/login', function (req, res) {
	let { username, password} = req.body;
	let query = `SELECT title FROM user where username = '${username}' AND '${password}'`;

	console.log(`username:  ${username}, paswword = ${password}, query=${query}`);

	db.get(query, (err, row) => {
		if (err) {
			console.log(err);
			res.redirect("/index.html#error");
		} else if (!row) {
			res.redirect("/index.html#unauthorized");
		} else {
			res.send( `<div class='success'>
            <h1> Welcome ${row.title}</h1>
            <p>
                This file contains all your secret data: 
                <br>
                SECRETS 
                <br>
                Account Info
                </p> 
                </div>`);
            }
		})
	});

app.listen(3000);
console.log("listening on post 3000");