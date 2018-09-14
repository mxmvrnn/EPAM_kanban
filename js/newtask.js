let newtask = document.getElementById('newtask'); /* Контейнер формы */

const getItem = selector => document.getElementById(selector);

let newtaskName = getItem('newtask__name'); /* Имя доски */
let newtaskDiscription = getItem('newtask__description');   /* Описание доски */
let newtaskPriority = getItem('newtask__priority'); /* Приоретет доски */
let newtaskLabel = getItem('newtask__label');   /* Метки для доски */
let newtaskWorker = getItem('newtask__worker'); /* Имя пользователя */
let newtaskType = getItem('newtask__type'); /* Тип доски */
let newtaskStatus = getItem('newtask__status'); /* Статус доски */
let newtaskDataSend = getItem('newtask__data-send'); /* Кнопка отправки данных */
let newtaskChoiсeBoard = document.createElement('div'); /* Выбор досок */



function createBorderList(){  /* создает выпадающий список из существующих досок */
    
    xhr = new XMLHttpRequest();
    xhr.open('GET', '/newtask-name-data', false);
    xhr.send();
    let dataBoardName = JSON.parse(xhr.responseText)[0];
    
    newtaskChoiсeBoard.id = 'newtask__boards-menu';
    newtaskChoiсeBoard.innerHTML = `
    <label>Выберите доску</label>
    <select >
    </select>
    `
    newtaskDataSend.before(newtaskChoiсeBoard);
    
    dataBoardName.forEach(item  =>  {
        let option = document.createElement('option');
        option.id = item.id;
        option.innerHTML = item.board_name;
        newtaskChoiсeBoard.childNodes[3].appendChild(option);
    });

    console.log(dataBoardName);

};

function sendData(){ /* Собирает информацию с полей формы и собсна отправляет на сервер*/

    let newtaskData = {};

    newtaskDataSend.addEventListener('click', () => {
        
        newtaskData.discription = newtaskDiscription.value;
        newtaskData.choiсeBoard = newtaskChoiсeBoard.childNodes[3].value;
        newtaskData.priority = newtaskPriority.childNodes[3].value;
        newtaskData.status = newtaskStatus.childNodes[3].value;
        newtaskData.worker = newtaskWorker.childNodes[3].value;
        newtaskData.idkeks = newtaskChoiсeBoard.childNodes[3][newtaskChoiсeBoard.childNodes[3].selectedIndex].id;
        newtaskData.label = newtaskLabel.childNodes[3].value;
        newtaskData.name = newtaskName.value;
        newtaskData.type = newtaskType.childNodes[3].value;
        

        xhr = new XMLHttpRequest();
        xhr.open('POST','/newtask_data', false);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify(newtaskData));


        location.href = '/';
    })

};

function init(){
    createBorderList();
    sendData();
}; init();