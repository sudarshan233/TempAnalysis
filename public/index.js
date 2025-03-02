document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
        setupFormSubmission();
    }

    if (window.location.pathname.includes("main.html")) {
        greetUser();
        populateDetails();
        displayWeatherData();
        fetchBatteryTemp();
    }
});

const apiKey = '101d39fb96bf58bdf736f4a7767b5175';
let weatherData = null;

function setupFormSubmission() {
    document.querySelector("form").addEventListener("submit", async (event) => {
        event.preventDefault();
        
        var username = document.getElementById("userName").value;
        var city = document.getElementById("cityName").value;
        var phone = document.getElementById("phoneModel").value;

        localStorage.setItem("username", username);
        localStorage.setItem("cityName", city);
        localStorage.setItem("phoneModel", phone);
        // localStorage.clear()

        try {
            weatherData = await getWeatherData(city);
            localStorage.setItem("weatherData", JSON.stringify(weatherData)); // Save weather data
        } catch (err) {
            console.error("Error fetching weather data:", err);
        }

        window.location.href = "main.html";
    });
}

function greetUser()
{
    const time = new Date().getHours();
    var name = localStorage.getItem('username');
    var greet;
    if(time < 12)
    {
        greet = `Good Morning ${name},`;
    }

    else if(time > 12 && time < 18)
    {
        greet = `Good Afternoon ${name},`;
    }

    else if(time === 12)
    {
        greet = `Good Noon ${name},`;
    }

    else if(time === 18 || time > 18)
    {
        greet = `Good Evening ${name},`;
    }
    document.querySelector('.greeting').innerText = greet;
}

function populateDetails()
{
    document.querySelector('.cityDisplay').innerText = localStorage.getItem('cityName');
    document.querySelector('.phoneDisplay').innerText = localStorage.getItem('phoneModel');
}   

async function getWeatherData(city)
{
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if(!response.ok)
    {
        throw new Error('Could not fetch weather data');
    }
    return await response.json();
}

function displayWeatherData() {
    const weatherData = JSON.parse(localStorage.getItem("weatherData"));
    if (!weatherData) {
        console.error("No weather data found");
        return;
    }

    const { main: { temp, humidity }, weather: [{ description, id }] } = weatherData;

    document.querySelector('.card-1 .tempDisplay').innerText = `${(temp - 273.15).toFixed(1)}°C`;
    document.querySelector('.humidityDisplay').innerText = `Humidity: ${humidity}%`;
    document.querySelector('.card-1 .description').innerText = description.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    document.querySelector('.weatherLogo').innerText = getWeatherLogo(id);
}

function getWeatherLogo(id)
{
    switch(true)
    {
        case (id >= 200 && id < 300):
            return "⛈️";
        
        case (id >= 300 && id < 400):
            return "🌦️";

        case (id >= 500 && id < 600):
            return "🌧️";
        
        case (id >= 600 && id < 700):
            return "❄️";

        case (id >= 700 && id < 800):
            return "🌫️";

        case (id === 800):
            return "☀️";

        case (id >= 801 && id < 810):
            return "☁️";
    }
}

function fetchBatteryTemp()
{
    fetch('/battery')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.card-2 .tempDisplay').innerText = `${data.temperature}°C`;
            if(data.temperature < 40 && data.temperature >= 25)
            {
                document.querySelector('.card-2 .description').innerText = 'Safe';
                document.querySelector('.batteryLogo').innerText = '🔋';
            }

            else if(data.temperature < 45 && data.temperature >= 40)
            {
                document.querySelector('.card-2 .description').innerText = 'Caution';
                document.querySelector('.batteryLogo').innerText = '⚠️';
            }

            else if(data.temperature < 50 && data.temperature >= 45)
            {
                document.querySelector('.card-2 .description').innerText = 'Overheating';
                document.querySelector('.batteryLogo').innerText = '🟠';
            }

            else if(data.temperature >= 50 && data.temperature < 60)
            {
                    document.querySelector('.card-2 .description').innerText = 'Critical';
                    document.querySelector('.batteryLogo').innerText = '🔴';
            }

            else if(data.temperature >= 60)
            {
                    document.querySelector('.card-2 .description').innerText = 'Hazardous';
                    document.querySelector('.batteryLogo').innerText = '☠️';
            }
    
    
        })
        .catch(err => console.error('Error fetching', err));
}