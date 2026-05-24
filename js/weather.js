const currentLocation = document.querySelector(".location");
const weatherIcon = document.querySelector(".weatherIcon");
const temperature = document.querySelector(".temperature");
const temperatureDescription = document.querySelector(".temperature-description");
const humidity = document.querySelector(".humidity > .value");
const windSpeed = document.querySelector(".wind > .value");
const feelsLike = document.querySelector(".feelslike > .value");
const time = document.querySelector(".time");
const date = document.querySelector(".date");
const ampm = document.querySelector(".ampm");

const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const inprogressList = document.querySelector(".inprogress-list");
const doneList = document.querySelector(".done-list");

let todos=[
  {
    id:1,
    title:"Task 1",
    description:"This is task 1",
    status:"done",
    priority:"High",
    dateCreated:new Date(),
     dateDue:new Date(new Date().getTime() + 7*24*60*60*1000)
  },
  {
    id:2,
    title:"Task 2",
    description:"This is task 2",
    status:"inprogress",
    priority:"Medium",
    dateCreated:new Date(),
    dateDue:new Date(new Date().getTime() + 7*24*60*60*1000)
  },
  {
    id:3,
    title:"Task 3",
    description:"This is task 3",
    status:"todo",
    priority:"Low",
    dateCreated:new Date(),
    dateDue:new Date(new Date().getTime() + 7*24*60*60*1000)
  }
];

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
function updateTimeAndDate(){
    const now = new Date();
    const hours = now.getHours()%12 || 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const day = now.getDate();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    const AMPM = hours >= 12 ? 'PM' : 'AM';
    time.innerText=`${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    ampm.innerText=` ${AMPM}`;
    date.innerText=`${day} ${month} ${year}`;
}

function renderTodos(){
    todoList.innerHTML="";
    todos.forEach(todo=>{
        const todoItem=document.createElement("div");
        todoItem.classList.add("todo-item");
        todoItem.innerHTML=`
       
            <div class="todo-title">

            <i class="task-menu" data-lucide="ellipsis-vertical"></i>
            <span>${todo.title}</span>
            <div class="todo-priority ${todo.priority.toLowerCase()}">${todo.priority}</div>
            </div>
          <div class="todo-date">${todo.dateDue.toLocaleDateString()}</div>
           
        `;
        if(todo.status==="inprogress"){
            inprogressList.appendChild(todoItem);
        }
        else if(todo.status==="done"){
            doneList.appendChild(todoItem);
        }
         else{
            todoList.appendChild(todoItem);
        }
    });
}
renderTodos();
setInterval(updateTimeAndDate,1000);
getLocation();