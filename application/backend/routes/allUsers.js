const express = require('express');
const db = require('../database');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const bcrypt = require('bcrypt');
const app = express();

const {check, validationResult} = require('express-validator');
const { json } = require('body-parser');

const router = express.Router();

router.use((req, res, next) => {
  console.log("Session Data:", req.session);
  next();
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  key: 'userId',
  secret: 'changelatersecret',
  resave: false,
  saveUninitialized: true
}));

router.use((req,res,next)=>{
    console.log('Request made to /users route');
    next();
})

//to debug only
// router.get('/', async (req, res)=>{
//     const results = await db.query(`SELECT * FROM shelter_users where id =2`)
//     console.log(results[0]);
//     res.send(200);
//     } 
// );

router.post('/create_normal', async (req, res, next)=>{
    const {username, password, email, firstname, lastname, occupation, desire, age, phone} = req.body; 
    console.log("backend connecting... creating user...")
    db.query('select id from normal_users where username=?', [username])
    .then(([results, fields])=>{
      if(results && results.length === 0){
        return db.query('select id from normal_users where email=?',[email])
      }else{
        throw "username already exists";
      }
    }).then(async ([results, fields])=>{
      if(results && results.length === 0){
        return bcrypt.hash(password,2);
      }else{
        throw "email already exists";
      }
    }).then((hashedPassword)=>{
      return db.execute('insert into normal_users (username, password, email, firstname, lastname, occupation, desire, age, phone) value (?,?,?,?,?,?,?,?,?)', 
        [username, hashedPassword, email, firstname, lastname, occupation, desire, age, phone]);
    }).then(([results, fields])=>{
      if(results && results.affectedRows == 1){
        res.status(201).send("Created User");
      }else{
        throw "user could not be made";
      }
    }).catch((error) => {
      res.status(400).send(error);
    });
}); 

router.post('/create_shelter', async (req, res, next)=>{
    const {username, password, email, address, website, phone} = req.body; 
    console.log("backend connecting...")
    console.log("creating shelter...")
    db.query('select id from shelter_users where sheltername=?', [username])
    .then(([results, fields])=>{
      if(results && results.length === 0){
        return db.query('select id from shelter_users where email=?',[email])
      }else{
        throw "sheltername already exists";
      }
    }).then(async ([results, fields])=>{
      if(results && results.length === 0){
        return bcrypt.hash(password,2);
      }else{
        throw "email already exists";
      }
    }).then((hashedPassword) => {
      return db.execute(
        'insert into shelter_users (sheltername, password, email, address, website, phone) value (?,?,?,?,?,?)',
        [username, hashedPassword, email, address, website, phone]
      );
    }).then(([results, fields]) => {
      if (results && results.affectedRows === 1) {
        // The insertion was successful
        console.log("Creating...");
        res.status(201).send("Created shelter");
      } else {
        // The insertion failed
        throw "shelter could not be made";
      }
    })
    .catch((error)=>{
      res.status(400).send(error);
    });

}); 

router.post("/normal_login", (req, res, next)=>{  
    console.log("backend connecting...")

    if (req.body.type === "user") {
      console.log("user login...");
    } else {
      res.status(401).send("wrong login type, should be user")
    }
  
    req.session.userType = req.body.type;
    const {username, password} = req.body;
    let loggedUserId;
    let loggedUsername;
  
    db.query('select id, username, password from normal_users where username=?',[username])
    .then(([results, fields])=>{
      if(results && results.length === 1){
        loggedUserId = results[0].id;
        loggedUsername = results[0].username;
        //console.log(results[0],loggedUserId,loggedUsername)
        let dbPassword = results[0].password;
        return bcrypt.compare(password, dbPassword);
      }else{
        throw"Failed Login: Invalid user credentials" ;
      }
    })
    .then((passwordsMatched)=>{
      if(passwordsMatched){
        req.session.userId = loggedUserId;
        req.session.username = loggedUsername;
        req.session.save((saveErr)=>{
          //res.redirect('/');
          if (saveErr) {
            res.status(500).send("Error saving session");
          } else {
            const sessionData = {
              userType: req.session.userType,
              userId: req.session.userId,
              username: req.session.username,
            };
            console.log(sessionData);
            res.status(200).json({ message: `Hi ${loggedUsername}, you are now logged in.`, session: sessionData });
          }
        });
      }else{
        throw 'Failed Login: Invalid user credentials';
      }
    })
    .catch((error)=>{
      res.status(401).send(error);
    })
});

router.post("/shelter_login", (req, res, next)=>{
  console.log("backend connecting...")

    if (req.body.type === "shelter") {
      console.log("trying to shelter login...");
    } else {
      res.status(401).send("wrong login type, should be shelter")
    }
    req.session.userType = req.body.type;
    const {username, password} = req.body;
    let loggedUserId;
    let loggedUsername;
  
    db.query('select id, sheltername, password from shelter_users where sheltername=?',[username])
    .then(([results, fields])=>{
      if(results && results.length === 1){
        loggedUserId = results[0].id;
        loggedUsername = results[0].sheltername;
        let dbPassword = results[0].password;
        return bcrypt.compare(password, dbPassword);
      }else{
       throw "Failed Login: Invalid shelter credentials";
      }
    })
    .then((passwordsMatched)=>{
      if(passwordsMatched){
        req.session.userId = loggedUserId;
        req.session.username = loggedUsername;
        req.session.save((saveErr)=>{
          //res.redirect('/');
          res.status(200).send(`Shelter ${loggedUsername}, you are now logged in.`);
        })
      }else{
        throw 'Failed Login: Invalid shelter credentials';
      }
    })
    .catch((error)=>{
      res.status(401).send(error)
    })
});

