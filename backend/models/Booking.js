const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "test"
});

db.connect(err => {
    if (err) {
        console.error('Database Connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database!');
});

module.exports = db;
