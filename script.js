//  my api key 
const apiKey = "bbd443ceafd641435a14ff18d36acdba";

// api url for weather and forcast 
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiUrl_2 = 'https://api.openweathermap.org/data/2.5/forecast';

//  take the elements 
const search_input = document.getElementById("city_input");
const search_btn = document.getElementById("Search_btn");
const location_btn = document.getElementById("location_btn");
const recent_cities = document.getElementById("recent_cities");
const weather_container = document.getElementById("weather_container");
const visited_cities = document.getElementById("visited_cities");
const error_content = document.getElementById("error_content");


// get the weather data 
async function getWeatherData(query) {
  try {
    const response = await fetch(`${apiUrl}?q=${query}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
      throw new Error("error while fetching");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    displayError('city not found');
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// get the weather data by location 
async function getWeatherDataByLocation(lat, lon) {
  try {
    const response = await fetch(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
      throw new Error("unable to fetch the data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    displayError('Weather data not available');
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// get the image according to the weather status
function getWeatherImage(main) {
  switch (main) {
    case 'Clear':
      return 'src/assets/img/clear-sky.png';
    case 'Clouds':
      return 'src/assets/img/clouds.png';
    case 'Rain':
      return 'src/assets/img/rain.png';
    case 'Drizzle':
      return 'src/assets/img/drizzle.png';
    case 'Thunderstorm':
      return 'src/assets/img/thunderstorm.png';
    case 'Snow':
      return 'src/assets/img/snow.png';
    case 'Mist':
      return 'src/assets/img/mist.png';
    case 'Smoke':
      return 'src/assets/img/smoke.png';
    case 'Haze':
      return 'src/assets/img/haze.png';
    case 'Dust':
      return 'src/assets/img/dust.png';
    case 'Fog':
      return 'src/assets/img/fog.png';
    case 'Sand':
      return 'src/assets/img/sand.png';
    case 'Ash':
      return 'src/assets/img/ashes.png';
    case 'Squall':
      return 'src/assets/img/squall.png';
    case 'Tornado':
      return 'src/assets/img/tornado.webp';
    default:
      return 'src/assets/img/weather.png';
  }
}

// get the forecast data 
async function getExtendedForecast(query) {
  try {
    const response = await fetch(`${apiUrl_2}?q=${query}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
      throw new Error("Error while fetching forecast data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    display_forecast_Error('Forecast data not available');
    console.error('Error fetching extended forecast data:', error);
    return null;
  }
}


// get the forecast data by location 
async function getExtendedForecastByLocation(lat, lon) {
  try {
    const response = await fetch(`${apiUrl_2}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
      throw new Error('Forecast data not available');
    }
    const data = await response.json();

    return data;
  } catch (error) {
    display_forecast_Error('Forecast data not available');
    console.error('Error fetching extended forecast data:', error);
    return null;
  }
}


// display weather data 
function displayWeather(data) {
  if (!data) {
    return;
  }

  const { main, wind } = data;
  const image_title = data.weather[0].main;
  const status = data.weather[0].description;
  const weatherImage = getWeatherImage(image_title);
  const weatherHtml = ` 
   <div class='flex flex-col bg-white text-black p-4'>
  <h2 class="text-4xl text-center font-semibold">${data.name}</h2>
    <div class="mt-6 flex justify-evenly items-center flex-col md:flex-row">
    <div class="flex items-center mt-2 flex-col">
    <img class='w-24 h-24' src="${weatherImage}" alt="${image_title}"/>
    <p> ${status} </p>
      </div>
      <div class="flex flex-col"> 
       <p class="text-lg font-semibold">Temperature: ${main.temp}°C</p>
      <p class="text-lg font-semibold">Humidity: ${main.humidity}%</p>
      <p class="text-lg font-semibold">Wind Speed: ${wind.speed} m/s</p>
      </div>
    </div>
    </div>
  `;

  weather_container.innerHTML = weatherHtml;
}

//  display forecast data 
function displayExtendedForecast(data) {
  if (!data) {
    return;
  }
  let forecastContainer = document.getElementById('forecast_container');
  if (!forecastContainer) {
    forecastContainer = document.createElement('div');
    forecastContainer.id = 'forecast_container';
    forecastContainer.classList.add('mt-6', 'flex', 'flex-wrap', 'justify-center', 'gap-4', 'text-black',
      'items-center'
    );
    weather_container.appendChild(forecastContainer);
  } else {
    forecastContainer.innerHTML = '';
  }


  const dailyData = {};
  data.list.forEach(item => {
    const today = new Date().toISOString().split('T')[0];
    const date = new Date(item.dt_txt);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayKey = date.toISOString().split('T')[0];

    if (dayKey !== today && !dailyData[dayKey]) {
      dailyData[dayKey] = { day, date, data: item };
    }
  });


  Object.values(dailyData).forEach(dayData => {
    const { day, date, data } = dayData;
    const weatherImage = getWeatherImage(data.weather[0].main);
    const formattedDate = date.toLocaleDateString('en-GB').split('/').join('-');
    const dayHtml = `
      <div class="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
        <h3 class="text-lg font-semibold">${day}</h3>
        <p>${formattedDate}</p>
        <img class="mx-auto mt-2 w-12 h-12" src="${weatherImage}" alt="${data.weather[0].main}">
        <p class="text-center"> ${data.weather[0].main} </p>
        <p class="text-lg">Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
      </div>
    `;
    forecastContainer.innerHTML += dayHtml;
  });
}

// for handling weather error 
function displayError(msg) {
  weather_container.innerHTML = '';
  weather_container.innerHTML = `<p class="text-red-500 text-center">${msg}</p>`;
}

// for handling forecast error 
function display_forecast_Error(msg) {
  error_content.innerHTML = `<p class="text-red-500 text-center">${msg}</p>`;
}

// clear forcast error 
function clearError() {
  error_content.innerHTML = '';
}

// update the recent cities  
function updateRecentCities(city) {
  let cities = JSON.parse(sessionStorage.getItem('recentCities')) || [];
  if (!cities.includes(city)) {
    cities.unshift(city);
    if (cities.length > 5) {
      cities.pop();
    }
    sessionStorage.setItem('recentCities', JSON.stringify(cities));
  }
}

// load the recent cities 
function loadRecentCities() {
  let cities = JSON.parse(sessionStorage.getItem('recentCities')) || [];
  recent_cities_dropdown.innerHTML = '<option value="" disabled selected>Select a city</option>';
  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    option.classList.add('bg-gray-800', 'text-white', 'rounded',);
    recent_cities_dropdown.appendChild(option);
  });

  if (cities.length > 0) {
    visited_cities.style.display = 'block';
  } else {
    visited_cities.style.display = 'none';
  }
}

recent_cities_dropdown.addEventListener("change", async (event) => {
  const query = event.target.value;
  const data = await getWeatherData(query);
  displayWeather(data);
  clearError();
  const data_2 = await getExtendedForecast(query);
  displayExtendedForecast(data_2);
});

document.addEventListener("DOMContentLoaded", loadRecentCities);

// search button events
search_btn.addEventListener("click", async () => {
  const query = search_input.value.trim();
  if (query) {
    weather_container.innerHTML = `<p class='text-center'> loading... </p>`;
    const currentWeatherData = await getWeatherData(query);
    const extendedForecastData = await getExtendedForecast(query);
    displayWeather(currentWeatherData);
    displayExtendedForecast(extendedForecastData);
    updateRecentCities(query);
    loadRecentCities();
    clearError();
    search_input.value = '';
  } else {
    displayError('Please enter a city name');
  }
});

// location button events
location_btn.addEventListener("click", async () => {
  weather_container.innerHTML = `<p class='text-center'> loading... </p>`;
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const currentWeatherData = await getWeatherDataByLocation(latitude, longitude);
      const extendedForecastData = await getExtendedForecastByLocation(latitude, longitude);
      displayWeather(currentWeatherData);
      displayExtendedForecast(extendedForecastData);
      clearError();
    }, () => {
      displayError(`Please give the location permission`);
    });
  } else {
    displayError('Geolocation is not supported by your browser');
  }
});

