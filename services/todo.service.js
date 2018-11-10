var fs = require('fs')
var todos = require('../data/todo.json')

function query() {
    return Promise.resolve(todos);
}
function getById(todoId) {
    const todo = todos.find(todo => todo.id === todoId)
    return Promise.resolve(todo);
}
function save(todoUpdated) {
    if (todoUpdated.id) {
        var idx = todos.findIndex(todo => todo.id === todoUpdated.id)
        todos.splice(idx, 1, todoUpdated)
    } else {
        todoUpdated.id = _makeid();
        todos.push(todoUpdated)
    }
    _saveTodosToFile();
    return Promise.resolve(todoUpdated)
}

function remove(id) {
    var idx = todos.findIndex(todo => todo.id === id)
    if (idx !== -1) {
        todos.splice(idx, 1);
        _saveTodosToFile();
        return Promise.resolve()
    } else return Promise.reject('Not found')
}

module.exports = {
    query,
    getById,
    save,
    remove
}

function _makeid(length = 5) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(var i=0; i < length; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

function _saveTodosToFile() {
    fs.writeFileSync('data/todo.json', JSON.stringify(todos, null, 2));
}

