var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')

var app = express()
// Needed for express to handle our Form POST
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// Configure the Session
app.use(session({
    secret: 'puki muki',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))


var todoService = require('./services/todo.service');

// LIST of Todos
app.get('/todo', (req, res) => {
    todoService.query()
    .then(todos => {
         const lastVisitedTodoId = req.cookies.lastVisitedTodoId;
         const nickname = req.session.nickname;
         const data = { todos, lastVisitedTodoId, nickname };
         res.render('todos.ejs', data);
    }) 
 })

 // EDIT Todo
 app.get('/todo/edit/:id?', (req, res) => {
    const todoId = req.params.id;
    if (todoId) {
        todoService.getById(todoId)
        .then(todo => {
             const data = {todo};
             res.render('todo-edit.ejs', data);
        }) 
    } else {
        const data = {todo : {}};
        res.render('todo-edit.ejs', data);
    }
 })

 // Save Todo
 app.post('/todo/save', (req, res) => {
    const todo = req.body; 
    
    todoService.save(todo)
    .then(todo => {
         res.redirect('/todo');
    }) 
 })

 // GET by ID
 app.get('/todo/:id', (req, res) => {
    todoService.getById(req.params.id)
    .then(todo => {
        
         const data = { todo };
         res.cookie('lastVisitedTodoId', todo.id)
         res.render('todo.ejs', data);
    }) 
})

 // DELETE todo
 app.get('/todo/delete/:id', (req, res) => {
    todoService.remove(req.params.id)
    .then(_ => {
         res.redirect('/todo');
    }) 
 })

 app.get('/', (req, res) => {
    res.render('index.ejs');
 })

 app.post('/setUser', (req, res) => {
    req.session.nickname = req.body.nickname
    res.redirect('/todo');
 })


const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Server listening on port ${PORT}`)  
}); 

