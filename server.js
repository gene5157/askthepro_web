const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
const router = jsonServer.router('./api/db.json')
const userdb = JSON.parse(fs.readFileSync('./api/db.json', 'UTF-8'))
server.use(jsonServer.defaults());
server.use(bodyParser.json())
const SECRET_KEY = '123456789'
const expiresIn = '2h'

// Create a token from a payload 
function createToken(payload){
    return jwt.sign(payload, SECRET_KEY, {expiresIn})
  }
  
  // Verify the token 
  function verifyToken(token){
    return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
  }
  
  // Check if the user exists in database
  function isAuthenticated({email, password}){
    var passwordHash = require('./node_modules/password-hash/lib/password-hash');
    return userdb.user.findIndex(user => user.email === email && passwordHash.verify(password, user.password)) !== -1
  }
  function storeToken({access_token}){
    localStorage.setItem('id_token',access_token.access_token)
  }
  //get user role
  function getRole({email}){
    var role=""
    userdb.user.findIndex(user => {
      if(user.email === email){
        role = user.role
      }
    })
    return role
  }

  //generate hashing for password
  function generateHash({password}){
    var passwordHash = require('password-hash');
    var hashedPassword1 = passwordHash.generate(password,{algorithm: 'sha256' });
    console.log(hashedPassword1)
    return hashedPassword1
  }
 

  server.post('/pass-hash',(req,res)=> {
    console.log(req.body)
    const {password} = req.body
    var hashedPassword2 = generateHash({password})
    res.status(200).json({status:200,hashedPassword2})
    return
  })

  server.post('/auth/login', (req, res) => {
    console.log(req.body)
    const {email, password} = req.body
    if (isAuthenticated({email, password}) === false) {
      const status = 401
      const message = 'Incorrect email or password'
      res.status(status).json({status, message})
      return
    }
    const role = getRole({email})
    const access_token = createToken({email, password, role})
    res.status(200).json({status:200,access_token})
    
  })
  
  server.use(/^(?!\/auth).*$/,  (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
      const status = 401
      const message = 'Bad authorization header'
      res.status(status).json({status, message})
      return
    }
    try {
       verifyToken(req.headers.authorization.split(' ')[1])
       next()
    } catch (err) {
      const status = 401
      const message = 'Error: access_token is not valid'
      res.status(status).json({status, message})
    }
  })
  server.use(router)
 // server.use('/api/questions')

server.listen(3002, () => {
  console.log('Run Auth API Server')
})