router.post("/update_normal", (req, res, next)=>{
  console.log("backend connecting... updating user...")
  if (req.session.userType === 'user') {
    const {firstname, lastname, occupation, desire, age, phone} = req.body; 
    db.query('UPDATE normal_users SET firstname = ?, lastname = ?, occupation =?, desire=?, age =?,  phone = ? WHERE id = ?;',[firstname, lastname, occupation, desire, age, phone, req.session.userId])
    .then(([results, fields])=>{
      if(results && results.affectedRows == 1){
        res.status(200).send("Updated User infor");
      }else{
        throw "user infor could not be updated";
      }
    }).catch((error) => {
      res.status(400).send(error);
    });
  }else{
    res.status(401).send('Please log in as USER to change your information');
  }
})

router.post("/update_shelter", (req, res, next)=>{
  console.log("backend connecting... updating shelter...")
  if (req.session.userType === 'shelter') {
    const {address, website,phone} = req.body; 
    db.query('UPDATE shelter_users SET address = ?, website = ?, phone = ? WHERE id = ?;',[address, website, phone, req.session.userId])
    .then(([results, fields])=>{
      if(results && results.affectedRows == 1){
        res.status(200).send("Updated Shelter infor");
      }else{
        throw "shelter infor could not be updated";
      }
    }).catch((error) => {
      res.status(400).send(error);
    });
  }else{
    res.status(401).send('Please log in as SHELTER to change your information');
  }
})

router.post("/update_password", (req, res, next)=>{
  console.log("backend connecting... updating password...")

  const {oldPassword, newPassword} = req.body;
  let userTable;
  if (req.session.userType === 'shelter') {
    userTable = 'shelter_users'
  } else if (req.session.userType === 'user') {
    userTable = 'normal_users'
  } else {
    res.status(401).send("wrong login type, should be shelter or user")
  }
  
  const tableID = req.session.userId;

  db.query(`select password from ${userTable} where id=${tableID}`)
  .then(([results, fields])=>{
    if(results && results.length === 1){
      let dbPassword = results[0].password;
      return bcrypt.compare(oldPassword, dbPassword);
    }else{
     throw "Failed pull password: Invalid credentials";
    }
  })
  .then((passwordsMatched)=>{
    if(passwordsMatched){
      return bcrypt.hash(newPassword,2);
    }else{
      throw 'Failed update password: Invalid credentials';
    }
  })
  .then((hashedPassword)=>{
    return db.execute(`UPDATE ${userTable} SET password = ? WHERE id = ${tableID}`,[hashedPassword]);
  })
  .then(([results, fields])=>{
    if(results && results.affectedRows == 1){
      res.status(200).send("Update your password");
    }else{
      throw "Password could not be updated";
    }
  })
  .catch((error)=>{
    res.status(401).send(error)
  })

})

router.post("/reset_password", (req, res, next)=>{
  console.log("backend connecting... reseting password...")

  const {type, username, email, newPassword} = req.body;
  let userTable;
  let name;
  if (type === 'shelter') {
    userTable = 'shelter_users'
    name = 'sheltername'
  } else if (type === 'user') {
    userTable = 'normal_users'
    name = 'username'
  } else {
    res.status(401).send("wrong user type, should be shelter or user")
  }

  db.query(`select email from ${userTable} where ${name} = '${username}'`)
    .then(([results, fields])=>{
      if(results && results.length === 1){
        return email === results[0].email;
      }else{
      throw "Failed pull the user: Invalid credentials";
      }
    })
    .then((emailMatch)=>{
      if(emailMatch){
        return bcrypt.hash(newPassword,2);
      }else{
        throw 'Failed find the user: Invalid credentials';
      }
    })
    .then((hashedPassword)=>{
      return db.execute(`UPDATE ${userTable} SET password = ? WHERE ${name} = ?`,[hashedPassword, username]);
    })
    .then(([results, fields])=>{
      if(results && results.affectedRows == 1){
        res.status(200).send("Reset your password");
      }else{
        throw "Password could not be reset";
      }
    })
    .catch((error)=>{
      res.status(401).send(error)
    })

});

router.get("/login_status", (req, res) => {
  if (req.session && req.session.userId) {
    const sessionData = {
      userType: req.session.userType,
      userId: req.session.userId,
      username: req.session.username,
    };
  res.status(200).json({ loggedIn: true, session: sessionData });
  } 
  else {
    res.status(200).json({ loggedIn: false });
  }
});

router.post("/logout", (req, res, next)=>{
  console.log("backend connecting...")

    req.session.destroy((destroyError)=>{
      if(destroyError) {
        next(err);
      }else{
        //console.log("out")
        res.json({
          status: 204,
          message: "You have been log out",
        });
      }
    })
});

module.exports = router;