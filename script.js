// Open Weather API Key
let apiKey = "15ed5d92f7b4157fdab57b1053c46052";
let city = "Los Angeles";
let units = "imperial";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}`;
let celsiusTemp = null;
let fahrenTemp = null;
let fTempMin = [];
let fTempMax = [];
let cTempMin = null;
let cTempMax = null;
let weatherTempMax = null;
let weatherTempMin = null;
let fTempFL = null;
let curFeelsLike = null;
let feelsLikeTemp = null;
let defaultTemp = "F";
let CorFBut = document.querySelector(".CorF");
let CorFLet = document.querySelector("span.CorFLetter");
CorFLet = "F";

// testing below Kassie

// - - - - - - - - - - - - - - - - - - - - - - - - - -

// Date and Time BELOW -----
let dateTime = document.querySelector(".dateAndTime");
let fullDate = document.querySelector("#fullDate");
let fullDay = document.querySelector("#fullDay");
let fullTime = document.querySelector("#fullTime");

function displayDate() {
  let now = new Date();
  let dayOfMon = new Date().getDate();
  let day = now.getDay();
  let month = now.getMonth();
  let year = now.getFullYear();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  let ampm = now.getHours() >= 12 ? "pm" : "am";
  hour = hour % 12;
  if (hour === 0) {
    hour = 12;
  }

  let dayOfWk = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let wkDay = dayOfWk[day];

  let monthNames = [
    "Jan",
    "feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let mon = monthNames[month];

  fullDate.innerHTML = mon + " " + dayOfMon + ", " + year;

  fullDay.innerHTML = wkDay;

  fullTime.innerHTML = hour + ":" + minutes + ampm;
}

// on LOAD, the date and time refreshes
if (dateTime) {
  dateTime.addEventListener("load", displayDate());
}
// Date and Time ABOVE -----

// - - - - - - - - - - - - - - - - - - - - - - - - - -

// display current weather details
function displayCurWeatherCondition(response) {
  let city = response.data.name;
  let iconElement = document.querySelector("#currentIcon");
  document.querySelector("h4.city").innerHTML = city;
  fahrenTemp = response.data.main.temp;
  feelsLikeTemp = response.data.main.feels_like;
  document.querySelector("span.currentTemp").innerHTML = Math.round(fahrenTemp);
  document.querySelector("span.CorFLetter").innerHTML = "°F";
  document.querySelector(".CorF").innerHTML = " °C or [°F] ";
  document.querySelector("span.currentDescription").innerHTML =
    response.data.weather[0].description;
  document.querySelector("span.currentHumidity").innerHTML =
    response.data.main.humidity + "%";
  document.querySelector("span.currentWind").innerHTML =
    Math.round(response.data.wind.speed) + "mph";
  document.querySelector("span.feelsLikeTemp").innerHTML = Math.round(
    response.data.main.feels_like
  );
  feelsLikeTemp = response.data.main.feels_like;
  document.querySelector("span.highLow").innerHTML =
    Math.round(response.data.main.temp.min) + "° ";
  console.log(response.data.current);

  let iconData = response.data.weather[0].icon;

  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${iconData}@2x.png`
  );
  getForecast(response.data.coord);
}

// display otherDays weather details
function displayOthWeatherCondition(response) {
  if (units === "imperial") {
    let CorFLet = document.querySelector("span.CorFLetter");
    CorFLet = "F";
  } else {
    CorFLet = "C";
  }
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days[day];
}

