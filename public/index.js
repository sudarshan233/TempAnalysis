var ambientTemp = null;
var ambients = [];
var predictedDays = [null, null, null, null, null, null, null];
var time = new Date().getHours();
// var time = 21;

function setTheme()
{
    if(time === 18 || time > 18)
    {
        document.querySelector('body').style.backgroundColor = '#1E201E';
        document.querySelector('body').style.color = 'whitesmoke';

        document.querySelector('.card-1').style.backgroundColor = '#3C3D37';
        document.querySelector('.card-2').style.backgroundColor = '#3C3D37';
        
        document.querySelector('#predict').style.backgroundColor = '#3C3D37';
        document.querySelector('#predict').style.color = 'whitesmoke';
        document.querySelector('#predict').style.border = '3px solid rgb(0, 71, 171)';
        document.querySelector('#predict').addEventListener('mouseover', buttonTransitionOn);
        document.querySelector('#predict').addEventListener('mouseout', buttonTransitionOff);
    }
}

function buttonTransitionOn()
{
    document.querySelector('#predict').style.backgroundColor = 'rgb(0, 71, 171)';
    document.querySelector('#predict').style.color = 'whitesmoke';
}

function buttonTransitionOff()
{
    document.querySelector('#predict').style.backgroundColor = '#3C3D37';
    document.querySelector('#predict').style.color = 'whitesmoke';
    document.querySelector('#predict').style.border = '3px solid rgb(0, 71, 171)';
}

setTheme();

function findDay()
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
function findNextDay()
{
    var day = new Date().getDay(); 
    switch(day)
    {
        case 0:
        {
            day = 'Monday';
            break;
        }
        case 1:
        {
            day = 'Tuesday';
            break;
        }
        case 2:
        {
            day = 'Wednesday';
            break;
        }
        case 3:
        {
            day = 'Thursday';
            break;
        }
        case 4:
        {
            day = 'Friday';
            break;
        }
        case 5:
        {
            day = 'Saturday';
            break;
        }
        case 6:
        {
            day = 'Sunday';
            break;
        }
    }
    
    return day;
}
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
    localStorage.removeItem('userName');
}

