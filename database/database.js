import mysql from 'mysql2';

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "tempanalysis"
}).promise()



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

export async function retrieveDataset() {

    const [rows] = await pool.query(`select Intervals, ReadingsTime, ReadingsDay, 
        City, BatteryTemperature, LocalTemperature from temperature`);
    
    return rows;
    
}