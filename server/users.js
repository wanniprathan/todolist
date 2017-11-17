var express = require('express');
var router = express.Router();
var db = require('./dbconnect'); //database

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
        
//export module -------------------------------------
module.exports = router;


