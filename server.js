var express = require('express');
var app = express();
var port = 5555;
app.use(express.static(__dirname));
app.set('view engine', 'ejs');

var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://postgres:admin@localhost:5433/kanban");

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


                            /* запросы с главной страницы */


app.get('/get-boards', (req,res)=>{ /* Запрос на получаение всех досок */
    db.multi('SELECT * FROM boards')
    .then(function (text) {        
        res.json(text);
    })  
});

app.get('/board/:id', (req,res)=>{
    res.render('board', {id : req.params.id});
});

app.get('/newtask', (req,res)=>{ /* Отрисовка создания задачи для доски */
    res.render('newtask');
});

app.delete('/delete-boards', (req,res)=>{ /* удаление досок */ 
    //console.log(req.body.name);

    db.none('DELETE FROM boards WHERE id = $1', req.body.id);     
    // console.log(req.body);
    // res.redirect('localhost:5555');
});

app.post('/board-name', (req,res)=>{ /* Добавление новых досок */
    db.none('INSERT INTO boards (board_name , date_creation) VALUES (${name}, ${dataCreate})', req.body);

    res.status(200).end();
});


                            /* Запросы со страницы добавления новой доски */


app.get('/newtask-name-data', (req,res)=>{ /* Запрос имен досок для создания выпадающего списка */
    db.multi('SELECT id, board_name FROM boards')
    .then(function (text){
        res.json(text)
    })
});


app.post('/newtask_data', (req,res)=>{
    console.log(req.body);

    db.none('INSERT INTO newtask_data (id_board, newtask_name, newtask_discription, newtask_priority, newtask_label, newtask_type, newtask_status )\
    VALUES (${idkeks}, ${name}, ${discription}, ${priority}, ${label}, ${type}, ${status})', req.body);

    res.status(200).end();
});


app.listen(port, () =>{
    console.log("РАБОТАЕТ ТИПО))))))")
});






