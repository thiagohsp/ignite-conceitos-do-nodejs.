const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

// const users = { 
// 	id: 'uuid', // precisa ser um uuid
// 	name: 'Danilo Vieira', 
// 	username: 'danilo', 
// 	todos: []
// };

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return response.status(400).json({ error: 'User not found!'})
  }
  
  request.headers.user = user;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body
  const userAlreadyExists = users.some((item) => item.username === username);
  
  if (userAlreadyExists) {
    return response.status(400).json({ error: 'User already exists!'})
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  } 

  users.push(user);

  return response.status(201).json(user)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request.headers;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request.headers;

  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request.headers;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todoIndex = user.todos.findIndex((item) => item.id === id);

  if (todoIndex < 0) {
    return response.status(404).json({ error: 'To-do not found'})
  }

  let todo = user.todos[todoIndex];
  
  todo = {
    ...todo,
    title,
    deadline: new Date(deadline)
  }

  user.todos[todoIndex] = todo

  return response.status(201).json(todo)
    
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request.headers;
  const { id } = request.params;
  
  const todoIndex = user.todos.findIndex((item) => item.id === id);

  if (todoIndex < 0) {
    return response.status(404).json({ error: 'To-do not found'})
  }

  user.todos[todoIndex].done = true;
  
  return response.status(201).json(user.todos[todoIndex])
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request.headers;
  const { id } = request.params;
  
  const todo = user.todos.find((item) => item.id === id);

  if (!todo) {
    return response.status(404).json({ error: 'To-Do not found!'})
  }

  user.todos.splice(todo, 1);

  return response.status(204).send()
});

module.exports = app;