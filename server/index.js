import express from 'express';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// solves the problem that __dirname creates using type:module in stead of commonjs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5500;
const ADMIN = 'Admin';

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/main.html'));
});

app.use(express.static(path.join(__dirname, '/public')));

const expressServer = app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}.`);
});

const userColorMap = new Map();
const colorClasses = [
  'user-color-1',
  'user-color-2',
  'user-color-3',
  'user-color-4',
  'user-color-5',
  'user-color-6',
  'user-color-7',
  'user-color-8',
  'user-color-9',
  'user-color-10',
];

// state (keeps the data until the server stop)
const UsersState = {
  users: [],

  /**
   * Updates the list of users in the state.
   * @param {string[]} newUsersArray
   * - An array of new user names to set in the state.
   */
  setUsers: function (newUsersArray) {
    this.users = newUsersArray;
  },
};

const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? false
        : ['http://localhost:5500', 'http://127.0.0.1:5500'],
  },
});

io.on('connection', (socket) => {
  console.log(`User: ${socket.id} connected.`);

  // msg only to user
  socket.emit('message', buildMsg(ADMIN, 'Welcome to HitMeUp App!'));

  socket.on('enterRoom', ({ name, room }) => {
    //leave previous room
    const prevRoom = getUser(socket.id)?.room;

    if (prevRoom) {
      socket.leave(prevRoom);
      io.to(prevRoom).emit(
        'message',
        buildMsg(ADMIN, `${name} has left the room`)
      );
    }

    const user = activateUser(socket.id, name, room);

    if (prevRoom) {
      io.to(prevRoom).emit('userList', { users: getUsersInRoom(prevRoom) });
    }

    socket.join(user.room);

    // recived by the user that joined
    socket.emit('roomHeader', { room: user.room });

    // msg to all but the user
    socket.broadcast
      .to(user.room)
      .emit('message', buildMsg(ADMIN, `${user.name} has join the room`));

    // update user list for room
    io.to(user.room).emit('userList', {
      users: getUsersInRoom(user.room),
    });

    // update tooms for everyone
    io.emit('roomList', {
      rooms: getAllActiveRooms(),
    });
  });

  // if user disconects  the rest recive
  socket.on('disconnect', () => {
    const user = getUser(socket.id);
    userLeavesApp(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        buildMsg(ADMIN, `${user.name} left the room`)
      );

      io.to(user.room).emit('userList', {
        users: getUsersInRoom(user.room),
      });

      io.emit('roomList', {
        rooms: getAllActiveRooms(),
      });
    }
  });

  // listening for msg
  socket.on('message', ({ name, text }) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      const color = name === ADMIN ? null : assignUserColor(name);
      io.to(room).emit('message', buildMsg(name, text, color));
    }
  });

  // listen for activity
  socket.on('activity', (name) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      socket.broadcast.to(room).emit('activity', name);
    }
  });
});

function buildMsg(name, text, color) {
  return {
    name,
    text,
    color,
    time: new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(new Date()),
  };
}

/**
 * Assigns a color class to a user based on the current size of the userColorMap.
 * @param {string} userName - The name of the user to wich we assign a color .
 * @returns {string} The assigned color class.
 */
function assignUserColor(userName) {
  if (userColorMap.has(userName)) {
    return userColorMap.get(userName);
  }

  const nextColor = colorClasses[userColorMap.size % colorClasses.length];
  userColorMap.set(userName, nextColor);
  return nextColor;
}

// user functions

/**
 * Activates a user by adding them to the state or updating their information.
 * @param {string} id - The unique ID of the user.
 * @param {string} name - The name of the user.
 * @param {string} room - The room the user is joining.
 * @returns {{ id: string, name: string, room: string }} The activated user object.
 */

function activateUser(id, name, room) {
  const user = {
    id,
    name,
    room,
  };
  UsersState.setUsers([
    ...UsersState.users.filter((user) => user.id !== id),
    user,
  ]);
  return user;
}

/**
 * Removes a user from the application state when they leave.
 * @param {string} id - The unique ID of the removed user.
 */
function userLeavesApp(id) {
  UsersState.setUsers(UsersState.users.filter((user) => user.id !== id));
}

/**
 * Call a user from the state by his unique ID.
 * @param {string} id - The unique ID of the user.
 * @returns {{ id: string, name: string, room: string } | undefined} The user object, or `undefined` if not found.
 */
function getUser(id) {
  return UsersState.users.find((user) => user.id === id);
}

/**
 * Call all users in a specific room.
 * @param {string} room - The name of the room to filter users by.
 * @returns {{ id: string, name: string, room: string }[]} An array of user objects in a specified room.
 */
function getUsersInRoom(room) {
  return UsersState.users.filter((user) => user.room === room);
}

/**
 * Gets all active rooms by collecting unique room names from the users in the state.
 * @return {string[]} An array of unique room names.
 */

function getAllActiveRooms() {
  // creating the Set we avoid getting duplicate rooms
  return Array.from(new Set(UsersState.users.map((user) => user.room)));
}
