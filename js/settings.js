let boarddata = document.getElementById('board-data').innerHTML; /* Очень важная штука!!!!! */
let path = '/get-task/'+boarddata;
let colunmsContainer = document.getElementById('board__container-columns');

let columnToDo = document.getElementsByClassName('column TO DO')[0];
let columnInProgress = document.getElementsByClassName('column In progress')[0];
let columnDone = document.getElementsByClassName('column Done')[0];

let taskEditor = document.getElementById('board__task-editor');
let board = document.getElementById('board');

(()=>{ /* отрисовка настроек задачи */
    let taskData = {

    };

    colunmsContainer.addEventListener('click',()=>{
        if(!event.target.classList.contains('task__name')) return;
        else{
            var evTargetId = event.target.closest('.column-rows_task');
            taskData.id = evTargetId.id;
            taskEditor.style.cssText = "display:flex";
            xhr = new XMLHttpRequest();
            xhr.open('GET', '/task/' + evTargetId.id, false);
            xhr.send();
            let task = JSON.parse(xhr.responseText)[0][0];
           console.log(task);

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
    
    taskEditor.addEventListener('click',()=>{ /* перезапись данных текущий задчи */
        if(!event.target.classList.contains('send-data')) return;
        else{
            taskData.name = document.getElementById('task-editor_name').value;
            taskData.discription = document.getElementById('task-editor_discriotion').value;
            taskData.priority = document.getElementById('task-editor_priority').value;
            taskData.label = document.getElementById('task-editor_label').value;
            taskData.user = document.getElementById('task-editor_user').value;
            
            json = JSON.stringify(taskData);
            xhr = new XMLHttpRequest();
            xhr.open('PUT', 'update-task/', false);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(json);

            taskEditor.style.cssText = "display:none";
        
        }
    }) 
})();


(()=>{ /* При клике сквозь форму редактироания должна закрывать, но чт то не так */
    while(taskEditor.style.display == "flex"){
        board.addEventListener('click', ()=>{
            /* event.target.closest('board__task-editor') == taskEditor ? null : taskEditor.style.cssText = "display:none"; */
            console.log(event.target.tagName)
       })
    }
})();



(()=>{ /* Отрисовка задач */
    xhr = new XMLHttpRequest();
    xhr.open('GET', '/get-task/' + boarddata, false);
    xhr.send();

    json = JSON.parse(xhr.responseText)[0];
    console.log(json);
    filterTask1(json);
    filterTask2(json);
    filterTask3(json);
        
})();



function filterTask1(arr){

    columnToDo.status = "TO DO";
    columnToDo.users = {};
    todo = arr.filter((item)=>{ /* отфильтровал по колонкам */
        return item.newtask_status == columnToDo.status;
    })
    todo.forEach(element => { /* отфильтровал пользователей в колонке */
        var str = element.newtask_worker;
        columnToDo.users[str] = true;
    });
    for(key in columnToDo.users){

        let idRow = 'todo'+ key;
        createRows(key,idRow,columnToDo);
        var rowrow = document.getElementById('idRow');
        i = todo.filter((item)=>{ 
            return item.newtask_worker == key;
        });
        i.forEach(item=>{
           createTask(item.newtask_name, item.newtask_label, item.newtask_type, item.newtask_worker, item.newtask_status, item.newtask_priority, idRow, item.id_task) 
        })
        
    };
};

function filterTask2(arr){
    columnInProgress.status = "In progress";
    columnInProgress.users = {};
    inprogress = arr.filter((item)=>{ /* отфильтровал по колонкам */
        return item.newtask_status == columnInProgress.status;
    })
    inprogress.forEach(element => { /* отфильтровал пользователей в колонке */
        var str = element.newtask_worker;
        columnInProgress.users[str] = true;
    });
    for(key in columnInProgress.users){

        let idRow = 'inprogress'+key;
        createRows(key,idRow,columnInProgress);
        // let rowrow = document.getElementById('idRow');
        let i = inprogress.filter((item)=>{ 
            return item.newtask_worker == key;
        });
        i.forEach(item=>{
           createTask(item.newtask_name, item.newtask_label, item.newtask_type, item.newtask_worker, item.newtask_status, item.newtask_priority, idRow, item.id_task)
        })
        
    };
};

function filterTask3(arr){
    columnDone.status = "Done";
    columnDone.users = {};
    done = arr.filter((item)=>{ /* отфильтровал по колонкам */
        return item.newtask_status == columnDone.status;
    })
    done.forEach(element => { /* отфильтровал пользователей в колонке */
        var str = element.newtask_worker;
        columnDone.users[str] = true;
    });
    for(key in columnDone.users){

        let idRow = 'done'+key;
        createRows(key,idRow,columnDone);
        var rowrow = document.getElementById('idRow');
        i = done.filter((item)=>{ 
            return item.newtask_worker == key;
        });
        i.forEach(item=>{
           createTask(item.newtask_name, item.newtask_label, item.newtask_type, item.newtask_worker, item.newtask_status, item.newtask_priority, idRow, item.id_task)
        })
        
    };
};

function createTask(name, label, type, userIconContent, status, priority, parent, id_task){
    var rowrow = document.getElementById(parent);

    let task = document.createElement('div');    
    task.className = "column-rows_task";
    task.id = id_task;
    task.staus = status;

    let taskPriority = document.createElement('div'); /* Индикация приоритета */
    taskPriority.className = 'column-rows_task-priority';

    let taskBody = document.createElement('div'); /* тело задачи */
    taskBody.className = 'column-rows_task-body';

    switch(priority){
        case 'Высокий': taskPriority.style.background = '#eb5a46';break;
        case 'Средний' : taskPriority.style.background = '#ffab4a';break;
        case 'Низкий' : taskPriority.style.background = '#61bd4f';break;
    };

    let iconContant = userIconContent.split(' ').reduce(function(previousValue, currentValue){
        let a = previousValue.slice(0,1).toUpperCase();
        let b = currentValue.slice(0,1).toUpperCase();
        return a+b;
    });
   
   
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
            <div class="task__type">
                <span>Тип задачи:${type}</span>
            </div>
            <div class="task__user-icon">
                ${iconContant}
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



















