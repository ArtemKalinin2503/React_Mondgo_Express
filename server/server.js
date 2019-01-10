//Подключим mongoose для работы с MongoDb (npm install mongoose --save)
var mongoose = require('mongoose');
//Подключим express
var express = require('express');  //npm i express (сервер)
var cors = require('cors'); //npm i cors (для кроссдоменных запросов)
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

{/*Работа с Mongoose*/}

//Вызов сервера express
var app = express();
//Используем cors для кроссдоменных запросов
app.use(cors());

//Установим соединение с БД
setUpConnection();

//Преобразуем данные из БД в Json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Создадим схему данных
const Schema = mongoose.Schema; 

//Опишем схему данных
const NoteSchema = new Schema({
    title: {type: String},
    description: {type: String}
});

//Создадим модель данных и передадим туда схему
const Note = mongoose.model('Note', NoteSchema);

//Передадим модель
const Notes = mongoose.model('Note');

//Создадим подключение к БД (notes - имя БД)
function setUpConnection() {
    mongoose.connect('mongodb://localhost/notes', {useNewUrlParser:true}, function (err) {
        if (err) throw err;
        console.log ('Successfully connected!!!');
    });
};

{/*--Опишем методы для работы с БД--*/}

//Создадим метод к БД (метод find выведит все данные из БД)
function listNotes() {
    return Notes.find();
};

//Создадим метод который будет создавать новую заметку (именно в данные состояния title и description будут приходить данные)
function createNote(data) {
    const note = new Notes({
        title: data.title,
        description: data.description
    });
    return note.save();
};

//Создадим метод который будет удалять записи из БД
function deleteNote(id) {
    return Notes.findById(id).remove();
};

{/*--Опишем основные запросы к БД--*/}

//Метод post будет создавать записи в БД
app.post('/notes', (req, res) => {
    //Вызовим запрос createNote
    createNote(req.body).then(data => res.send(data));  
});

//Метод get будет вывводить данные из БД
app.get('/notes', (req, res) => {
    //Вызовим запрос listNotes
    listNotes().then(data => res.send(data));
});

//Метод delete будет удалять данные из БД
app.delete('/notes/:id', (req, res) => {
    //Вызовим звпрос deleteNote
    deleteNote(req.params.id).then(data => res.send(data));
});

//Подключим mongodb где notes - это имя БД
MongoClient.connect('mongodb://localhost:27017', function (err, client) {
    if (err) {
        return console.log(err);
    }
    db = client.db("notes");
    //Старт сервера только после запуска базы данных
    app.listen(3012, function() {
        console.log('Api app started')
    });
});

//Команда для запуска mongodb mongod (в отдельной вкладке после запуска сервера)
//Команда для запуска сервера node server.js
//Ссылка на проект http://localhost:3012/notes
