var pgp = require('pg-promise')();

//db connect string
var conn = process.env.DATABASE_URL || 'postgres://postgres:modul2@localhost:3000/todolist';

var db = pgp(conn);

//var db = pgp('postgres://postgres:modul2@localhost:3000/todolist');

//export module
module.exports = db;
