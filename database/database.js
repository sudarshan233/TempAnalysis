import mysql from 'mysql2';

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "tempanalysis"
}).promise()

const result = await pool.query("SELECT * FROM temperature")
console.log(result);

export async function insertValues(data) {
    var interval = data.Intervals;
    var readingsDay = data.ReadingsDay;
    var city = data.City;
    var BatteryTemperature = data.BatteryTemperature;
    var LocalTemperature = data.LocalTemperature - 273.15.toFixed(1);
    await pool.query(`
        insert into temperature(
        Intervals,
        ReadingsDay, 
        City, 
        BatteryTemperature,
        LocalTemperature
        ) values (?, ?, ?, ?, ?)`,
        [interval, readingsDay, city, BatteryTemperature, LocalTemperature]
    )
}