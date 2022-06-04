const loginForm = document.querySelector('#welcome-form');
const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');

//config
const chatbotName = 'ChatBot';
let userName = '';

const socket = io();

// nasluchiwacze
socket.on('message', ({author, content}) => addMessage(author, content));
socket.on('newUserLogged', userName => addMessage(chatbotName, userName + ' has joined the conversation!'));
socket.on('userLoggedOut', userName => addMessage(chatbotName, userName + ' has left the conversation!'));

const login = e => {
  e.preventDefault();
  if (!userNameInput.value) {
    alert("Name can't be empty");
  } else {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('logged', userName);
  }
};

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  author === userName && message.classList.add('message--self');
  author === chatbotName && message.classList.add('message--bot');
  message.innerHTML = `
  <h3 class="message__author">${userName === author ? 'You' : author}</h3>
  <div class="message__content">${content}</div>`;
  messagesList.appendChild(message);
};

const sendMessage = e => {
  e.preventDefault();
  let messageContent = messageContentInput.value;
  if (!messageContent.length) {
    alert("Message can't be empty");
  } else {
    addMessage(userName, messageContent);
    socket.emit('message', {author: userName, content: messageContent});
    messageContentInput.value = '';
  }
};

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);
