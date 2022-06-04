const express = require('express');

const path = require('path');
const socket = require('socket.io');

const messages = [];
const users = [];

const app = express();
const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
const io = socket(server);

io.on('connection', socket => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('logged', user => {
    users.push({name: user, id: socket.id});
    console.log(`New user logged, name: ${user}, id: ${socket.id}`);
    socket.broadcast.emit('newUserLogged', user);
  });
  socket.on('message', message => {
    messages.push(message);
    socket.broadcast.emit('message', message);
    console.log("Oh, I've got message from " + socket.id);
  });
  socket.on('disconnect', user => {
    const index = users.findIndex(user => {
      return user.id === socket.id;
    });
    if (index !== -1) {
      socket.broadcast.emit('userLoggedOut', users[index].name);
      users.splice(index, 1);
    }
    console.log('Oh, socket ' + socket.id + ' has left');
  });
  console.log("I've added a listener on message event \n");
});

app.use(express.static(__dirname + '/client'));
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});
