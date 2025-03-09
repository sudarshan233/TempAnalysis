import mysql from "mysql2";

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "tempanalysis"
}).promise()

const result = await pool.query("SELECT * FROM temperature")
console.log(result)
console.log()