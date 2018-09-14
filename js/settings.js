let boarddata = document.getElementById('board-data').innerHTML; /* Очень важная штука!!!!! */
let colunmsContainer = document.getElementById('board__container-columns');
let boardContant = document.getElementById('board__content');


let columnToDo = document.getElementsByClassName('column TO DO')[0];
let columnInProgress = document.getElementsByClassName('column In progress')[0];
let columnDone = document.getElementsByClassName('column Done')[0];

let taskEditor = document.getElementById('board__task-editor');
let board = document.getElementById('board');

let path =  `/get-task/${boarddata}`;

const getItem = selector => document.getElementById(selector);

function filterTask(){ /* Отрисовка задач */ 
    xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send();

    json = JSON.parse(xhr.responseText)[0];
    console.log(json);
    renderTask(json,columnToDo,  'TO DO', 'todo');
    renderTask(json, columnInProgress, 'In progress', 'inprogress' );
    renderTask(json,columnDone, 'Done', 'done' );
};

function renderTask(arr, parent,  status, idPrefics){ 

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
           createTask(item.newtask_name, item.newtask_label, item.newtask_type, item.newtask_worker, item.newtask_status, item.newtask_priority, idRow, item.id_task) 
        })
        
    };
};

function createTask(name, label, type, userIconContent, status, priority, parent, id_task){
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
                <span class="label-value">Метки: ${label}</span>
            </div>
            <div class="task__type">
                <span class="type-value">Тип задачи:${type}</span>
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

function createColumn(name){
    let column = document.createElement('div');
    column.innerHTML=`
        <div class="column ${name}"> 
            <div class="column-name">
                <span class="status">${name}</span>
            </div>
                <div class="column-rows">
            </div>
        </div>
    `
    colunmsContainer.append(column);
};

function addColumn(){
    let navbar = getItem('board__navbar');
    let addForm = getItem('board__add-colunm-form');
    let colunmName = getItem('add-colunm-form__column-name');
    let addButton = getItem('add-colunm-form__create-form__column');
    let addFilterForm = getItem('board__add-filter-form');
    let openForm = getItem('navbar__add-column');

    /* окрыть форму */
    openForm.addEventListener('click', () => {
        
        addForm.style.display = 'flex';
        boardContant.style.display = 'none';
        navbar.style.display = 'none';
        addFilterForm.style.display = 'none';        
    });

    /* добавить колонку */
    addButton.addEventListener('click', () =>{ 
        
        addForm.style.display = 'none';
        boardContant.style.display = 'flex';
        navbar.style.display = 'flex';
        addFilterForm.style.display = 'none';

        createColumn(colunmName.value);
    });
};
// function createFilter(filter)

function addFilter(){
    
    let navbar = getItem('board__navbar');
    let addForm = getItem('board__add-filter-form');
    let addButton = getItem('add-filter-form__create-filter');
    let addColumnForm = getItem('board__add-colunm-form');
    let openForm = getItem('board__add-filter-formr');
    let choiceFilter = getItem('choice-filter');

    /* окрыть форму */
    openForm.addEventListener('click', () => { /* открыть форму */
        
            addForm.style.display = 'flex';
            boardContant.style.display = 'none';
            navbar.style.display = 'none';
            addColumnForm.style.display = 'none';        
    });

    choiceFilter.addEventListener('change', (event) => {
    
        let selectValue = event.target.value;
        console.log(selectValue);
        renderSubFilter(selectValue);
    })

    
};

function renderSubFilter(filter){
    
    let navbar = getItem('board__navbar');
    let addForm = getItem('board__add-filter-form');
    let addButton = getItem('add-filter-form__create-filter');
    let addColumnForm = getItem('board__add-colunm-form');
    let openForm = getItem('board__add-filter-formr');
    let choiceFilter = getItem('choice-filter');
    subFIlter = getItem('sub-fIlter');

    const stopEvent = elem => elem.setAttribute("disabled", "disabled") ;
    stopEvent(choiceFilter);    

    switch(filter){
        case 'Имя': subFIlter.innerHTML = `<input type="text" placeholder="Введите имя">`; break;

        case 'Статус': subFIlter.innerHTML = `
                <select>
                <option selected">Выберите из списка</option>
                    <option value="TO DO">TO DO</option>
                    <option value="In progress">In progress</option>
                    <option value="Done">Done</option>
                </select>`; break;

        case 'Приоритет': subFIlter.innerHTML = `
                <select>
                    <option selected">Выберите из списка</option>
                    <option value="Высокий">Высокий</option>
                    <option value="Средний">Средний</option>
                    <option value="Низкий">Низкий</option>
                </select>`; break;

        case 'Метка': subFIlter.innerHTML = `<input type="text" placeholder="Введите название метки">`; break;

        case 'Тип': subFIlter.innerHTML = `
                <select>
                    <option selected">Выберите из списка</option>
                    <option value="Дефект">Дефект</option> 
                    <option value="Фича">Фича</option>
                    <option value="Баг">Баг</option>
                    <option value="Доработка">Доработка</option>
                </select>`; break;

        default :break;
    };
    
    // addButton.before(subFIlter);

    subFIlter.addEventListener('change', (event) => {
        console.log( event.target.value );
        let filterValue = event.target.value;
        pushFilter(filterValue, filter);
    })
}

function pushFilter(filterValue, typeFilter){
    
    let navbar = getItem('board__navbar');
    let addForm = getItem('board__add-filter-form');
    let addButton = getItem('add-filter-form__create-filter');
    let addColumnForm = getItem('board__add-colunm-form');
    let openForm = getItem('board__add-filter-formr');
    let choiceFilter = getItem('choice-filter');
    let filterContainer = getItem('filter-container');


    let filter = document.createElement('span');
    filter.className = 'filters'
    filter.innerHTML = filterValue;
    filter.setAttribute('type', typeFilter);
    

    addButton.addEventListener('click', () =>{ 
        
        let subFIlter = getItem('sub-fIlter');

        addForm.style.display = 'none';
        boardContant.style.display = 'flex';
        navbar.style.display = 'flex';
        addColumnForm.style.display = 'none'; 

        filterContainer.append(filter);
        choiceFilter.removeAttribute("disabled", "disabled");        
        
        // filter.setAttribute('name', subFIlter.firstElementChild.value);
        subFIlter.innerHTML = '';

    });
}

function removeFilter(){
    delButton = document.getElementById('board__remove-filter');
    filters = document.getElementsByClassName('filters');

    delButton.addEventListener('click', () => {
        for (let i = 0 ; i < filters.length; i++){
            filters[i].innerHTML += ' <i style="color:#54c7c3" class="fas fa-trash-alt"></i>';
            filters[i].addEventListener('click', (e) => {
                if ( !e.target.classList.contains('fa-trash-alt')){
                    return null
                } else{
                    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
                }
            })
        };
    })
}

function contentFiltering(){
    filterContainer = getItem('filter-container');
    filterContainer.addEventListener('click', (e) => {
        if ( !e.target.classList.contains('filters') ){
            return null
        } else{
            findFiltrationElem(e.target)
            console.log(e.target.innerHTML)
        }
    })
} ;

function findFiltrationElem(elem){
    const getClassElem = selector => document.getElementsByClassName(selector);
    const checkAttrbute = e => e.getAttribute('type')
    let filteringElem;
 
    switch(checkAttrbute(elem)){
        case 'Имя': filteringElem = getClassElem('task-name') ;break;
        case 'Статус': filteringElem = getClassElem('status') ;break;
        case 'Приоритет': filteringElem = getClassElem('column-rows_task-priority') ;break;
        case 'Метка': filteringElem = getClassElem('label-value') ;break;
        case 'Тип': filteringElem = getClassElem('type-value') ;break;
        default:break;
        }
    for (var i = 0 ; i <filteringElem.length ; i++  ){
       if ( filteringElem[i].innerHTML.indexOf(elem.innerHTML)){
        filteringElem[i].style.cssText = "border: 1px solid red; border-radius: 5px; padding:5px;"
       }
    }
 };



function init(){
    contentFiltering();
    removeFilter()
    addColumn();
    addFilter();
    filterTask();
}; init();

















