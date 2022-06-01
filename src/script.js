let date = new Date();
const apiKey = "110fd0984645efd6578b5e387d5ecc74";
function fotmatDate(date) {
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
  let tempElement = document.querySelector(".temperature");
  tempElement.innerHTML = temp;
}

function showFarengateTemp() {
  let temp = document.querySelector(".temperature");
  let Temp = parseInt(temp.textContent);
  let fahrenheitTemp = Math.round((Temp * 9) / 5 + 32);
  temp.innerHTML = fahrenheitTemp;
}

let currentDayTime = document.querySelector(".corrent-daytime");
let message = fotmatDate(date);
currentDayTime.innerHTML = message;

// Name form
let nameCity = document.querySelector("#search-city");
nameCity.addEventListener("submit", showCityName);

let celsiusTemp = document.querySelector("#celsius");
celsiusTemp.addEventListener("click", showCelsiusTemp);
let farengateTemp = document.querySelector("#farengate");
farengateTemp.addEventListener("click", showFarengateTemp);

function showPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}
function showTemperature(response) {
  let showCity = document.querySelector("#show-city");
  showCity.innerHTML = response.data.name;
  let tempShow = document.querySelector(".temperature");
  let temp = Math.round(response.data.main.temp);
  tempShow.innerHTML = temp;
}
function showcurrentPlaceTemp() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentPlaceTemp = document.getElementById("search-city").place;
currentPlaceTemp.addEventListener("click", showcurrentPlaceTemp);
