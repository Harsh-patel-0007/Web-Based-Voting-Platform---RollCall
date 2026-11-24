const mysqlDb = require('mysql2/promise')

require("dotenv").config();

const db = mysqlDb.createPool({
    host: process.env.DB_LOCALHOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: "electo"
})
console.log("database connected successfully");

module.exports = db