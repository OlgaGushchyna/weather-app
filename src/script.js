const apiKey = "110fd0984645efd6578b5e387d5ecc74";
let celsiusTemp = null;
let celsiucTempMax = [];
let celsiucTempMin = [];
function formatDate(timestemp) {
  let date = new Date(timestemp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let hour = date.getHours();
  let minute = date.getMinutes();
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  let day = days[date.getDay()];
  return `${day} ${hour}:${minute}`;
}

function formatDay(timestemp) {
  let date = new Date(timestemp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastelement = document.querySelector("#weather-forecast-temp");

  let forecaseHTML = `<div class="row">`;
  forecast.forEach(function (forecaseDay, index) {
    celsiucTempMax[index] = forecaseDay.temp.max;
    celsiucTempMin[index] = forecaseDay.temp.min;
    if (index < 6) {
      forecaseHTML += `<div class="weather-forecast-background col-2">
              <div class="weather-forecast-date text-secondary">
              ${formatDay(forecaseDay.dt)}</div>
              <img
                src="http://openweathermap.org/img/wn/${
                  forecaseDay.weather[0].icon
                }@2x.png"
                width="42"
              />
              <div class="weather-forecast-temps text-secondary">
                <strong class="weather-forecast-temps-max" >${Math.round(
                  forecaseDay.temp.max
                )}°</strong>                
                <span class="weather-forecast-temps-min">${Math.round(
                  forecaseDay.temp.min
                )}°</span>
              </div>
            </div>`;
    }
  });
  forecaseHTML += `</div>`;
  forecastelement.innerHTML = forecaseHTML;
  if (fahrenheitLink.classList.contains("active")) {
    displayFahrenheitTempForecase();
  }
}

function getForecast(coordinates) {
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function getCityName(event) {
  event.preventDefault();
  let input = document.querySelector("#city-name");
  if (input.value !== "") {
    let cityName = input.value;
    showCityName(cityName);
  }
}

function showCityName(cityName) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
  axios
    .get(apiUrl)
    .then(showTemperature)
    .catch(function (error) {
      console.log(error);
      alert("City is not found");
    });
}

function chooseCity(event) {
  event.preventDefault();
  showCityName(event.path[0].childNodes[0].data);
  let input = document.querySelector("#city-name");
  input.value = "";
}

function showCelsiusTemp(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#temperature");
  tempElement.innerHTML = Math.round(celsiusTemp);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  let celsiusMaxLink = document.querySelectorAll(".weather-forecast-temps-max");
  celsiusMaxLink.forEach(function (celsiusMaxLink, index) {
    celsiusMaxLink.innerHTML = Math.round(celsiucTempMax[index]) + "°";
  });
  let celsiusMinLink = document.querySelectorAll(".weather-forecast-temps-min");
  celsiusMinLink.forEach(function (celsiusMinLink, index) {
    celsiusMinLink.innerHTML = Math.round(celsiucTempMin[index]) + "°";
  });
}

function showFahrenheitTemp(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  displayFahrenheitTemp();
  displayFahrenheitTempForecase();
}

function displayFahrenheitTemp() {
  let temp = document.querySelector("#temperature");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  temp.innerHTML = Math.round(fahrenheitTemp);
}

function displayFahrenheitTempForecase() {
  let celsiusMaxLink = document.querySelectorAll(".weather-forecast-temps-max");
  celsiusMaxLink.forEach(function (celsiusMaxLink, index) {
    celsiusMaxLink.innerHTML =
      Math.round((celsiucTempMax[index] * 9) / 5 + 32) + "°";
  });
  let celsiusMinLink = document.querySelectorAll(".weather-forecast-temps-min");
  celsiusMinLink.forEach(function (celsiusMinLink, index) {
    celsiusMinLink.innerHTML =
      Math.round((celsiucTempMin[index] * 9) / 5 + 32) + "°";
  });
}

// Name form
let searchCityForm = document.querySelector("#search-city");
searchCityForm.addEventListener("submit", getCityName);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", showCelsiusTemp);

let cityLisbon = document.getElementById("lisbon-city");
cityLisbon.addEventListener("click", chooseCity);
let cityParis = document.getElementById("paris-city");
cityParis.addEventListener("click", chooseCity);
let citySydney = document.getElementById("sydney-city");
citySydney.addEventListener("click", chooseCity);
let citySanFrancisco = document.getElementById("sanfrancisco-city");
citySanFrancisco.addEventListener("click", chooseCity);

function showTemperature(response) {
  let showCity = document.querySelector("#show-city");
  let tempShow = document.querySelector("#temperature");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let currentDayTime = document.querySelector("#corrent-daytime");
  let iconElement = document.querySelector("#icon");

  celsiusTemp = response.data.main.temp;  

  currentDayTime.innerHTML = formatDate(response.data.dt * 1000);
  showCity.innerHTML = response.data.name;
  if (fahrenheitLink.classList.contains("active")) {
    displayFahrenheitTemp();
  } else {
    tempShow.innerHTML = Math.round(response.data.main.temp);
  }
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

//Current position
function showPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
  let input = document.querySelector("#city-name");
  input.value = "";
}

function showcurrentPlaceTemp() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentPlaceTemp = document.getElementById("search-city").place;
currentPlaceTemp.addEventListener("click", showcurrentPlaceTemp);

showcurrentPlaceTemp();
