import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

import { insertValues, retrieveDataset } from './database/database.js';
import { run } from './models/ollama-mistral.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
let batteryTemp = null, userInfo = null, userName = null, cityName = null, phoneModel = null;
var weatherData = null, dataset = null;


async function findInterval()
{
    var interval = null; 
    const time = new Date().getHours();
    if(time < 12)
    {
        interval = "Morning"
    }
    
    else if(time > 12 && time < 18)
    {
        interval = "Afternoon";
    }
    
    else if(time === 12)
    {
        interval = "Noon";
    }
    
    else if(time === 18 || time > 18)
    {
        interval = "Evening"
    }
    return interval;
}

async function findDay()
{
    var day = new Date().getDay(); 
    switch(day)
    {
        case 0:
        {
            day = 'Sunday';
            break;
        }
        case 1:
        {
            day = 'Monday';
            break;
        }
        case 2:
        {
            day = 'Tuesday';
            break;
        }
        case 3:
        {
            day = 'Wednesday';
            break;
        }
        case 4:
        {
            day = 'Thursday';
            break;
        }
        case 5:
        {
            day = 'Friday';
            break;
        }
        case 6:
        {
            day = 'Saturday';
            break;
        }
    }
    
    return day;
}

async function getWeatherData(city)
{
    console.log("Fetching weather for:", city); 

    const apiKey = '101d39fb96bf58bdf736f4a7767b5175';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();

        const { main: { temp, humidity }, weather: [{ description, id }] } = data;

        weatherData = {
            username: userName,
            city: city,
            temperature: temp,
            humidity: humidity,
            description: description,
            id: id
        };

        console.log("Fetched Weather Data:", weatherData);
        return weatherData; 

    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

async function sendtoDatabase()
{
    var interval = await findInterval();
    var day = await findDay();
    console.log(interval);
    const sendData = {
        Intervals: interval,
        ReadingsDay: day,
        City: cityName,
        BatteryTemperature: batteryTemp,
        LocalTemperature: weatherData.temperature
    }
    await insertValues(sendData);
}

const app = express();
app.use(express.static(__dirname + '/public'));

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/weather', (req, res) => {
    console.log("Sending weather data", weatherData);
    res.json(weatherData);
});

app.post('/userInfo', async (req, res) => {
    userInfo = req.body;
    console.log(userInfo);
    userName = userInfo.username;
    cityName = userInfo.city;
    phoneModel = userInfo.phone;

    await getWeatherData(cityName);
    await sendtoDatabase();
    res.sendFile(__dirname + '/public/main.html');
});

app.post('/predict', async(req, res) => {
    dataset = await retrieveDataset();
    run(dataset);
    res.sendFile(__dirname + '/public/predict.html');
});

app.post('/battery', async (req, res) => {
    async function getBatteryData() 
    {
        const battery = req.body;
        batteryTemp = battery.temperature;
        console.log(batteryTemp);    
    }
    await getBatteryData();
    res.send(`Temperature of the battery in the smartphone: ${batteryTemp}`);
});

app.get('/battery', (req, res) => {
    if (batteryTemp === null) {
        return res.status(404).json({ error: "No battery data available yet" });
    }
    res.json({ 
        temperature: batteryTemp,
        model: phoneModel
    });
});

const port = 5000;
app.listen(port, (err) => {
    if(err)
        console.log(`Something went terribly long`);

    console.log(`Server running at http://localhost:5000`);
});