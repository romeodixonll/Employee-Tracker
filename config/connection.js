const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      port:3306,
      user: 'root',
     
      password: '1234',
      database: 'employee_db',
    },
    console.log(`Connected to the employee_db database.`)
  );

  db.connect()
  module.exports = db