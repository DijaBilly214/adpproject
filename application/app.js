const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
// const http = require('http');

const port = 3000;
const path = require('path')

const local = require('./backend/strategies/local')
const userRouter = require("./backend/routes/users");
//const aboutPageRouter = require("./aboutPage");
//const homeRouter = require("./frontend/temp.html")
const homeRouter = require("./backend/routes/index")
const loginRouter = require("./backend/routes/login");
const applicationRouter = require("./backend/routes/application");


//const store = new session.MemoryStore();

const app = express();
let viewPath = path.join(__dirname, 'frontend');

app.use(express.json());
// app.use(session({
//     secret: 'some secret',
//     cookie: { maxAge: 300000},
//     saveUninitialized: false,
//     store
// }))
app.use((req, res, next)=>{
    console.log(`${req.method}:${req.url}`);
    next();
}); 
// app.use(passport.initialize());
// app.use(passport.session());
//app.use(express.static(path.join(__dirname, 'frontend')));
//app.use('/', aboutPageRouter);
app.get('/', (req, res)=>{
    //res.render('index',{title:"CSC 648 APP", name: "Team 01"})
    res.sendFile(`${viewPath}/temp.html`)
});
app.use('/data', homeRouter);
app.use('/users', userRouter);
app.use('/login', loginRouter);
app.use('/application', applicationRouter);

app.use((req,res)=>{
    res.status(404);
    res.send("Error 404: Resource not found")
});


app.listen(port, ()=>console.log(`Running Express Server on Port ${port}`));