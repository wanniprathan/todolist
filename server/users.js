var express = require('express');
var router = express.Router();
var db = require('./dbconnect'); //database
var bodyparser = require('body-parser').text();
var jwt = require("jsonwebtoken");
var bcrypt = require('bcrypt');

var secret = "Oops!";// used to create the token


//endpoint: POST users------------------------------
router.post('/postuser', bodyparser, function(req, res)){

    var upload = JSON.parse(req.body);
    var encrPassw = bcrypt.hashSync(upload.password, 10); //hash the password

    var sql = `PREPARE insert_users (int, text, text, text) AS INSERT INTO users VALUES(DEFAULT, $2, $3, $4); EXECUTE insert_users (0, '${upload["loginname"]}', '${upload["encrPassw"]}', '${upload["fullname"]}')`;

    db.any(sql).then(function(data){
        db.any("DEALLOCATE insert_users");
        
        //create the token
        var payload = {loginname: upload.loginname, fullname: upload.fullname};
        var tok = jwt.sign(payload, secret, {expiresIn: "12h"});
        
        //send logininfo + token to the client
        res.status(200).json({loginname: upload.loginname, fullname: upload.fullname, token: tok});
        
    }).catch(function(err) {
        
      res.status(500).json{err});
        
    });
            
});











/*
//endpoint: GET travels -----------------------------
router.get('/', function (req, res) {   
    
    var sql = 'SELECT * FROM usersview';
    db.any(sql).then(function(data) {        
        
        res.status(200).json(data); //success – send the data as JSON!

    }).catch(function(err) {        
        
        res.status(500).json(err);
        
    });   
});
//POST user
app.post('/test', function(req, res) {
            console.log(JSON.stringify(req.body))
        //var sql = `INSERT INTO users VALUES(DEFAULT, )
})

*/

//export module -------------------------------------
module.exports = router;


