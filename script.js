// Open Weather API Key
let apiKey = "15ed5d92f7b4157fdab57b1053c46052";
let city = "Los Angeles";
let units = "imperial";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}`;
let celsiusTemp = null;
let fahrenTemp = null;

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

  fullTime.innerHTML = hour + ":" + minutes + ampm + " EST";
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
  document.querySelector("h4.city").innerHTML = city;
  fahrenTemp = response.data.main.temp;
  document.querySelector("span.currentTemp").innerHTML = Math.round(fahrenTemp);
  document.querySelector("span.currentHumidity").innerHTML =
    response.data.main.humidity + "%";
  document.querySelector("span.currentWind").innerHTML =
    Math.round(response.data.wind.speed) + "mph";
  document.querySelector("span.currentDescription").innerHTML =
    response.data.weather[0].description;
  let iconElement = document.querySelector(".weatherIconCurrent");
  iconElement.setAttribute(
    "weatherIconCurrent",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
}

// display otherDays weather details
function displayOthWeatherCondition(response) {
  document.querySelector("span.otherTemp").innerHTML = Math.round(
    response.data.main.temp
  );
  fahrenTemp = response.data.main.temp;
  document.querySelector("span.currentTemp").innerHTML = Math.round(fahrenTemp);
  document.querySelector("span.otherHumidity").innerHTML =
    response.data.main.humidity + "%";
  document.querySelector("span.otherWind").innerHTML =
    Math.round(response.data.wind.speed) + "mph";
  document.querySelector("span.otherDescription").innerHTML =
    response.data.weather[0].description;
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
    let units = "imperial";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    axios.get(`${apiUrl}&appid=${apiKey}`).then(displayCurWeatherCondition);
  } else {
    cityInput.innerHTML = "Please enter a city.";
  }
}

// function used when user clicks "Current Location" button to show city/temp
function searchCurrentCity(position) {
  let apiKey = "15ed5d92f7b4157fdab57b1053c46052";
  let units = "imperial";
  // let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(displayCurWeatherCondition);
  axios.get(`${apiUrl}&appid=${apiKey}`).then(displayOthWeatherCondition);
}

// Calls display city function when user submits from search bar
let formInput = document.querySelector("#search-form");
formInput.addEventListener("submit", displaySearchedCity);

//Function when user clicks on the "C or F" button - updates temperature metric/imperial
let defaultTemp = "F";
function calcTemp(event) {
  let highLowTemp = document.querySelector("span.highLow");
  let curTemp = document.querySelector("span.currentTemp");

  let CorFBut = document.querySelector(".CorF");
  let CorFLet = document.querySelector("span.CorFLetter");

  if (defaultTemp === "F") {
    //(Fahrenheit - 32) / 1.8
    celsiusTemp = (fahrenTemp - 32) / 1.8;
    curTemp.innerHTML = Math.round(celsiusTemp);
    CorFLet.innerHTML = "°C";
    // highLowTemp.innerHTML = " 33°C / 37°C ";
    CorFBut.innerHTML = " [ °C ] or °F ";
    defaultTemp = "C";
  } else {
    curTemp.innerHTML = Math.round((celsiusTemp * 9) / 5 + 32);
    // highLowTemp.innerHTML = " 79°F / 82°F ";
    CorFBut.innerHTML = " °C or [ °F ] ";
    CorFLet.innerHTML = "°F";
    defaultTemp = "F";
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
  let units = "imperial";
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/weather`;
  let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(displayCurWeatherCondition);
  navigator.geolocation.getCurrentPosition(searchCurrentCity);

  let curLocButton = document.querySelector("button.currentButton");
  curLocButton.addEventListener("click", getCurrentPosition);
}

// calls showPosition
function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

// when user clicks "current location" button
let curLocButton = document.querySelector("button.currentButton");
curLocButton.addEventListener("click", getCurrentPosition);
