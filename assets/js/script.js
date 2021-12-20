//Global Variables
const apiKey = '52655da77e33cf3f2f5642ecaeb48812';
let city;

//Functions
const searchCity = (city) => {
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    const lat = data[0].lat;
    const lon = data[0].lon;
    searchWeather(lat, lon);
  });
}

const searchWeather = (lat, lon) => {
  fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
  .then(response => response.json())
  .then(data => populatePage(data));
}

const populatePage = (data) => {
  displayWeather(data.current, $('#current-info'), isCurrent = true);
  $('.five-day-block').each(function(index) {
    displayWeather(data.daily[index], $(this));
  });
}

const displayWeather = (data, element, isCurrent = false) => {
  const dateCode = data.dt;
  const date = moment.unix(dateCode).format("MM/DD/Y");
  const title = isCurrent ? `${city} (${date})` : date;
  element.children('h2, h4').prepend(title);

  const icon = data.weather[0].icon;
  const iconURL = `http://openweathermap.org/img/w/${icon}.png`;
  const alt = data.weather[0].description;
  element.find('.weather-icon').attr({"src": iconURL, "alt": alt});

  const temp = isCurrent ? data.temp : data.temp.day;
  element.find('.temp').text(temp);

  const wind = data.wind_speed;
  element.find('.wind').text(wind);

  const humidity = data.humidity;
  element.find('.humidity').text(humidity);

  if (isCurrent) {
    const uvIndex = data.uvi;
    element.find('.uv-index').text(uvIndex);
  } 
}

//Run on initial load
$('#current-info, #five-day').css('visibility', 'hidden');
navigator.geolocation.getCurrentPosition(position => {
  const currentLat = position.coords.latitude;
  const currentLon = position.coords.longitude;
  fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${currentLat}&lon=${currentLon}&limit=1&appid=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    city = data[0].name;
    searchWeather(currentLat, currentLon);
    $('#current-info, #five-day').css('visibility', 'visible');
  });
}, error => {});

//Event Listeners