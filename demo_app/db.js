const mysql      = require('mysql');
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'newuser',
  password : '12345',
  database : 'demo'
});

module.exports = db