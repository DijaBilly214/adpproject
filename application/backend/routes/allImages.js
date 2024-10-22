const {Router} = require('express');
const db = require('../database')
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = Router();

router.use((req,res,next)=>{
  console.log('Request made to /allImages route');
  
  next();
})

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
      cb(null, 'backend/public/images')
    },
    filename: (req, file, cb) =>{
      cb(null, file.fieldname +"_"+Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})



router.post('/:imageType/:id', upload.single('image'), (req, res) => {
  const { imageType, id } = req.params;
  console.log("backend connecting... adding image...")
    if(imageType === 'blog_upload') {
        table = 'post';
    }else if(imageType === 'animal_upload') {
        table = 'animal'
    } else {
        return res.status(401).send('Please log in.');
    }

  
  const image = req.file.filename; // name of the image

  // Check permission
  db.query(`SELECT * FROM ${table} WHERE id = ?`, [id])
      .then(([results, fields]) => {
          if (results && results.length === 0) {
              throw new Error("Invalid id.");
          }

          // Update imageLink in the database
          const sql = `UPDATE ${table} SET imageLink = ? WHERE id = ?`;
          return db.query(sql, [image, id]);
      })
      .then(result => {
          if (result.affectedRows > 0) {
              // Image update was successful
              res.status(200).send('Upload new image to ' + table);
          } else {
              // No rows were affected, meaning the record with the given id doesn't exist
              res.status(404).send('Record not found');
          }
      })
      .catch(err => {
          // Error occurred during the query
          res.status(400).send(err.message);

          // Remove the uploaded file
          const filePath = `backend/public/images/${image}`; // Adjust the path accordingly
          fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) {
                  console.error('Error deleting file:', unlinkErr);
              } else {
                  console.log('File deleted successfully');
              }
          });
      });
});

router.post('/temp_upload', upload.single('image'), (req, res) => {
  console.log("backend connecting... adding temp image...")
  const image = req.file.filename; // name of the image
  res.status(200).json(image);
});

router.get('/:imageType/:id', async (req, res) => {
  console.log("backend connecting... getting image...")
  const { imageType, id } = req.params;
  let table;
  if(imageType === "blog_image"){
    table = "post";
  }else if(imageType === "animal_image"){
    table = "animal";
  }else{
    res.status(400).send("Please log");
  }
    try {
      const sql = `SELECT * FROM ${table} WHERE id = ${id}`;
      const result = await db.query(sql);
      res.json(result);
    } catch (err) {
      res.status(400).send(err.message);
    }
});

    router.get('/', async (req, res) => {
      try {
        console.log("backend connecting... getting image...")
        const sql = `SELECT * FROM post WHERE fk_uid = 4`;
        const result = await db.query(sql);
        res.json(result);
      } catch (err) {
        res.status(400).send(err.message);
      }
    });

module.exports = router;

