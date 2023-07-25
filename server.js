const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport')
const {Strategy} = require('passport-google-oauth20')//take strategy from google auth


require('dotenv').config()

const PORT = 3000;

const config ={
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET
}

const authStrategy = { 
  callbackURL: '/auth/google/callback',
  clientID: config.client_id,
  clientSecret: config.client_secret
}

const verifyOptions = (accessToken,refreshToken,profile,done)=>{//will be called then user is authenticated
  console.log('Authentication completed');
  done(null,profile)//if there's an error, we pass the error instead of null. Second parameter is the profile of the user
}


const app = express();

app.use(helmet()); //* this is for added security to the https requests.(ex: x-powered-by info doesn't leak for hackers to be informed how we developed the app)

app.use(passport.initialize())//function to initialize passport to the code

passport.use(new Strategy(authStrategy,verifyOptions))

const checkLogin = (req,res,next)=>{ //middleware
  const canAccess = true
  if(!canAccess){
    return res.status(401).send({
      error: "You have to sign in."
    })
  }
  next()
}

app.get('/auth/google',passport.authenticate('google',{
  scope:['email'] //which information we want from user
}))

app.get('/auth/google/callback',passport.authenticate('google',{ //redirecting to google auth
  failureRedirect: '/failure',
  successRedirect: '/',
  session:false
},(req,res)=>{
  console.log('Logged in successfully')
}))

app.get('/auth/logout', (req,res)=>{ //for logging out from any account regardless of name

})

app.get('/failure',(req,res)=>{
  res.send('Cannot login!')
})

app.get('/secret', checkLogin, (req, res) => {
  return res.send('Your personal secret value is 42!');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
}, app).listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});