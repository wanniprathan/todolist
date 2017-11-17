const express = require('express');
const app = express(); //server-app
var bodyparser = require('body-parser').text();
var pgp = require('pg-promise')();

//app.use(bodyparser.json());
//app.use(bodyparser.urlencoded({extended: true}));


var router = express.Router();

var db = pgp('postgres://postgres:modul2@localhost:3000/todolist');


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

//---post for login
app.post('/loginn/', bodyparser, function (req, res) {
    
    res.set('Access-Control-Allow-Origin', '*'); 
    res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.set( " Access- Control-Allow -Headers : *") ;
    
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
        
           
        var senddata = {
            msg: "ok bruker",
            loginname: upload["inpname"],
            fullname: upload["inpass"]            
        }
           
        res.status(200).json(senddata); //success!

    }).catch(function(err) {        
        
        res.status(500).json(err);
        
    });   
});

//endpoint: DELETE user -----------------------------
app.delete('/delete/', function (req, res) {      
    
    var upload = req.query.usersid; //uploaded data should be sanitized
    
    var testerID = 2;
    
    var sql = `PREPARE delete_users (int) AS
            DELETE FROM users WHERE id=$1 RETURNING *;
            EXECUTE delete_users('${upload["userID"]}')`;   
    
    db.any(sql).then(function(data) {
        
        db.any("DEALLOCATE delete_users");       
        
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

   




app.get('/', function (req, res) { //eksempel for senere -- app.get('/users/', function (req, res) {
    
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



var port = process.env.PORT||3001;
app.listen(port, function () {
  console.log('Server listening on port 3001!');
});

