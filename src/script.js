const apiKey = "110fd0984645efd6578b5e387d5ecc74";

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

  let message = `${days[date.getDay()]} ${hour}:${minute}`;
  return message;
}

function showCityName(event) {
  event.preventDefault();
  let input = document.querySelector("#city-name");
  if (input.value !== "") {
    let showCity = document.querySelector("#show-city");
    let cityName = input.value;
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    showCity.innerHTML = cityName;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(showCelsiusTemp);
  }
}

function showCelsiusTemp(response) {
  let temp = Math.round(response.data.main.temp);
  let tempElement = document.querySelector("#temperature");
  tempElement.innerHTML = temp;
}

function showFarengateTemp() {
  let temp = document.querySelector("#temperature");
  let Temp = parseInt(temp.textContent);
  let fahrenheitTemp = Math.round((Temp * 9) / 5 + 32);
  temp.innerHTML = fahrenheitTemp;
}

// Name form
let nameCity = document.querySelector("#search-city");
nameCity.addEventListener("submit", showCityName);

let celsiusTemp = document.querySelector("#celsius");
celsiusTemp.addEventListener("click", showCelsiusTemp);
let farengateTemp = document.querySelector("#farengate");
farengateTemp.addEventListener("click", showFarengateTemp);

function showTemperature(response) {
  let showCity = document.querySelector("#show-city");
  let tempShow = document.querySelector("#temperature");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let currentDayTime = document.querySelector(".corrent-daytime");

  currentDayTime.innerHTML = fotmatDate(response.data.dt * 1000);
  showCity.innerHTML = response.data.name;
  tempShow.innerHTML = Math.round(response.data.main.temp);
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
}

//Current position
function showPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function showcurrentPlaceTemp() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentPlaceTemp = document.getElementById("search-city").place;
currentPlaceTemp.addEventListener("click", showcurrentPlaceTemp);

showcurrentPlaceTemp();