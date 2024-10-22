const express = require('express');
const session = require('express-session');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3003;
var sessionStore = new session.MemoryStore();

// const corsOptions = {
//     origin: 'http://localhost:3000', // Replace with the actual URL of your React frontend
// };

//routers:
const allAnimals = require('./routes/allAnimals')
const allUsers = require('./routes/allUsers')
const allApplications = require('./routes/allApplications')
const allPosts = require('./routes/allPosts')
const allImageUpload = require('./routes/allImages')

//app.use(cors(corsOptions));
app.use(express.json())
app.use(cors());
app.use(express.static('backend/public'))

app.use((req, res, next)=>{
    console.log(`${req.method}:${req.url}`);
    next();
}); 
app.use(
    session({
      secret: "csc648 secret",    
      cookie:{ maxAge: 300000 },
      store: sessionStore,        //store session id
      resave: false,              //force to resave on every session even if not modified
      saveUninitialized: false,   //save if no one log in
    })
  );
app.use((req,res,next)=>{
    //console.log(req.session);
    if(req.session.username){
      res.locals.isLoggedIn = true;
      res.locals.username = req.session.username;
    }
    next();
  });

app.use('/allAnimals',allAnimals)
app.use('/users',allUsers)
app.use('/allApplications',allApplications)
app.use('/allPosts', allPosts)
app.use('/allImages', allImageUpload)

app.use((req,res)=>{
    res.status(404).send("Error 404: Resource not found")
});

app.listen(port, ()=>console.log(`Running Express Server on Port ${port}`));