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
const newTaskButton = document.querySelector(".newTask");
const modal = document.querySelector(".task-modal");
const modalClose = document.querySelector(".modal-close");
const modalCancel = document.querySelector(".modal-cancel");
const taskForm = document.querySelector(".task-form");
const taskTitle = document.querySelector(".task-title-input");
const taskDescription = document.querySelector(".task-description-input");
const taskPriority = document.querySelector(".task-priority-select");
const taskStatus = document.querySelector(".task-status-select");
const taskCount = document.querySelector(".task-count");
let todos=JSON.parse(localStorage.getItem("todos")) || [];
const todoItem= document.querySelectorAll(".todo-item");
const modalButton = document.querySelector(".modal-submit");
// Convert date strings back to Date objects
todos = todos.map(todo => ({
    ...todo,
    dateDue: typeof todo.dateDue === 'string' ? new Date(todo.dateDue) : todo.dateDue,
    dateCreated: typeof todo.dateCreated === 'string' ? new Date(todo.dateCreated) : todo.dateCreated
}));


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
    inprogressList.innerHTML="";
    doneList.innerHTML="";
    todos.forEach(todo=>{
        const todoItem=document.createElement("div");
        todoItem.classList.add("todo-item");
        todoItem.setAttribute("data-id",todo.id);
        todoItem.setAttribute("draggable","true");
        const dateDue = new Date(todo.dateDue);
        const day = dateDue.getDate();
        const month = dateDue.toLocaleString('default', { month: 'long' });
        todoItem.innerHTML=`
       
            <div class="todo-header">

            <span>${todo&&todo.title}</span>
            
            </div>
            <div class="todo-body">
            
            <div class="todo-priority ${todo&&todo.priority.toLowerCase()}">${todo&&todo.priority}</div>
          <div class="todo-date"><i data-lucide="calendar-days" class="calendar-icon"></i> ${day} ${month}</div>
          </div>
           
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
        
        // Add drag event listeners to the DOM element
       
        
    });
    if(typeof lucide !== "undefined"){
        lucide.createIcons();
    }
    
    updateTaskCount();
}
todoList.addEventListener("click",(event)=>{
    const todoItem = event.target.closest(".todo-item");
    if(todoItem){
        const id = todoItem.getAttribute("data-id");
        const todo = todos.find(t => t.id == id);
        if(todo){
            openTaskCard(event,todo);
        }
    }
});
const handleTodoClick=(event)=>{
    const todoItem = event.target.closest(".todo-item");
    if(todoItem){
        const id = todoItem.getAttribute("data-id");
        const todo = todos.find(t => t.id == id);
        if(todo){
            openTaskCard(event,todo);
        }
    }
};
todoList.addEventListener("dragstart",(event)=>{
    const todoItem = event.target.closest(".todo-item");
    if(todoItem){
        event.dataTransfer.setData("text/plain", todoItem.getAttribute("data-id"));
    }
});
inprogressList.addEventListener("click",(event)=>{
    const todoItem = event.target.closest(".todo-item");
    if(todoItem){
        const id = todoItem.getAttribute("data-id");
        const todo = todos.find(t => t.id == id);
        if(todo){
            openTaskCard(event,todo);
        }
    }
});
inprogressList.addEventListener("dragstart",(event)=>{
    const todoItem = event.target.closest(".todo-item");
    if(todoItem){
        event.dataTransfer.setData("text/plain", todoItem.getAttribute("data-id"));
    }
});
doneList.addEventListener("click",(event)=>{
    const todoItem = event.target.closest(".todo-item");
    if(todoItem){
        const id = todoItem.getAttribute("data-id");
        const todo = todos.find(t => t.id == id);
        if(todo){
            openTaskCard(event,todo);
        }
    }
});
doneList.addEventListener("dragstart",(event)=>{
    const todoItem = event.target.closest(".todo-item");
    if(todoItem){
        event.dataTransfer.setData("text/plain", todoItem.getAttribute("data-id"));
    }
});



function saveLocalTodos(){
    localStorage.setItem("todos",JSON.stringify(todos));
}

function updateTaskCount(){
    if(taskCount){
        taskCount.innerText = `${todos.length} tasks`;
    }
}

function openTaskModal(){
    if(modal){
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }
}

function closeTaskModal(){
    if(modal){
        modal.classList.add("hidden");
        document.body.style.overflow = "";
    }
}

function resetTaskForm(){
    if(taskForm){
        taskForm.reset();
    }
}

function handleTaskSubmit(event){
    event.preventDefault();
    if(!taskTitle || !taskTitle.value.trim()){
        return;
    }
    const newTask = {
        id: Date.now(),
        title: taskTitle.value.trim(),
        description: taskDescription ? taskDescription.value.trim() : "",
        status: taskStatus ? taskStatus.value : "todo",
        priority: taskPriority ? taskPriority.value : "Medium",
        dateCreated: new Date(),
        dateDue: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    };
    todos.push(newTask);
    renderTodos();
    saveLocalTodos();
    closeTaskModal();
    resetTaskForm();
}

if(newTaskButton){
    newTaskButton.addEventListener("click", openTaskModal);
}
if(modalClose){
    modalClose.addEventListener("click", closeTaskModal);
}
if(modalCancel){
    modalCancel.addEventListener("click", closeTaskModal);
}
if(modal){
    modal.addEventListener("click", (event) => {
        if(event.target === modal){
            closeTaskModal();
        }
    });
}
if(taskForm){
    taskForm.addEventListener("submit", handleTaskSubmit);
}

function setupDropTarget(listElement, status){
  
    listElement.addEventListener("dragover", (event) => {
        event.preventDefault();
    });
    listElement.addEventListener("drop", (event) => {
        event.preventDefault();
        const id = event.dataTransfer.getData("text/plain");
        const todo = todos.find(t => t.id == id);
        if(todo && todo.status !== status){
            todo.status = status;
            saveLocalTodos();
            renderTodos();
        }
    });
}

openTaskCard=(event,todo)=>{
        event.preventDefault();
        const todoItem =document.querySelector(`.todo-item[data-id="${todo.id}"]`);
         todoItem.innerHTML=`<div class="task-card">
        <div class="task-title">
            <div class="task-title-left">
                <i data-lucide="circle"></i>
            <span>${todo.title}</span>
            </div>
            <i data-lucide="more-vertical"></i>
        </div>
        <div class="task-description">
            ${todo.description}
        </div>
        <div class="task-body">
            <div class="task-date"><i data-lucide="calendar"></i> ${todo.dateCreated.toDateString()}</div>
            <div class="task-priority"><i data-lucide="flag"></i> ${todo.priority}</div>
        </div>
     <div class="task-footer">
            <div class="task-assignees">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Assignee 1" class="assignee-avatar">
                <span class="assignee-name">Alice</span>
                </div>
                <div class="task-status"><i data-lucide="check-circle"></i> ${todo.status}</div>
            </div>
        </div>`;
            if(typeof lucide !== "undefined"){
                lucide.createIcons();
            }
            const handleClickOutside = (e) => {
                if(!todoItem.contains(e.target)){
                    renderTodos();
                    document.removeEventListener("click", handleClickOutside);
                }
            };
            document.addEventListener("click", handleClickOutside);
             todoItem.querySelector(".task-title").addEventListener("click",(event)=>{
                event.stopPropagation();
                openContextMenu(event,todo);
            });
}
openContextMenu=(event,todo)=>{
    event.preventDefault();
    const contextMenu = document.createElement("div");
    contextMenu.classList.add("context-menu");
    contextMenu.innerHTML=`
        <div class="context-menu-item" data-action="edit"><i data-lucide="edit"></i> Edit</div>
        <div class="context-menu-item" data-action="delete"><i data-lucide="trash-2"></i> Delete</div>
    `;
    document.body.appendChild(contextMenu);
    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.style.left = `${event.pageX}px`;
    if(typeof lucide !== "undefined"){
        lucide.createIcons();
    }
    const handleClickOutside = (e) => {
        if(!contextMenu.contains(e.target)){
            contextMenu.remove();
            document.removeEventListener("click", handleClickOutside);
        }
    };
    document.addEventListener("click", handleClickOutside);
    
    contextMenu.querySelectorAll(".context-menu-item").forEach(item => {
        item.addEventListener("click", () => {
            const action = item.getAttribute("data-action");
            if(action === "edit"){
                editTodo(todo.id);
            }
            else if(action === "delete"){
                todos = todos.filter(t => t.id !== todo.id);
                saveLocalTodos();
                renderTodos();
            }
            contextMenu.remove();
        });
    });

};
editTodo=(id)=>{
    const todo = todos.find(t => t.id == id);
    if(todo){
        openTaskModal();
        taskTitle.value = todo.title;
        taskDescription.value = todo.description;
        taskPriority.value = todo.priority;
        taskStatus.value = todo.status;
        modalButton.innerText = "Update Task";
        modalButton.removeEventListener("click", handleTaskSubmit);
        modalButton.removeEventListener("submit", handleTaskSubmit);
        modalButton.addEventListener("click", (event) => {
            event.preventDefault();
            todo.title = taskTitle.value.trim();
            todo.description = taskDescription.value.trim();
            todo.priority = taskPriority.value;
            todo.status = taskStatus.value;
            saveLocalTodos();
            renderTodos();
            closeTaskModal();
            resetTaskForm();
            modalButton.innerText = "Add Task";
            modalButton.removeEventListener("click", handleTaskSubmit);
            modalButton.addEventListener("click", handleTaskSubmit);
        });
    }
};

setupDropTarget(todoList, "todo");
setupDropTarget(inprogressList, "inprogress");
setupDropTarget(doneList, "done");

renderTodos();
setInterval(updateTimeAndDate,1000);
getLocation();