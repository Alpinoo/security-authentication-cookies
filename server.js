const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const helmet = require('helmet');


const PORT = 3000;

const config ={
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET
}


const app = express();

app.use(helmet()); //* this is for added security to the https requests.(ex: x-powered-by info doesn't leak for hackers to be informed how we developed the app)

const checkLogin = (req,res,next)=>{ //middleware
  const canAccess = true
  if(!canAccess){
    return res.status(401).send({
      error: "You have to sign in."
    })
  }
  next()
}

app.get('/auth/google',(req,res)=>{ //before redirecting google auth

})

app.get('/auth/google/callback',(req,res)=>{ //for redirecting google auth 

})

app.get('/auth/logout', (req,res)=>{ //for logging out from any account regardless of name

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