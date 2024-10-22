const {Router} = require('express');
const db = require('../database')

const router = Router();

router.use((req,res,next)=>{
    console.log('Request made to /allApplications route');
    
    next();
})

router.get('/', async (req, res)=>{
    console.log("backend connecting... pulling all app...")

    const results = await db.query(`SELECT * FROM application`)
    console.log(results[0]);

    res.status(200).json(results[0]);
});

router.post('/user_application', (req, res,next)=>{
    console.log("backend connecting... creating user app...")

    if (req.session.userType === 'user') {
        const uid = req.session.userId;
        const { aid} = req.body;
        let sid;
        db.query('SELECT fk_sid, status FROM animal WHERE id =?', [aid])
        .then(([results,fields])=>{
            if(results && results.length === 1 && results[0].status === "waiting"){
                sid = results[0].fk_sid
                return db.query('SELECT id FROM application WHERE fk_sid =? AND fk_aid =? AND fk_uid =?', [sid , aid, uid])
            }else{
                throw "No such pet need to be adopted"
            }
        }).then(([results,fields])=>{
            if(results && results.length === 0){
                return db.execute('insert into application (fk_sid, fk_uid, fk_aid, status) value (?,?,?,?)', [sid, uid, aid, "waiting"]);
            }else{
                throw "You already apply."
            }
        }).then(([results,fields])=>{
            if(results && results.affectedRows === 1){
                res.status(200).send('Created new application');
            }else{
                throw "Something Wrong, application can't build."
            }
        })
        .catch((error)=>{
            res.status(400).send(error);
        })
    }else{
        res.status(401).send('Please log in as USER.');
    }
});

router.get('/pull_applications', (req, res,next)=>{
    console.log("backend connecting... pull the app for this shelter/user...")
    const {userType, userId} = req.session;

    if (userType === 'shelter') {

        db.query('SELECT app.id AS application_id, shelter.sheltername, user.username AS username, animal.id AS animal_id, animal.animalname, app.status FROM application app JOIN shelter_users shelter ON app.fk_sid = shelter.id LEFT JOIN normal_users user ON app.fk_uid = user.id JOIN animal ON app.fk_aid = animal.id WHERE app.fk_sid = ?', [userId])
        .then(([results, fields]) => {
          if (results && results.length > 0) {
            console.log(results);
            res.status(200).json(results);
          } else {
            res.status(400).send("no appliction is found for this shelter");
          }
        }) 

    } else if (userType === 'user') {

        db.query('SELECT app.id AS application_id, user.username AS username, shelter.sheltername,  animal.animalname, app.status FROM application app JOIN shelter_users shelter ON app.fk_sid = shelter.id JOIN normal_users user ON app.fk_uid = user.id JOIN animal ON app.fk_aid = animal.id WHERE app.fk_uid = ?', [userId])
        .then(([results, fields]) => {
          if (results && results.length > 0) {
            console.log(results);
            res.status(200).json(results);
          } else {
            res.status(400).send("no appliction is found for this user");
          }
        }) 

    } else {
        res.status(401).send("Wrong type, should only be user or shelter");
    }    
});

router.post('/deal_applications', async (req, res,next)=>{
    console.log("backend connecting... dealing app...")

    if (req.session.userType === 'shelter') {
        const fk_sid = req.session.userId;
        const {id, fk_aid, status} = req.body;
        console.log("shelter id: ", fk_sid);
        if(!(status === "approved" || status === "deny")) {
            return res.status(401).send('Status can only be approved or deny.');
        }
        // [results] = await db.query('SELECT * FROM animal WHERE id = ?', [fk_aid]);
        // aid_status = results[0].status
        // console.log("DB animal status: ", aid_status)
        let resetStatus = false;    //deny and reset this application bc the pet is adpoted
        let uidNull = true
        db.query('SELECT * FROM application WHERE fk_sid =? AND id=?', [fk_sid, id])
        .then(([results, fields])=>{
            if(results && results.length === 1){
              console.log("application updating...")
              return db.query('SELECT * FROM animal WHERE id = ?', [fk_aid]);
            }else{
              throw "no such application";
            }
        }).then(([results, fields])=>{
            if(results && results.length === 1 ){
              console.log("check animal avilabe...")
              //tried to approved a adopted animal
              if(status === "approved" && results[0].status ==="adopted"){
                resetStatus = true;
                return db.execute('UPDATE application SET status = ? WHERE id = ?', ["deny", id]);
              }else if(status === "deny" && results[0].fk_uid ===null){
                uidNull = false;
                return db.execute('UPDATE application SET status = ? WHERE id = ?', ["Not Available", id]);
              }
              return db.execute('UPDATE application SET status = ? WHERE id = ?', [status, id]);
            }else{
              throw "no such animal";
            }
        }).then(([results,fields])=>{         
            if(results && results.affectedRows === 1){
                if(resetStatus){
                    throw "the animal is adpoted, auto set this application's state to deny."
                }
                if(!uidNull){
                    res.status(200).send('update the application, set animal to Not Aailable');
                }
                if(status === "approved"){
                    return db.execute('UPDATE animal SET status = ? WHERE id = ?', ["adopted", fk_aid])
                    .then(([results,fields])=>{
                        if(results && results.affectedRows === 1){
                            res.status(200).send('update the application & animal status');
                        }else{
                            res.status(400).send ("Something Wrong, animal table can't update.")
                        }
                    });
                }else{
                    res.status(200).send('update the application');
                }     
            }else{
                throw "Something Wrong, application can't update."
            }
        }).catch((error) => {
            res.status(400).send(error);
        });
    }else{
        res.status(401).send('Please log in as Shelter.');
    }
});

module.exports = router;