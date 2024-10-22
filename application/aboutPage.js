const {Router} = require('express');
const path = require('path')

const router = Router();
let viewPath = path.join(__dirname, 'frontend');

router.get('/', (req, res)=>{
    //res.render('index',{title:"CSC 648 APP", name: "Team 01"})
    res.sendFile(`${viewPath}/about.html`)
});

router.get('/:namePage', (req, res)=>{
    let namePath = req.params.namePage;
    res.sendFile(`${viewPath}/${namePath}`)
});

router.post('/', (req, res)=>{

});


// app.get('/',(req,res)=> {
//     
// });
// app.get('/about.html',(req,res)=> {
//     res.sendFile(`${viewPath}/about.html`)
// });
// app.get('/aboutKT.html',(req,res)=> {
//     res.sendFile(`${viewPath}/aboutKT.html`)
// });
// app.get('/aboutQC.html',(req,res)=> {
//     res.sendFile(`${viewPath}/aboutQC.html`)
// });
// app.get('/aboutEA.html',(req,res)=> {
//     res.sendFile(`${viewPath}/aboutEA.html`)
// });
// app.get('/aboutAB.html',(req,res)=> {
//     res.sendFile(`${viewPath}/aboutAB.html`)
// });
// app.get('/aboutBK.html',(req,res)=> {
//     res.sendFile(`${viewPath}/aboutBK.html`)
// });
// app.get('/aboutKK.html',(req,res)=> {
//     res.sendFile(`${viewPath}/aboutKK.html`)
// });


module.exports = router;