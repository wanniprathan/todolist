const express = require('express');
const app = express(); //server-app
var bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

var router = express.Router();


var pgp = require('pg-promise')();

var db = pgp('postgres://postgres:modul2@localhost:3000/todolist');
 
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

app.post('/postuser', function (req, res) {
    
        res.set('Access-Control-Allow-Origin', '*'); 
    res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");

    res.set( " Access- Control-Allow -Headers : *") ;
    
    //var upload = JSON.parse(req.body);
    console.log(req.body);
    
    //console.log((req))
    //console.log(res)
      
});


var port = process.env.PORT||3001;
app.listen(port, function () {
  console.log('Server listening on port 3125!');
});

