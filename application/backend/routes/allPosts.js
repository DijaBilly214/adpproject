const {Router} = require('express');
const db = require('../database')

const router = Router();

router.use((req,res,next)=>{
    console.log('Request made to /allPosts route');
    
    next();
})

router.get('/', async (req, res)=>{
  console.log("backend connecting...")

    const results = await db.query(`SELECT * FROM post`)
    console.log(results[0]);

    res.status(200).json(results[0]);
});

router.post('/create_post', (req, res,next)=>{
  console.log("backend connecting...")

    if (req.session.userType === 'user') {
        console.log("start creating post.....")

        const { Title, description, picture, thumbnail,fk_sid, fk_aid} = req.body;
        fk_uid = req.session.userId;
        db.execute('INSERT INTO post (Title, description, fk_uid,fk_sid, fk_aid) VALUE (?,?,?,?,?)',[Title, description, fk_uid,fk_sid, fk_aid])
        .then(([results, fields]) => {
            if (results && results.affectedRows === 1) {
              res.status(200).send('Created new post');
            } else {
              throw ("Can't create a new post");
            }
          }).catch((error) => {
            res.status(400).send(error.message);
          });
    }else{
        res.status(401).send('Please log in as USER.');
    }
});

module.exports = router;