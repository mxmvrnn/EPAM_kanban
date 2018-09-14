let express = require('express');
let app = express();
let port = 5555;
app.use(express.static(__dirname));
app.set('view engine', 'ejs');

let pgp = require("pg-promise")(/*options*/);
let db = pgp("postgres://postgres:admin@localhost:5433/kanban");

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


                            /* запросы с главной страницы */


app.get('/get-boards', (req,res) => { /* Запрос на получаение всех досок */
    db.multi('SELECT * FROM boards')
    .then(function (text) {        
        res.json(text);
    })  
});


app.get('/settings/:id', (req,res) => { /* динамическая отрисовка страницы с доской */
    res.render('settings', {id : req.params.id});
});

app.get('/board/:id', (req,res) => { /* динамическая отрисовка страницы с доской */
    res.render('board', {id : req.params.id});
});

app.get('/newtask', (req,res) => { /* Отрисовка создания задачи для доски */
    res.render('newtask');
});

app.delete('/delete-boards', (req,res) => { /* удаление досок */ 
    db.none('DELETE FROM boards WHERE id = $1', req.body.id);  
});

app.post('/board-name', (req,res) => { /* Добавление новых досок */
    db.none('INSERT INTO boards (board_name , date_creation) VALUES (${name}, ${dataCreate})', req.body);
    res.status(200).end();
});


                            /* Запросы со страницы добавления новой доски */


app.get('/newtask-name-data', (req,res) => { /* Запрос имен досок для создания выпадающего списка */
    db.multi('SELECT id, board_name FROM boards')
    .then(function (text){
        res.json(text)
    })
});


app.post('/newtask_data', (req,res) => {
    console.log(req.body);

    db.none('INSERT INTO newtask_data (id_board, newtask_name, newtask_discription, newtask_priority, newtask_label, newtask_worker,  newtask_type, newtask_status )\
    VALUES (${idkeks}, ${name}, ${discription}, ${priority}, ${label}, ${worker}, ${type}, ${status})', req.body);

    res.status(200).end();
});

                            /* Запросы со страницы доски */

app.get('/get-task/:id', (req,res) => { /* запрос на задчи, относящиеся к данной доске */
    // db.multi('SELECT * FROM newtask_data')
    db.multi('SELECT * FROM newtask_data WHERE id_board = $1 ', req.params.id)
    .then(function (text){
        res.json(text)
    })
})

app.get('/task/:id', (req,res) => { /* запрос на задачу отнросящуюся к доске */
    db.multi('SELECT * FROM newtask_data WHERE id_task = $1 ', req.params.id)
    .then(function (text){
        res.json(text)
    })
})

app.put('update-task/', (req,res) => { /* Ну типо фиксить данные в задаче, но что то не идет пока */
    db.map('UPDATE newtask_data SET newtask_name = ${name} WHERE id_task = ${id}', req.body);
})

app.listen(port, () => {
    console.log("РАБОТАЕТ ТИПО))))))")
});






