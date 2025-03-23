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
    fillAmbient();
}

export async function retrieveDataset() {

    const [Intervals] = await pool.query(`select Intervals from temperature`);
    const [ReadingsTime] = await pool.query(`select ReadingsTime from temperature`);
    const [ReadingsDay] = await pool.query(`select ReadingsDay from temperature`);
    const [City] = await pool.query(`select City from temperature`);
    const [BatteryTemperature] = await pool.query(`select BatteryTemperature from temperature`);
    const [LocalTemperature] = await pool.query(`select LocalTemperature from temperature`);
    
    const rows = [];
    for (let index = 0; index < Intervals.length; index++) {
        const row = [];
        row.push(Intervals[index]);
        row.push(ReadingsTime[index]);
        row.push(ReadingsDay[index]);
        row.push(City[index]);
        row.push(BatteryTemperature[index]);
        row.push(LocalTemperature[index]);
        rows.push(row);
    }
    // const rows = {
    //     intervalsRow: Intervals,
    //     readingsTimeRow: ReadingsTime,
    //     readingsDayRow: ReadingsDay,
    //     cityRow: City,
    //     batteryTempRow: BatteryTemperature,
    //     localTemp: LocalTemperature  
    // }
    // const [rows] = await pool.query(`select Intervals, ReadingsTime, ReadingsDay, City,
    //     BatteryTemperature, LocalTemperature from temperature`);
    console.log(rows);
    return rows;
}
retrieveDataset();

async function fillAmbient()
{
    const [samples] = await pool.query(`select Id, BatteryTemperature,
        LocalTemperature from temperature where AmbientTemperature is null`);

    for(const sample of samples)
    {
        const id = sample.Id;
        const batteryTemp = sample.BatteryTemperature
        const localTemp= sample.LocalTemperature;

        console.log("Id: ", id);
        console.log("Battery Temperature: ", batteryTemp);
        console.log("Local Temperature: ", localTemp);

        var ambient = localTemp - ((batteryTemp - localTemp) * 0.65);
        await pool.query(`update temperature set AmbientTemperature = ?
            where id = ?`,[ambient, id]);
    }
}

export async function retrieveAmbient() {

    const [rows] = await pool.query(`select AmbientTemperature, ReadingsDay from temperature`);
    console.log(rows);
    return rows;
}