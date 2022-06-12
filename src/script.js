const apiKey = "110fd0984645efd6578b5e387d5ecc74";
let celsiusTemp = null;
function fotmatDate(timestemp) {
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
  console.log(response.data.daily);
  let forecast = response.data.daily;
  let forecastelement = document.querySelector("#weather-forecast-temp");

  let forecaseHTML = `<div class="row">`;
  forecast.forEach(function (forecaseDay, index) {
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
                <strong class="weather-forecast-temps-max">${Math.round(
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
}

function getForecast(coordinates) {
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showCityName(event) {
  event.preventDefault();
  let input = document.querySelector("#city-name");
  if (input.value !== "") {
    let cityName = input.value;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
    axios
      .get(apiUrl)
      .then(showTemperature)
      .catch(function (error) {
        console.log(error);
        alert("City is not found");
      });
  }
}

function showCelsiusTemp(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#temperature");
  tempElement.innerHTML = Math.round(celsiusTemp);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

function showFahrenheitTemp(event) {
  event.preventDefault();
  let temp = document.querySelector("#temperature");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  temp.innerHTML = Math.round(fahrenheitTemp);
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

// Name form
let searchCityForm = document.querySelector("#search-city");
searchCityForm.addEventListener("submit", showCityName);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", showCelsiusTemp);

function showTemperature(response) {
  let showCity = document.querySelector("#show-city");
  let tempShow = document.querySelector("#temperature");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let currentDayTime = document.querySelector("#corrent-daytime");
  let iconElement = document.querySelector("#icon");

  celsiusTemp = response.data.main.temp;

  currentDayTime.innerHTML = fotmatDate(response.data.dt * 1000);
  showCity.innerHTML = response.data.name;
  tempShow.innerHTML = Math.round(response.data.main.temp);
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
