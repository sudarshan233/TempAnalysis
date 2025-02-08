document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
        setupFormSubmission();
    }

    if (window.location.pathname.includes("main.html")) {
        greetUser();
        populateDetails();
        fetchBatteryTemp();
    }
});

const apiKey = '101d39fb96bf58bdf736f4a7767b5175';

function setupFormSubmission() {
    document.querySelector("form").addEventListener("submit", (event) => {
        event.preventDefault();
        
        var username = document.getElementById("userName").value;
        var city = document.getElementById("cityName").value;
        var phone = document.getElementById("phoneModel").value;

        localStorage.setItem("username", username);
        localStorage.setItem("cityName", city);
        localStorage.setItem("phoneModel", phone);
        // localStorage.clear()

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
    
}

function fetchBatteryTemp()
{
    fetch('/battery')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.card-2 .tempDisplay').innerText = `${data.temperature}°C`;
        })
        .catch(err => console.error('Error fetching', err));
}