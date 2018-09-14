let boarddata = document.getElementById('board-data').innerHTML; /* Очень важная штука!!!!! */
let colunmsContainer = document.getElementById('board__container-columns');

let columnToDo = document.getElementsByClassName('column TO DO')[0];
let columnInProgress = document.getElementsByClassName('column In progress')[0];
let columnDone = document.getElementsByClassName('column Done')[0];

let taskEditor = document.getElementById('board__task-editor');
let board = document.getElementById('board');

let path =  `/get-task/${boarddata}`;

function renderTaskSettings(){ /* отрисовка настроек задачи */
    let taskData = {};

    colunmsContainer.addEventListener('click' , (event) => {
        event.stopPropagation();
        if (!event.target.classList.contains('fa-cog')) {
            return null
        } else {
            let evTargetId = event.target.closest('.column-rows_task');
            let tast = {};

            taskData.id = evTargetId.id;
            taskEditor.style.cssText = "display:flex";
            xhr = new XMLHttpRequest();
            xhr.open('GET', `/task/${evTargetId.id}`, false); 
            xhr.send();
            task = JSON.parse(xhr.responseText)[0][0];

            taskEditor.innerHTML = `
                <div>
                    <label for="">Имя задачи</label>
                    <input id="task-editor_name" type="text" value="${task.newtask_name}">
                    
                </div>
                <div>
                    <label for="">Описание задачи</label>
                    <textarea id="task-editor_discriotion" >${task.newtask_discription}</textarea>
                </div>
                <div>
                    <label for="">Приоритет</label>
                    <select id="task-editor_priority" selected="${task.newtask_priority}">
                        <option >Высокий</option>
                        <option >Средний</option>
                        <option >Низкий</option>
                    </select>
                </div>
                <div>
                    <label for="">Метки</label>
                    <input id="task-editor_label" type="text" value="${task.newtask_label}">
                </div>
                <div>
                    <label for="">Пользователь</label>
                    <input id="task-editor_user" type="text" value="${task.newtask_worker}">
                </div> 
                <button class="send-data" id="send-data">Сохранить</button>
            `
        }
    });
    
    taskEditor.addEventListener('click',() => { /* перезапись данных текущий задчи */
        if (!event.target.classList.contains('send-data')) {
            return null
        } else {
            const getElementValue = selector => (document.getElementById(selector) || {}).value;

            taskData.name = getElementValue('task-editor_name'); 
            taskData.discription = getElementValue(`task-editor_discriotion`);
            taskData.priority = getElementValue(`task-editor_priority`);
            taskData.label = getElementValue(`task-editor_label`);
            taskData.user = getElementValue(`task-editor_user`);
            
            json = JSON.stringify(taskData);
            xhr = new XMLHttpRequest();
            xhr.open('PUT', 'update-task/', false);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(json);

            taskEditor.style.cssText = "display:none";
        
        }
    }) 
};


function closeTaskSettings (){ /* При клике сквозь форму редактироания должна закрывать, но чтo то не так */
    board.addEventListener('click', (event) => {
        if ( !event.target.closest('.board__task-editor' ) ) {
            taskEditor.style.cssText = "display:none";
        }
    })
}; 

function renderTask(){ /* Отрисовка задач */
    xhr = new XMLHttpRequest();
    xhr.open('GET', '/get-task/' + boarddata, false);
    xhr.send();

    json = JSON.parse(xhr.responseText)[0];
    console.log(json);
    filterTask(json,columnToDo,  'TO DO', 'todo');
    filterTask(json, columnInProgress, 'In progress', 'inprogress' );
    filterTask(json,columnDone, 'Done', 'done' );
};

function filterTask(arr, parent,  status, idPrefics){ 

    parent.status = status;
    parent.users = {};
    items = arr.filter((item) => item.newtask_status === parent.status)
    items.forEach(element => { /* отфильтровал пользователей в колонке */
        let str = element.newtask_worker;
        parent.users[str] = true;
    });
    for(key in parent.users){

        let idRow = idPrefics + key;
        createRows(key,idRow,parent);
        subItems = items.filter((item) => { 
            return item.newtask_worker == key;
        });
        subItems.forEach(item => {
           createTask(item.newtask_name, item.newtask_label, item.newtask_discription, item.newtask_type, item.newtask_worker, item.newtask_status, item.newtask_priority, idRow, item.id_task) 
        })
        
    };
};

function createTask(name, label, discription, type, userIconContent, status, priority, parent, id_task){
    let rowrow = document.getElementById(parent);

    let task = document.createElement('div');    
    task.className = "column-rows_task";
    task.id = id_task;
    task.staus = status;

    let taskPriority = document.createElement('div'); /* Индикация приоритета */
    taskPriority.className = 'column-rows_task-priority';

    let taskBody = document.createElement('div'); /* тело задачи */
    taskBody.className = 'column-rows_task-body';

    switch(priority){
        case 'Высокий': taskPriority.style.background = '#eb5a46'; break;
        case 'Средний': taskPriority.style.background = '#ffab4a'; break;
        case 'Низкий': taskPriority.style.background = '#61bd4f'; break;
        default: break;
    };

    let iconContant = userIconContent.split(' ');
    let [userNaame, userLastname] = iconContant;
    let abbreviature = (userNaame[0] + userLastname[0]).toUpperCase();
   
   
    taskBody.innerHTML = `
            <div class="task__name-and-sets"> <!-- тело задачи -->
                <div class="task__name">${name}</div>
                <div class="task__set">
                <i class="fas fa-cog"></i>
            </div>
            </div>
            <div class="task__label">
                <span>Метки: ${label}</span>
            </div>
            <div class="task__label">
                <span>Описание: ${discription}</span>
            </div>
            <div class="task__type">
                <span>Тип задачи:${type}</span>
            </div>
            <div class="task__user-icon">
                ${abbreviature}
            </div>`;

        task.prepend(taskPriority);
        task.append(taskBody);
        rowrow.prepend(task);
    
};

function createRows(userIconContent,id,parent){
    let rows = document.createElement('div');
    rows.className = 'column-rows';
    rows.id = id;

    rows.innerHTML = `
            <div class="column-rows">
                <div class="task__user"> <!-- тело юзера -->
                    <span>Пользователь: ${userIconContent}</span>
                </div>    
            </div>
            `
            parent.append(rows);
    return rows;
};

function init(){
    renderTaskSettings();
    closeTaskSettings();
    renderTask();
}; init();

















