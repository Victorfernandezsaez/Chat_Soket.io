const socket = io();

const activity = document.querySelector('.activity');
const roomList = document.querySelector('.room-list');
const chatDisplay = document.querySelector('.chat-display');
const msgInput = document.querySelector('#message');
const nameInput = document.querySelector('#name');
const chatRoom = document.querySelector('#room');

function sendMessage(e) {
  e.preventDefault();
  if (nameInput.value && msgInput.value && chatRoom.value) {
    socket.emit('message', {
      name: nameInput.value,
      text: msgInput.value,
    });
    msgInput.value = '';
  }
  msgInput.focus();
}

function enterRoom(e) {
  e.preventDefault();
  if (nameInput.value && chatRoom.value) {
    socket.emit('enterRoom', {
      name: nameInput.value,
      room: chatRoom.value,
    });
  }
}

document.querySelector('.form-msg').addEventListener('submit', sendMessage);

document.querySelector('.form-join').addEventListener('submit', enterRoom);

msgInput.addEventListener('keypress', () => {
  socket.emit('activity', nameInput.value);
});

const roomHeader = document.createElement('div');
roomHeader.className = 'room-header';
document.querySelector('main').insertBefore(roomHeader, chatDisplay);

socket.on('roomHeader', ({ room, users }) => {
  roomHeader.textContent = `${room}`;
  showUsers(users);
});

// Listen for Messages from server
socket.on('message', (data) => {
  activity.textContent = '';

  const { name, text, time, color } = data;
  const li = document.createElement('li');
  li.className = 'post';

  if (name === nameInput.value) li.className = 'post post--right';
  if (name !== nameInput.value && name !== 'admin')
    li.className = 'post post--left';
  if (name !== 'Admin') {
    li.innerHTML = `<div class="post__header ${
      name === nameInput.value ? 'post__header--user' : 'post__header--reply'
    }">
        <span class="post__header--name ${color || ''} ">${name}</span>
        <span class="post__header--time">${time}</span>
        </div>
        <div class=""post__text">${text}</div>
    `;
  } else {
    li.innerHTML = `<div class=""post__text">${text}</div>`;
  }
  document.querySelector('.chat-display').appendChild(li);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

let activityTimer;
socket.on('activity', (name) => {
  activity.textContent = `${name} is typing...`;

  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => {
    activity.textContent = '';
  }, 2000);
});

function showUsers(users) {
  // Find or create users container
  let usersContainer = roomHeader.querySelector('.room-users');

  if (!usersContainer) {
    usersContainer = document.createElement('div');
    usersContainer.className = 'room-users';
    roomHeader.appendChild(usersContainer);
  }

  usersContainer.innerHTML = ''; // Clear existing

  if (users && users.length > 0) {
    // Add user names separated by commas
    usersContainer.textContent = users.map((user) => `${user.name}`).join(', ');
  }
}

socket.on('roomList', ({ rooms }) => {
  showRooms(rooms);
});

function showRooms(rooms) {
  roomList.textContent = '';
  if (rooms) {
    roomList.innerHTML = '<em>Active Rooms:</em>';
    rooms.forEach((room, i) => {
      roomList.textContent += ` ${room}`;
      if (rooms.length > 1 && i !== rooms.length - 1) {
        roomList.textContent += ',';
      }
    });
  }
}
