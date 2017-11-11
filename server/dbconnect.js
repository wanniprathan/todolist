var pgp = require('pg-promise')();

//db connect string
var db = pgp('postgres://postgres:modul2@localhost:3000/todolist');

//export module
module.exports = db;