function fetchBatteryTemp()
{
    fetch('/battery')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.card-2 .duration').innerText = `${findDay()} (Today)`;
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

function fetchWeatherData(retries = 5) {
    console.log("Fetching weather data from server...");

    fetch('/weather')
        .then(response => {
            console.log("Weather response status:", response.status);
            if (!response.ok) {
                if (retries > 0) {
                    console.log("Retrying fetchWeatherData in 2s...");
                    setTimeout(() => fetchWeatherData(retries - 1), 2000);
                }
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
    
    document.querySelector('.card-1 .duration').innerText = `${findDay()} (Today)`;
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

// function getDescription(ambient)
// {
//     const result = [];
//     console.log(ambient);
//     switch(true)
//     {
//         case (ambient >= 0.0 && ambient < 10.0):
//             result.push("Freezing Cold");
//             result.push("Extremely Cold, Frostbite Risk");
//             break;
        
//         case (ambient >= 10.0 && ambient < 15.0):
//             result.push("Very Cold");
//             result.push("Requires Heavy Clothing");
//             break;

//         case (ambient >= 15.0 && ambient < 20.0):
//             result.push("Cold");
//             result.push("Chilly, Manageable with warm clothing");
//             break;
        
//         case (ambient >= 20.0 && ambient < 30.0):
//             result.push("Mild / Comfortable");
//             result.push("Ideal Indoor and Outdoor Temperature");
//             break;

//         case (ambient >= 30.0 && ambient < 35.0):
//             result.push("Warm");
//             result.push("Slightly Hot, Comfortable");
//             break;

//         case (ambient >= 35.0 && ambient < 40.0):
//             result.push("Very Hot");
//             result.push("Risk Of Dehydration, Possible Heat Exhaustion");
//             break;

//         case (ambient >= 40.0):
//             result.push("Extreme Heat");
//             result.push("Dangerous, Heastroke Risk");
//             break;
            
//     }
//     return result;
// }

// function fetchAmbientTemperature() {
//     fetch('/predict', { method: "POST" })
//         .then(async response => {
//             if (!response.ok) {
//                 const err = await response.json();
//                 throw new Error(err.error || 'Failed to fetch ambient temperature');
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (!data || !data.ambientTemperature) {
//                 console.error("No ambient temperature received!");
//                 document.querySelector('.card-3').style.display = "none";
//                 return;
//             }

//             ambientTemp = parseFloat(data.ambientTemperature).toFixed(1);
//             const temp = data.ambients;
//             const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//             ambients = []; // Clear the ambients array before populating
            
//             //Function to display the predicted day value in graph
//             for (let index = 0; index < predictedDays.length; index++) {
//                 var day = new Date().getDay();
//                 var nextDay = (day + 1) % 7;
//                 if(index === day)
//                     predictedDays.splice(nextDay, 0, ambientTemp);
                
//             }
//             // Function to aggregate the ambient temperature of each day
//             for (let index = 0; index < days.length; index++) {
//                 const day = days[index];
//                 let count = 0;
//                 let sum = 0.0;

//                 for (let j = 0; j < temp.length; j++) {
//                     const ambient = temp[j];
//                     if (ambient.ReadingsDay === day) {
//                         console.log(ambient.ReadingsDay, day);
//                         const temperature = parseFloat(ambient.AmbientTemperature);
//                         if (!isNaN(temperature)) {
//                             count++;
//                             sum += temperature;
//                         } else {
//                             console.error("Invalid temperature value:", ambient.AmbientTemperature);
//                         }
//                     }
//                 }

//                 console.log(day, count, sum);
//                 if (count > 0) {
//                     ambients.push((sum / count).toFixed(1)); // Store average
//                 } else {
//                     ambients.push(null); // Store null for missing data
//                 }
//             }

//             console.log("List of ambients: ", ambients);
//             var description = getDescription(ambientTemp);

//             console.log("Received Predicted Ambient Temperature:", ambientTemp);

//             let card3 = document.querySelector('.card-3');
//             card3.style.display = "block";
//             if(time === 18 || time > 18)
//             {
//                 card3.style.backgroundColor = '#3C3D37';
//             }

//             card3.querySelector('.duration').innerText = `${findNextDay()} (Tomorrow)`;
//             card3.querySelector('.ambientDisplay').innerText = `${ambientTemp}°C`;
//             card3.querySelector('.description').innerText = `${description[0]}`;
//             card3.querySelector('.mini-description').innerText = `${description[1]}`;

//             createGraph();
//         })
//         .catch(err => {
//             console.error("Error fetching data from Backend:", err);
//             document.querySelector('.card-3').style.display = "none";
//         });
// }

// function createGraph()
// {
//     document.querySelector('#graph').setAttribute('width', '400');
//     document.querySelector('#graph').setAttribute('height', '300');
//     document.querySelector('#graph').style.marginBottom = "11rem";

//     const canvas = document.getElementById('graph').getContext('2d');
//     // console.log(ambients);
//     console.log(ambientTemp);
//     const graphAmbient = new Chart(canvas, {
//         type: 'line',
//         data: {
//             labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
//             datasets: [{
//                 label: 'Ambient Temperature',
//                 data: ambients,
//                 borderColor: 'rgb(0, 71, 171)',
//                 tension: 0.1
//             }, {
//                 label: 'Predicted Ambient Temperature',
//                 data: predictedDays,
//                 borderColor: 'red',
//                 pointBackgroundColor: 'silver',
//                 pointBorderColor: 'red',
//                 pointStyle: 'triangle',
//                 pointRadius: 10,
//                 fill: false
//             }]
//         },
//         options: {
//             scales: {
//                 x: {
//                     grid: {
//                         color: 'grey'
//                     }
//                 },
//                 y: {
//                     grid: {
//                         color: 'grey'
//                     },
//                     beginAtZero: false, // Prevents y-axis from starting at 0
//                     min: 20, // Adjust to your minimum y-axis value
//                     max: 32 // Adjust to your maximum y-axis value
//                 }
//             }
//         }
//     });
//     function changeTheme()
//     {
//         graphAmbient.options.scales.x.grid.color = "silver";
//         graphAmbient.options.scales.x.ticks.color = 'silver';
//         graphAmbient.options.scales.y.grid.color = "silver";
//         graphAmbient.options.scales.y.ticks.color = 'silver';
//         graphAmbient.options.plugins.legend.labels.color = 'white';
//         graphAmbient.update();
//     }
//     if(time === 18 || time > 18)
//     {
//         changeTheme();
//     }
// }

fetchBatteryTemp();
fetchWeatherData();
greetUser();

document.querySelector('.card-3').style.display = "none";

// document.addEventListener('DOMContentLoaded', function() {
//     document.querySelector('#predict').addEventListener("click", function(event) {
//         event.preventDefault();
//         console.log("Predict button clicked!");
//         fetchAmbientTemperature();
//     });
// })



