var express = require('express');
var router = express.Router();
var db = require('./dbconnect'); //database
var bodyparser = require('body-parser').text();
var jwt = require("jsonwebtoken");
var bcrypt = require('bcrypt');

var secret = "Oops!";// used to create the token


//endpoint: POST users med kryptert passw, lag ny bruker------------------------------
router.post('/', bodyparser, function(req, res){

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
        
      res.status(500).json({msg: err});
        
    });
            
});


//---------------------------------------------------------
//---post for login hører til Login.html// loginn-----
router.post('/login/', bodyparser, function (req, res) {
    
    /*res.set('Access-Control-Allow-Origin', '*'); 
    res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.set( " Access- Control-Allow -Headers : *") ;*/
    
    //var upload = JSON.parse(req.body) om man skal ha tak i bruker navn så skriv .brukernavn;
    var upload = JSON.parse(req.body);
    
    console.log(req.body);
    var sql = `PREPARE check_users (text, text) AS SELECT * FROM users WHERE user_name=$1 AND user_password=$2; EXECUTE check_users ('${upload["inpname"]}', '${upload["inpass"]}') `; //SQL query
    
   
    
    console.log(sql);
    
       db.any(sql).then(function(data) {
        
        db.any("DEALLOCATE check_users");
           
        if (data.length <= 0) {
            res.status(200).json({msg: "Ugyldig bruker!!"}); //success!
            return;
        }
           
            
        
          //create the token
        var payload = {loginname: upload.impname, fullname: data[0].fullname};
        var tok = jwt.sign(payload, secret, {expiresIn: "12h"});
           
        var senddata = {
            loginname: upload["inpname"],
            fullname: upload["inpass"],
            token: tok
        }
           
        res.status(200).json(senddata); //success!

    }).catch(function(err) {        
        
        res.status(500).json(err);
        
    });   
});



//---------------------------------------------------------








//export module -------------------------------------
module.exports = router;


