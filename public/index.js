function greetUser()
{
    const time = new Date().getHours();
    var name = localStorage.getItem('userName');
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

function fetchBatteryTemp()
{
    fetch('/battery')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.card-2 .phoneDisplay').innerText = `${data.model}`;
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
        .catch(err => console.error('Error fetching battery data in front-end', err));
}

function fetchWeatherData()
{
    console.log("Fetching weather data from server...");

    fetch('/weather')
        .then(response => {
            console.log("Weather response status:", response.status);
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            return response.json(); 
        })
        .then(data => {
            console.log("Received weather data:", data);
            displayWeatherData(data);
        })
        .catch(err => console.error('Error fetching weather data in front-end:', err));
}

function displayWeatherData(data) {
    const weatherData = data;
    if (!weatherData) {
        console.error("No weather data found");
        return;
    }
    console.log("In display function: ", weatherData);
    localStorage.setItem("userName", weatherData.username);
    
    document.querySelector('.card-1 .cityDisplay').innerText = weatherData.city;
    document.querySelector('.card-1 .tempDisplay').innerText = `${(weatherData.temperature - 273.15).toFixed(1)}°C`;
    document.querySelector('.humidityDisplay').innerText = `Humidity: ${weatherData.humidity}%`;
    document.querySelector('.card-1 .description').innerText = weatherData.description.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    document.querySelector('.weatherLogo').innerText = getWeatherLogo(weatherData.id);
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

function fetchAmbientTemperature()
{
    fetch('/predict')
        .then(response => {
            console.log("Ambient Temperature Status: ", response.status);
            if(!response.ok)
            {
                console.log(`Error in fetching predicted ambient 
                    temperature data.`);
            }
            return response.json;
        })
        .then(data => {
            console.log(`Predicted ambient temperature data in front-end:
                ${data}`);
        })
        .catch(err => {
            console.error(`Error fetching data from Backend ${err}`);
        })
}

fetchBatteryTemp();
fetchWeatherData();
greetUser();
fetchAmbientTemperature();