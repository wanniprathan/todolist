var pgp = require('pg-promise')();
//pgp.pg.defaults.ssl = true;

//db connect string
var conn = process.env.DATABASE_URL || 'postgres://postgres:modul2@localhost:3000/todolist';
//var conn = 'postgres://ycxmzjomqffhvk:b2c301cf60d181bc2886e87beff78374ef1d1648ca665c1a52657f5e11ec3aef@ec2-54-75-231-85.eu-west-1.compute.amazonaws.com:5432/dei1cdnq4o6tie';

var db = pgp(conn);

//var db = pgp('postgres://postgres:modul2@localhost:3000/todolist');

//export module
module.exports = db;
