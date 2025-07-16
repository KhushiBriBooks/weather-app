const apiKey = 'af59a547e786455fb4c52633251407';
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

const cityNameEl = document.getElementById('cityName');
const tempEl = document.getElementById('temp');
const conditionEl = document.getElementById('condition');
const weatherIconEl = document.getElementById('weatherIcon');
const forecastContainer = document.getElementById('forecast');

const windEl = document.getElementById('wind-value');
const humidityEl = document.getElementById('humidity-value');
const aqiBarEl = document.getElementById('aqiBar');
const feelsLikeEl = document.getElementById('feelsLike-value');
const windDirEl = document.getElementById('windDir-value');

const body = document.body;

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city !== '') {
        getWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if(e.key === "Enter"){
        const city = cityInput.value.trim();
        if(city !== ''){
            getWeather(city);
        }
    }

})

async function getWeather(city) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=yes`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("City not found");
        const data = await res.json();
        console.log(data);
        updateUI(data);
    } catch (error) {
        alert(error.message);
    }
}

function updateUI(data) {
    const current = data.current;
    const location = data.location;

    cityNameEl.innerText = `${location.name}, ${location.country}`;
    tempEl.innerText = `${current.temp_c}°C`;
    conditionEl.innerText = current.condition.text;
    weatherIconEl.src = `https:${current.condition.icon}`;

    windEl.innerText = `${current.wind_kph} km/h`;
    humidityEl.innerText = `${current.humidity}%`;
    feelsLikeEl.innerText = `${current.feelslike_f}°F`;
    windDirEl.innerText = `${current.wind_dir}`;

    const aqiIndex = current.air_quality["us-epa-index"];
    const aqiValue = current.air_quality.pm2_5.toFixed(0);
    const aqiText = getAQIText(aqiIndex);

    document.getElementById('aqiValue').innerText = `${aqiValue} - ${aqiText}`;

    const aqiIndicator = document.getElementById('aqiIndicator');

    let aqiPos = Math.min((aqiValue / 500) * 100, 100);
    aqiIndicator.style.left = `${aqiPos}%`;


    forecastContainer.innerHTML = '';
    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const icon = day.day.condition.icon;
        const maxTemp = day.day.maxtemp_c;

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <p>${dayName}</p>
            <img src="https:${icon}" alt="">
            <p>${maxTemp}°C</p>
        `;
        forecastContainer.appendChild(card);
    });

    updateBackground(current.condition.text.toLowerCase());
}

// AQI interpretation
function getAQIText(index) {
    switch (index) {
        case 1: return "Good";
        case 2: return "Moderate";
        case 3: return "Unhealthy for Sensitive Groups";
        case 4: return "Unhealthy";
        case 5: return "Very Unhealthy";
        case 6: return "Hazardous";
        default: return "Unknown";
    }
}

function updateBackground(condition) {
    condition = condition.toLowerCase(); 

    switch (true) {
        case condition.includes("sunny") || condition.includes("clear"):
            body.style.backgroundImage = "url('assets/sunny.jpg')";
            weatherIconEl.src = "assets/sunny-icon.png";
            break;

        case condition.includes("cloudy") || condition.includes("overcast"):
            body.style.backgroundImage = "url('assets/cloudy.jpg')";
            weatherIconEl.src = "assets/cloudy-day.png";
            break;

        case condition.includes("thunder") && condition.includes("rain"):
            body.style.backgroundImage = "url('assets/thunder.jpg')";
            weatherIconEl.src = "assets/thunder-icon.png";
            break;

        case condition.includes("snow"):
            body.style.backgroundImage = "url('assets/snow.jpg')";
            weatherIconEl.src = "assets/snowfall.png";
            break;

        case condition.includes("rain") || condition.includes("drizzle"):
            body.style.backgroundImage = "url('assets/rainy.jpg')";
            weatherIconEl.src = "assets/heavy-rain.png";
            break;

        case condition.includes("mist") || condition.includes("fog"):
            body.style.backgroundImage = "url('assets/mist.jpg')";
            if (condition.includes("freezing")) {
                weatherIconEl.src = "assets/freezing-rain.png";
            } else {
                weatherIconEl.src = "assets/mist.png";
            }
            break;

        default:
            body.style.backgroundImage = "linear-gradient(to right, #2c3e50, #3498db)";
            break;
    }
}


getWeather("London");