// OTHER DAY FORECAST - Write code once and duplicate in JS
function displayForecast(response) {
  let forecast = response.data.daily;
  console.log(forecast);

  let tempToCorF = document.querySelector("button.CorF");
  tempToCorF.addEventListener("click", calcTemp);

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row weatherRow">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      fTempMin[index] = forecastDay.temp.min;
      console.log(fTempMin[index]);
      fTempMax[index] = forecastDay.temp.max;
      console.log(fTempMax[index]);

      forecastHTML += `
        <div class="col-2 weather-forecast">
          <div class="weather-forecast-day">${formatDay(forecastDay.dt)}</div>
          <img class="weather-icon"
            src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png"
            alt=""
            width="42"
          />
          <div class="weather-forecast-temperatures">
            <span class="weather-forecast-temp-max"> ${Math.round(
              forecastDay.temp.max
            )}° </span>
            <span> | </span>
            <span class="weather-forecast-temp-min"> ${Math.round(
              forecastDay.temp.min
            )}° </span>
          </div>
          <div class="forecastMain"> ${forecastDay.weather[0].main} </div>
        </div>
      `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// Update city based on search input BELOW ------
function displaySearchedCity(event) {
  event.preventDefault();

  // uses the city name that the user enters
  let searchIn = document.querySelector("#search-text-input");
  let cityInput = document.querySelector("h4.city");

  // make an API call to OpenWeather API & once response rcvd, display city name & temp
  if (searchIn.value) {
    cityInput.innerHTML = searchIn.value;
    let apiKey = "15ed5d92f7b4157fdab57b1053c46052";
    // let city = document.querySelector("h4.city").value;
    let city = searchIn.value;
    units = "imperial";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    axios.get(`${apiUrl}&appid=${apiKey}`).then(displayCurWeatherCondition);
    // axios.get(`${apiUrl}&appid=${apiKey}`).then(displayOthWeatherCondition);
  } else {
    cityInput.innerHTML = "Please enter a city.";
  }
}

// function used when user clicks "Current Location" button to show city/temp
function searchCurrentCity(position) {
  // KASSIE COME BACK NEED TO FIGURE OUT WHY THIS ISN'T REMOVING TEXT IN SEARCH FIELD
  let searchIn = document.querySelector("#search-text-input");
  searchIn.value.innerHTML = "Search for a city";

  let apiKey = "15ed5d92f7b4157fdab57b1053c46052";
  let units = "imperial";
  // let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(displayCurWeatherCondition);
  // axios.get(`${apiUrl}&appid=${apiKey}`).then(displayOthWeatherCondition);
}

// Calls display city function when user submits from search bar
let formInput = document.querySelector("#search-form");
formInput.addEventListener("submit", displaySearchedCity);

//Function when user clicks on the "C or F" button - updates temperature metric/imperial
function calcTemp(event) {
  let highLowTemp = document.querySelector("span.highLow");
  let curTemp = document.querySelector("span.currentTemp");
  let feelsLike = document.querySelector("span.feelsLikeTemp");

  let CorFBut = document.querySelector(".CorF");
  let CorFLet = document.querySelector("span.CorFLetter");
  let FLCorFLetter = document.querySelector("span.FLCorFLetter");
  FLCorFLetter.innerHTML = "°F";

  if (units === "imperial") {
    units = "metric";
  } else {
    units = "imperial";
  }

  if (defaultTemp === "F") {
    celsiusTemp = (fahrenTemp - 32) / 1.8;
    curTemp.innerHTML = Math.round(celsiusTemp);
    /////
    curFeelsLike = (feelsLikeTemp - 32) / 1.8;
    feelsLikeTemp = curFeelsLike;
    feelsLike.innerHTML = Math.round(curFeelsLike);
    units = "metric";
    CorFLet.innerHTML = "°C";
    FLCorFLetter.innerHTML = "°C";
    CorFBut.innerHTML = " [°C] or °F ";
    defaultTemp = "C";
  } else {
    curTemp.innerHTML = Math.round((celsiusTemp * 9) / 5 + 32);
    /////
    curFeelsLike = (feelsLikeTemp * 9) / 5 + 32;
    feelsLikeTemp = curFeelsLike;
    feelsLike.innerHTML = Math.round(curFeelsLike);
    units = "imperial";
    CorFLet.innerHTML = "°F";
    FLCorFLetter.innerHTML = "°F";
    CorFBut.innerHTML = " °C or [°F] ";
    defaultTemp = "F";
  }

  if (units === "imperial") {
    let CorFLet = document.querySelector("span.CorFLetter");
    CorFLet = "F";
  } else {
    let CorFLet = document.querySelector("span.CorFLetter");
    CorFLet = "C";
  }

  let tempToCorF = document.querySelector("button.CorF");
  tempToCorF.addEventListener("click", calcTemp);
}

let cityEntered = document.querySelector("h4.city");
cityEntered.innerHTML = city;
axios.get(`${apiUrl}&appid=${apiKey}`).then(displayCurWeatherCondition);

// If user selects the C or F button, calls calcTemp function
let tempToCorF = document.querySelector("button.CorF");
tempToCorF.addEventListener("click", calcTemp);

// Function to show CURRENT location information AND calls to display city
function showPosition(position) {
  console.log(position);
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiKey = `15ed5d92f7b4157fdab57b1053c46052`;

  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather`;
  let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(displayCurWeatherCondition);
  navigator.geolocation.getCurrentPosition(searchCurrentCity);

  let curLocButton = document.querySelector("button.currentButton");
  curLocButton.addEventListener("click", getCurrentPosition);
}

function getForecast(coordinates) {
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let units = "imperial";
  let apiKey = `15ed5d92f7b4157fdab57b1053c46052`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
  //axios.get(apiUrl).then(otherDaysInRows);
}

// calls showPosition
function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

// when user clicks "current location" button
let curLocButton = document.querySelector("button.currentButton");
curLocButton.addEventListener("click", getCurrentPosition);
