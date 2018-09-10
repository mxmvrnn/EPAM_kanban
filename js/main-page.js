var mainContainer = document.getElementById('app__main-boards-container');//Не знаю что сюда написать, эта штука для всего содержимого
var boardAddForm = document.getElementById('app__board-add-form'); //Форма добавления досок

var containerBoards = document.getElementById('main-boards-container__bords');//Контейнер с досками
var containerNavBar = document.getElementById('main-boards-container__navbar');//Небольшая навигация, создание досок и задач


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
    
(()=>{ /* подгружает новые доски на страницу с БД */
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/get-boards', false);
    xhr.send(); 
    // console.log(xhr.responseText);
    var dataBoard = JSON.parse(xhr.responseText);
    
    for (var i = 0 ; i < dataBoard[0].length ; i++) {
        let {id, board_name, date_creation, date_change} = dataBoard[0][i];
        createBoards(id, board_name, date_creation, date_change);
    }
    
})();

(()=>{ /* переход непосредственно на доску  */
    
    containerBoards.addEventListener('click', ()=>{
        if (!event.target.classList.contains('name-container__name')) return;
        else{
            let path ='/board/' + event.target.closest('.board').id.slice(-2);
            location.href = path;
        }
    })

})();

(()=>{ /* переход непосредственно на доску  */
    
    containerBoards.addEventListener('click', ()=>{
        if (!event.target.classList.contains('board-settings')) return;
        else{
            let path ='/settings/' + event.target.closest('.board').id.slice(-2);
            location.href = path;
        }
    })

})();

/* (()=>{
    containerBoards.addEventListener('click',()=>{
        if (!event.target.classList.contains('board-settings')) return;
        else {
            let valueId = event.target.closest('.board').id.slice(-2);
            let path ='/board/' + valueId + '/settings';
            location.href = path;

            console.log(path)            
        }
    })
})(); */

(()=>{ /* Функция удаления досок с главной страницы */
    containerBoards.addEventListener('click',()=>{
        if (!event.target.classList.contains('fa-trash-alt')) return;
        else {
            let valueId = event.target.closest('.board').id.slice(-2);

            xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/delete-boards', false);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(JSON.stringify({id:valueId}));
            /* console.log(id)ж */
        }
    })
})();

(()=>{ /* Функция создания новой задачи на доску */
    var createTask = document.getElementById('navbar__add-task');
    createTask.addEventListener('click', ()=>{
        location.href = '/newtask';
    })
})();

(function openAddForm(){     //Открытите формы добавления новых досок
    let boardName = document.getElementById('board-add-form__board-name');
    let createBoard = document.getElementById('navbar__add-board');
    let sendData= document.getElementById('board-add-form__create-board');
    

    

    createBoard.addEventListener('click', ()=>{ 
        boardAddForm.style.display = 'flex';
        mainContainer.style.display = 'none';
        
    });

    sendData.addEventListener("click", ()=>{ //этот ивент собирает данные с инпута и отсылает его на сервер
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

})();



