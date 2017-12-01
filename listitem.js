var express = require('express');
var app = express(); //server-app

var bodyparser = require('body-parser').text();



var router = express.Router();
var db = require('./dbconnect'); //database

var jwt = require("jsonwebtoken");
//var bcrypt = require('bcrypt');

var secret = "Oops!";// used to create the token
var logindata; //logindata from the token


//Authorize all travel-endpoints --------------------
router.use(function (req, res, next) {    
    
    //get the token from the URL-variable named 'token'
    var token = req.query['token'];   

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




//endpoint: POST list hører til todolist.html//listItem-----------------------------
router.post('/', bodyparser, function (req, res) {

    var upload = JSON.parse(req.body);

    console.log(req.body);
    
     var sql = `PREPARE insert_items (int, text, text, date, int, text) AS INSERT INTO listitems VALUES(DEFAULT, $2, $3, $4, $5, $6); EXECUTE insert_items (0, '${upload["title"]}', '${upload["content"]}', '${upload["dato"]}', ${upload["listId"]}, '${upload["rate"]}')`; //SQL query
    
    console.log(sql)

    db.any(sql).then(function(data) {
        
        db.any("DEALLOCATE insert_items");
           
        var senddata = {
            msg: "insert ok",
            title: upload["title"],
            conten: upload["content"],
            dato: upload["dato"],
            rate: upload["rate"]
        }
        
        res.status(200).json(senddata); //success!


    }).catch(function(err) {

        res.status(500).json(err);

    });
});





//-- GET listItems  hører til todolist.html-----------------------------
router.get('/', function (req, res) { //eksempel for senere -- app.get('/users/', function (req, res) {
    
    var sql = `SELECT * FROM listview WHERE userid ='${logindata.userid}'`; //SQL query
    
    console.log(sql)
    
    //execute the SQL query    
    db.any(sql).then(function(data) {        
        
        res.status(200).json(data); //success – send the data as JSON!

    }).catch(function(err) {      
        
        res.status(500).json(err);
        
    }); 
        
 
});



//--ENDPOINT for DELETE-- Sletter innhold i listen
router.delete('/', function (req, res) {      
    
    
    var upload = req.query.listitemid; //uploaded data should be sanitized

    
    var sql = `PREPARE delete_listitems (int) AS
            DELETE FROM listitems WHERE id=$1 RETURNING *;
            EXECUTE delete_listitems(${upload})`; 
    
    console.log(sql);
    
    db.any(sql).then(function(data) {
        
        db.any("DEALLOCATE delete_listitems");       
        
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

