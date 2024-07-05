const mysql = require('mysql2')

let cnx = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME, 
    password: process.env.DB_PWD,
    connectionLimit: 10,
}).promise()

async function cleanup() {
    await cnx.end();
}

module.exports = {cnx, cleanup};