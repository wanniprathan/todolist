var express = require('express');
var app = express(); //server-app

//var db = require('./dbconnect'); //database

app.use(function(req, res, next){
    
    res.set('Access-Control-Allow-Origin', '*'); 
    res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.set( " Access- Control-Allow -Headers : *");

    next();
});

//app.use(bodyparser.json());
//app.use(bodyparser.urlencoded({extended: true}));

var users = require('./users.js');
app.use('/users/', users);

var list = require('./list.js');
app.use('/list/', list);


var listitem = require('./listitem.js');
app.use('/listitem/', listitem);


var port = process.env.PORT||3001;
app.listen(port, function () {
  console.log('Server listening on port 3001!');
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

