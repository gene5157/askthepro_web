var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');
var passwordHash = require('./node_modules/password-hash/lib/password-hash');
const jwt = require('jsonwebtoken')
const SECRET_KEY = '123456789'
const expiresIn = '2h'
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'askthepro'
});

var app = express();
app.use(cors());
// Create a token from a payload 
function createToken(payload){
    return jwt.sign(payload, SECRET_KEY, {expiresIn})
  }
  
  // Verify the token 
  function verifyToken({token}){
    return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
  }
//generate hashing for password
function generateHash({password}){
    var passwordHash = require('password-hash');
    var hashedPassword1 = passwordHash.generate(password,{algorithm: 'sha256' });
    console.log(hashedPassword1)
    return hashedPassword1
}

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/verify',(req,res)=> {
  const {token} = req.body
  var isVerify = verifyToken({token})
  // const {token} = req.body
  // var hashedPassword2 = generateHash({password})
  res.status(200).json({status:200,isVerify})
  return
})

app.post('/pass-hash',(req,res)=> {
  console.log(req.body)
  const {password} = req.body
  var hashedPassword2 = generateHash({password})
  res.status(200).json({status:200,hashedPassword2})
  return
})

app.post('/auth/login', function(request, response) {
	var email = request.body.email;
    var password = request.body.password;
    console.log(request.body)
	if (email && password) {
		connection.query('SELECT id,username,email,password,role FROM users WHERE email = ?', [email,password], function(error, results, fields) {
            //console.log(passwordHash.verify(password,results[0].password))
            if (results.length > 0 && passwordHash.verify(password,results[0].password) == true ) {
				request.session.loggedin = true;
                request.session.username = results[0].username;
                var email = results[0].email;
                var pass = results[0].password;
                var role = results[0].role;
                const access_token = createToken({email, pass, role})
                //console.log(access_token)
               // response.json({status:200,access_token})
               response.send({'status':200,'access_token':access_token})
                //response.redirect('/home');
                response.end();
			} else {
                response.send({'status':500, 'error':'Incorrect Username and/or Password!'});
                response.end();
			}			
			
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// app.get('/home', function(request, response) {
// 	if (request.session.loggedin) {
// 		response.send('Welcome back, ' + request.session.username + '!');
// 	} else {
// 		response.send('Please login to view this page!');
// 	}
// 	response.end();
// });

app.listen(3002, () => {
    console.log('Run Auth API Server')
  })