var express = require('express');
var app = express(); //server-app
var path = require('path');


var str = __dirname.substring(0, __dirname.length - 6);
app.use(express.static(str + '/client'));
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

app.get('/CreateUser',function(req,res){
    
    //console.log(str);
     //res.sendFile(path.join(str + '/client/CreateUser.html'));
    res.sendFile(path.join(str + '/client/CreateUser.html'));
});

app.get('/loginUser',function(req,res){
    
    //console.log(str);
     //res.sendFile(path.join(str + '/client/CreateUser.html'));
    res.sendFile(path.join(str + '/client/index.html'));
});



var port = process.env.PORT||3001;
app.listen(port, function () {
  //console.log('Server listening on port 3001!');
});


