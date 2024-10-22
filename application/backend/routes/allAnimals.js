const {Router, response} = require('express');
const db = require('../database')

const router = Router();

router.use((req,res,next)=>{
    console.log('Request made to /allAnimals route');
    next();
})

router.get('/', async (req, res)=>{
  console.log("backend connecting... getting all animal info...")
  console.log(req.session)
    const results = await db.query(`SELECT * FROM animal ORDER BY id DESC`)
    //console.log(results[0]);

    res.status(200).json(results[0]);
});

router.get('/pull_pet', async (req, res)=>{
  console.log("backend connecting... pulling pet...")
  console.log(req.session)
    const results = await db.query(`SELECT * FROM animal Where fk_sid = ${req.session.userId} ORDER BY id DESC`)
    //console.log(results[0]);
    res.status(200).json(results[0]);
});

router.post('/addPet', (req, res, next) => {
  console.log("backend connecting... adding pet...")

    if (req.session.userType === 'shelter') {
      console.log('shelter login...');
      const sid = req.session.userId;
      const { animalname, species, breed, gender, age, comment, color } = req.body;
      let newAnimalId  
      db.execute('insert into animal (animalname, species, breed, status, gender, age, comment, color, fk_sid) value (?,?,?,?,?,?,?,?,?)', [animalname, species, breed, "waiting", gender, age, comment, color, sid])
        .then(([results, fields]) => {
          if (results && results.affectedRows === 1) {
            console.log('Adding application...');
            console.log(`Hi ${req.session.username}, adding pet successfully.`);
            return  db.execute('insert into application (fk_sid, fk_aid, status) value (?,?,?)', [sid, results.insertId, "waiting"]);
          } else {
            throw ("Can't add pet, check any missing information of the pet.");
          }
        }).then(([results, fields]) => {
          if (results && results.affectedRows === 1) {
            console.log("newAnimalId: ", newAnimalId)
            res.status(200).json(newAnimalId);
          } else {
            throw ("Can't create a new application");
          }
        })
        .catch((error) => {
          res.status(400).send(error.message);
        });
    } else {
      res.status(401).send('Only shelters can add pets. Please log in.');
    }
  });
  
router.post("/update_animal", (req, res, next)=>{
    console.log("backend connecting... updating animal...")
    if (req.session.userType === 'shelter') {
      const {id, animalname,species,breed,gender,age,comment,color} = req.body; 

      db.query('select fk_sid from animal where id=?',[id])
        .then(([results, fields])=>{
          if(results && results.length === 1){
            console.log(req.session.userId, results[0].fk_sid)
            return req.session.userId === results[0].fk_sid
          }else{
          throw "Failed animal id: Invalid animal";
          }
        })
        .then((idMatch)=>{
          if(idMatch) {
            db.query('UPDATE animal SET animalname = ?, species = ?, breed = ?, gender = ?, age = ?, comment = ?, color = ? WHERE id = ?;',[animalname,species,breed,gender,age,comment,color,id])
            .then(([results, fields])=>{
              if(results && results.affectedRows == 1){
                res.status(200).send("Updated ANIMAL infor");
              }else{
                throw "ANIMAL infor could not be updated";
              }
            })
          }else{
            throw "The animal does NOT belong to this shelter"
          }
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    }else{
      res.status(401).send('Please log in as SHELTER to change your information');
    }
  })

  router.put('/updateStatus/:animalId', async (req, res) => {
    const { animalId } = req.params;
    const { status } = req.body;
  
    try {
      await db.execute('UPDATE animal SET status = ? WHERE id = ?', [status, animalId]);
      res.status(200).send('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).send('Server Error');
    }
  });
  

module.exports = router;
