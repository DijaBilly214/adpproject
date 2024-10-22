const mysql = require('mysql2');
//const fs = require('fs');


const pool = mysql.createConnection({
    host: "csc648db.cplpltrvxq2e.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "Password123",
    database: "csc648db",
});

const promisePool = pool.promise();
//to use the pool in other files
module.exports = promisePool;
 