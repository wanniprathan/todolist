var express = require('express');
var router = express.Router();
var db = require('./dbconnect'); //database
var bodyparser = require('body-parser').text();
var jwt = require("jsonwebtoken");
//var bcrypt = require('bcrypt');

var secret = "Oops!";// used to create the token

/*


//endpoint: POST users med kryptert passw, lag ny bruker------------------------------
router.post('/', bodyparser, function(req, res){

    var upload = JSON.parse(req.body);
    console.log(upload.password);
    var encrPassw = bcrypt.hashSync(upload.password, 10); //hash the password
    upload['encrPassw'] = encrPassw;
    
    console.log(upload['encrPassw']);

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
//---endpoint: post for login hører til Login.html// loginn-----
router.post('/login/', bodyparser, function (req, res) {
    

    var upload = JSON.parse(req.body);
    
    console.log(upload, " is the upload");

    
    //console.log(req.body);
    var sql = `PREPARE check_users (text) AS SELECT * FROM users WHERE user_name=$1; EXECUTE check_users ('${upload["inpname"]}') `; //SQL query

    
       db.any(sql).then(function(data) {
        
        db.any("DEALLOCATE check_users");
        
           console.log(data);
          
        var psw = upload.inpass;
        var encPsw = data[0].user_password;
        var result = bcrypt.compareSync(psw, encPsw);
        
           
        console.log(result);

        if(!result){
            res.status(403).json({msg: 'Wrong password'});
            return;
        }

        //create the token
        var payload = {userid: data[0].id, loginname: upload.inpname, fullname: data[0].fullname};
        var tok = jwt.sign(payload, secret, {expiresIn: "12h"});
           
        var senddata = {
            loginname: upload["inpname"],
            token: tok
        
        }
           
        res.status(200).json(senddata); //success!

    }).catch(function(err) {        
        
        res.status(500).json(err);
        
    });   
});




 //console.log(req.body);
*/

//---------------------------------------------------------

//export module -------------------------------------
module.exports = router;


