import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { setupFormSubmission, greetUser, populateDetails, getWeatherData, displayWeatherData, getWeatherLogo } from './public/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
let batteryTemp = null;

const app = express();
app.use(express.static(__dirname + '/public'));

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/main', (req, res) => {
    const userInfo = req.body;
    console.log(userInfo);
    res.sendFile(__dirname + '/public/main.html');
    
    // greetUser();
    // populateDetails();
    // getWeatherData(city);
    // displayWeatherData();
    // getWeatherLogo(id)
});

app.post('/battery', (req, res) => {
    async function getBatteryData() 
    {
        const battery = req.body;
        batteryTemp = battery.temperature;
        console.log(batteryTemp);
        
        console.log(localWeatherData); 
    }
    getBatteryData()
    res.send(`Temperature of the battery in the smartphone: ${batteryTemp}`);
});

app.get('/battery', (req, res) => {
    if (batteryTemp === null) {
        return res.status(404).json({ error: "No battery data available yet" });
    }
    res.json({ temperature: batteryTemp });
});

const port = 5000;
app.listen(port, (err) => {
    if(err)
        console.log(`Something went terribly long`);

    console.log(`Server running at http://localhost:5000`);
});