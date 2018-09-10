var newtask = document.getElementById('newtask'); /* Контейнер формы */

var newtaskName = document.getElementById('newtask__name'); /* Имя доски */
var newtaskDiscription = document.getElementById('newtask__description');   /* Описание доски */
var newtaskPriority = document.getElementById('newtask__priority').childNodes[3]; /* Приоретет доски */
var newtaskLabel = document.getElementById('newtask__label').childNodes[3];   /* Метки для доски */
var newtaskWorker = document.getElementById('newtask__worker').childNodes[3]; /* Тип доски */
var newtaskType = document.getElementById('newtask__type').childNodes[3]; /* Тип доски */
var newtaskStatus = document.getElementById('newtask__status').childNodes[3] /* Статус доски */
var newtaskDataSend = document.getElementById('newtask__data-send'); /* Кнопка отправки данных */
var newtaskChoiсeBoard = document.createElement('div'); /* Выбор досок */



(()=>{  /* создает выпадающий список из существующих досок */
    
    xhr = new XMLHttpRequest();
    xhr.open('GET', '/newtask-name-data', false);
    xhr.send();
    var dataBoardName = JSON.parse(xhr.responseText)[0];
    
    newtaskChoiсeBoard.id = 'newtask__boards-menu';
    newtaskChoiсeBoard.innerHTML = `
    <label>Выберите доску</label>
    <select >
    </select>
    `
    newtaskDataSend.before(newtaskChoiсeBoard);
    
    dataBoardName.forEach(item => {
        let option = document.createElement('option');
        option.id = item.id;
        option.innerHTML = item.board_name;
        newtaskChoiсeBoard.childNodes[3].appendChild(option);
    });

    console.log(dataBoardName);

})();

(()=>{ /* Собирает информацию с полей формы и собсна отправляет на сервер*/

    var newtaskData = {};

    newtaskDataSend.addEventListener('click', ()=>{
        
        newtaskData.discription = newtaskDiscription.value;
        newtaskData.choiсeBoard = newtaskChoiсeBoard.childNodes[3].value;
        newtaskData.priority = newtaskPriority.value;
        newtaskData.status = newtaskStatus.value;
        newtaskData.worker = newtaskWorker.value;
        newtaskData.idkeks = newtaskChoiсeBoard.childNodes[3][newtaskChoiсeBoard.childNodes[3].selectedIndex].id;
        newtaskData.label = newtaskLabel.value;
        newtaskData.name = newtaskName.value;
        newtaskData.type = newtaskType.value;
        

        xhr = new XMLHttpRequest();
        xhr.open('POST','/newtask_data', false);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify(newtaskData));


        location.href = '/';
    })

})();