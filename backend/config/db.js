const mysql = require('mysql');

const connectDB = () => {

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'secret',
    database: 'my_db'
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

}

module.exports=connectDB


