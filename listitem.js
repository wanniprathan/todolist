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


//--------------------------------------------------------------------
/*
//endpoint: POST list hører til todolist.html //listitem-----------------------------
router.post('/', bodyparser, function (req, res) {
    
    
    
    res.set('Access-Control-Allow-Origin', '*'); 
    res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.set( " Access- Control-Allow -Headers : *") ;
    

    var upload = JSON.parse(req.body);
    
    

    console.log(req.body);
   /*var sql = `PREPARE check_lists (text, int) AS SELECT * FROM users WHERE list_name=$1 AND userID=$2; EXECUTE check_lists ('${upload["title"]}', '${upload["userID"]}') `; //SQL query
    
     var sql = `PREPARE insert_items (int, text, text, date, int) AS INSERT INTO listitems VALUES(DEFAULT, $2, $3, $4, $5); EXECUTE insert_items (0, '${upload["title"]}', '${upload["content"]}', '${upload["dato"]}', ${upload["listId"]})`; //SQL query
    
    console.log(sql)

    db.any(sql).then(function(data) {
        
        db.any("DEALLOCATE insert_items");
           
        var senddata = {
            msg: "insert ok",
            title: upload["title"],
            conten: upload["content"],
            dato: upload["dato"]
        }
        
        res.status(200).json(senddata); //success!


    }).catch(function(err) {

        res.status(500).json(err);

    });
});






/*var pgp = require('pg-promise')();

var db = pgp('postgres://postgres:modul2@localhost:3000/todolist');

var todo = require('./todo', todo);

app.use('/todo', todo);
 
app.get('/', function (req, res) {
    
    //set headers
    res.set('Access-Control-Allow-Origin', '*'); 
    res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");

    var sql = 'SELECT * FROM usersview'; //SQL query

    //execute the SQL query    
    db.any(sql).then(function(data) {        
        
        res.status(200).json(data); //success – send the data as JSON!

    }).catch(function(err) {      
        
        res.status(500).json(err);
        
    });  
});


*/


//---------------------------------------------------------

//--- POST for createuser hører til CreateUser.html-----
/*
app.post('/postuser/', bodyparser, function (req, res) {
    
    res.set('Access-Control-Allow-Origin', '*'); 
    res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.set( " Access- Control-Allow -Headers : *") ;
    
    //var upload = JSON.parse(req.body) om man skal ha tak i bruker navn så skriv .brukernavn;
    var upload = JSON.parse(req.body);
    
    console.log(req.body);
    var sql = `PREPARE insert_users (int, text, text, text) AS INSERT INTO users VALUES(DEFAULT, $2, $3, $4); EXECUTE insert_users (0, '${upload["loginname"]}', '${upload["password"]}', '${upload["fullname"]}') `; //SQL query
    
       db.any(sql).then(function(data) {
        
        db.any("DEALLOCATE insert_users");
           
        var senddata = {
            msg: "insert ok",
            loginname: upload["loginname"],
            fullname: upload["fullname"]            
        }
           
        res.status(200).json(senddata); //success!

    }).catch(function(err) {        
        
        res.status(500).json(err);
        
    });   
});
*/

//export module -------------------------------------
module.exports = router;

