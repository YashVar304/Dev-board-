const currentLocation = document.querySelector(".location");
const weatherIcon = document.querySelector(".weatherIcon");
const temperature = document.querySelector(".temperature");
const temperatureDescription = document.querySelector(".temperature-description");
const humidity = document.querySelector(".humidity > .value");
const windSpeed = document.querySelector(".wind > .value");
const feelsLike = document.querySelector(".feelslike > .value");

let lon;
let lat;
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success,error);
    }
    else{
        console.log("");
    }
}
async function success(position){
    lon=position.coords.longitude;
    lat=position.coords.latitude;
    const data= await getWeatherUpdate(lon, lat);
    console.log(data);
    if(data && data.name){
        currentLocation && (currentLocation.innerText=data.name);
        temperature && (temperature.innerHTML=`${Math.round(data.main.temp-273.15)}<sup>°C</sup>`);
        temperatureDescription && (temperatureDescription.innerText=data.weather[0].description);
        weatherIcon && (weatherIcon.src=`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
        humidity && (humidity.innerText=data.main.humidity);
        windSpeed && (windSpeed.innerText=data.wind.speed);
        feelsLike && (feelsLike.innerHTML=`${Math.round(data.main.feels_like-273.15)}<sup>°C</sup>`);
    }

}
function error(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
     
      break;
    case error.POSITION_UNAVAILABLE:
     
      break;
    case error.TIMEOUT:
      
      break;
    case error.UNKNOWN_ERROR:
      break;
  }
}
async function getWeatherUpdate(lon,lat){
    let response =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c2109290889fdf65c3e0c865141f0a4d`);
    const data= await response.json();
    return data;
}
getLocation();