let mainContainer = document.getElementById('app__main-boards-container');//Не знаю что сюда написать, эта штука для всего содержимого
let boardAddForm = document.getElementById('app__board-add-form'); //Форма добавления досок

let containerBoards = document.getElementById('main-boards-container__bords');//Контейнер с досками
let containerNavBar = document.getElementById('main-boards-container__navbar');//Небольшая навигация, создание досок и задач


function createBoards(id,name,dataCreate,dataChange){ /* Функция которая создает новые доски на гглавной странцие */
    let board = document.createElement('div');
    board.className = 'board';
    board.id = 'board_'+id;
    board.innerHTML = `
        <div class="board__name-container">
            <span class="name-container__name">${name}</span>
        </div>
        <div class="board__date">
            <span class="board__date-create">Дата создания : ${dataCreate}</span>
            <span class="board__dste-change"> Дата последнего редактирования : заглушка</span>
        </div>
        <div class="board__setbar">
            <i class="board-settings fas fa-cog"></i>
            <i class="fas fa-trash-alt"></i>
        </div> 
    `;
    containerBoards.append(board);
};
    
function fetchBoards(){ /* подгружает новые доски на страницу с БД */
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/get-boards', false);
    xhr.send(); 
    // console.log(xhr.responseText);
    let dataBoard = JSON.parse(xhr.responseText)[0];
    
    dataBoard.forEach((item) => {
        let {id, board_name, date_creation, date_change} = item;
        createBoards(id, board_name, date_creation, date_change);
    })
    
};

function goToBoard(){ /* переход непосредственно на доску  */
    
    containerBoards.addEventListener('click', () => {
        if (!event.target.classList.contains('name-container__name')) return;
        else{
            let path ='/board/' + event.target.closest('.board').id.slice(-2);
            location.href = path;
        }
    })

};

function goToSettings(){ /* переход на настройки доски  */
    
    containerBoards.addEventListener('click', () => {
        if (!event.target.classList.contains('board-settings')) return;
        else{
            let path ='/settings/' + event.target.closest('.board').id.slice(-2);
            location.href = path;
            let now = new Date();
            let date = now.getDate() + '.' +now.getMonth() + '.' +now.getFullYear();
        }
    })

};

function deleteBoard(){ /* Функция удаления досок с главной страницы */
    containerBoards.addEventListener('click',() => {
        if (!event.target.classList.contains('fa-trash-alt')) return;
        else {
            let valueId = event.target.closest('.board').id.slice(-2);

            xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/delete-boards', false);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(JSON.stringify({id:valueId}));
        }
    })
};

function createTask(){ /* Функция создания новой задачи на доску */
    var task = document.getElementById('navbar__add-task');
    task.addEventListener('click', () => {
        location.href = '/newtask';
    })
};

function openAddForm(){     //Открытите формы добавления новых досок
    let boardName = document.getElementById('board-add-form__board-name');
    let createBoard = document.getElementById('navbar__add-board');
    let sendData= document.getElementById('board-add-form__create-board');

    createBoard.addEventListener('click', () => { 
        boardAddForm.style.display = 'flex';
        mainContainer.style.display = 'none';
        
    });

    sendData.addEventListener("click", () => { //этот ивент собирает данные с инпута и отсылает его на сервер
        let now = new Date();
        let date = now.getDate() + '.' +now.getMonth() + '.' +now.getFullYear();
        let dataBoard = {};

        dataBoard.id = null;
        dataBoard.name = boardName.value;
        dataBoard.dataCreate = date;
        dataBoard.dataChange = null;

        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/board-name', false);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify(dataBoard));
        // alert(xhr.status);
        location.href = '/';
     
        boardAddForm.style.display = 'none';
        mainContainer.style.display = 'flex';
    });

};

function init(){
    fetchBoards();
    openAddForm();
    createTask();;
    deleteBoard();
    goToBoard();
    goToSettings();
};
init();
