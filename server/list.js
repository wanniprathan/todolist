var express = require('express');
var router = express.Router();
var db = require('./dbconnect'); //database
var bodyparser = require('body-parser').text();
var jwt = require("jsonwebtoken");
    //var bcrypt = require('bcrypt');

var secret = "Oops!";// used to create the token
var logindata; //logindata from the token

//Authorize all list-endpoints --------------------
router.use(function (req, res, next) {    
    
    //get the token from the URL-variable named 'token'
    var token = req.query['token'];
    
    console.log(token);

    if (!token) {
        res.status(403).json({msg: "No token received"}); //send
        return; //quit
    }
    else {
        try {
          logindata = jwt.verify(token, secret); //check the token
            
        }
        catch(err) {
          res.status(403).json({msg: "The token is not valid!"}); //send
          return; //quit
        }
    }
    
    next(); //we have a valid token - go to the requested enpoint
});

//POST user
router.post('/test', function(req, res) {
            console.log(JSON.stringify(req.body))
        //var sql = `INSERT INTO users VALUES(DEFAULT, )
})
     

//--------------------------------------------------------------------

//endpoint: POST list hører til todolist.html-----------------------------
router.post('/', bodyparser, function (req, res) {
    
 
    var upload = JSON.parse(req.body);
    
   // console.log(req.body);
    console.log(logindata);

     var sql = `PREPARE insert_lists (int, text, int, text) AS INSERT INTO lists VALUES(DEFAULT, $2, $3, $4); EXECUTE insert_lists (0, '${upload["title"]}', ${logindata.userid}, '${logindata.loginname}')`; //SQL query
    
    
    console.log(sql);
    

    db.any(sql).then(function(data) {
        
        db.any("DEALLOCATE insert_lists");
           
        var senddata = {
            msg: "insert ok"         
        }
        
        res.status(200).json(senddata); //success!


    }).catch(function(err) {

        res.status(500).json(err);

    });
});





//-- GET liste  hører til todolist.html-----------------------------
router.get('/', function (req, res) { //eksempel for senere -- app.get('/users/', function (req, res) {
    

 var sql = 'SELECT * FROM lists'; //SQL query

    //execute the SQL query    
    db.any(sql).then(function(data) {        
        
        res.status(200).json(data); //success – send the data as JSON!

    }).catch(function(err) {      
        
        res.status(500).json(err);
        
    }); 
        
 
});


//endpoint: DELETE liste hører til todolist.html-----------------------------
router.delete('/', function (req, res) {      
    
    
    var upload = req.query.listeid; //uploaded data should be sanitized

    
    //var testerID = 2;
    
    var sql = `PREPARE delete_list (int) AS
            DELETE FROM lists WHERE id=$1 RETURNING *;
            EXECUTE delete_list('${upload}')`;   
    
    db.any(sql).then(function(data) {
        
        db.any("DEALLOCATE delete_list");       
        
        if (data.length > 0) {
            res.status(200).json({msg: "delete ok"}); //success!
        }
        else {
            res.status(200).json({msg: "can't delete"});
        }       

    }).catch(function(err) {
        res.status(500).json(err);        
    });   
});




//export module -------------------------------------
module.exports = router;


