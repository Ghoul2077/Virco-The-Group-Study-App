require('dotenv').config();

const { initializeApp } = require("firebase/app");
const { getFirestore, doc, updateDoc, getDoc } = require("firebase/firestore");

const firebaseApp = initializeApp({ 
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_KEY,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});
const firestoreDB = getFirestore(firebaseApp);

const express = require("express");
var cors = require("cors");
const app = express();

app.use(cors());

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store users data as { room_name : { socket-id : username } }
const users = {};
// Store rooms data such as who is the admin of the room,
// { room_name: { host: username, hostSocketId: socketId } }
const rooms = {};
// Store messages of each room as { room_name: [{ sender, msg }] }
const messages = {};

const setHost = (roomName, username, id) => {
  if (rooms[roomName] === undefined) {
    rooms[roomName] = {};
  }
  rooms[roomName] = {
    host: username,
    hostSocketId: id,
  };
};

const cleanup = (roomName, roomId, socketId) => {
  // Delete the current user from the list and then broadcast new info to all clients
  if (users[roomName]) {
    delete users[roomName][socketId];
  }

  // If the deleted user was the current host then set a new random host and broadcast
  // it to every connected client
  if (users[roomName] && !Object.keys(users[roomName]).length) {
    delete users[roomName];
    delete rooms[roomName];

    if (messages[roomName] !== undefined) {
      const roomDataRef = doc(firestoreDB, "communities", roomId);
      updateDoc(roomDataRef, {
        messages: messages[roomName]
      });
    }

    delete messages[roomName];
  } else if (rooms[roomName]?.hostSocketId === socketId) {
    const newHostSocketId = Object.keys(users[roomName])[0];
    const newHostName = users[roomName][newHostSocketId];

    rooms[roomName].host = newHostName;
    rooms[roomName].hostSocketId = newHostSocketId;

    io.sockets.to(roomName).emit("newHost", { name: rooms[roomName].host, socketId: rooms[roomName].hostSocketId });
  }

  io.sockets
    .to(roomName)
    .emit("roomData", users[roomName] || []);
};

io.on("connection", (socket) => {
  const roomId = socket.handshake.query["roomId"];
  const roomName = "room-" + roomId;

  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomName);
    if (users[roomName] === undefined) {
      users[roomName] = {};
    }
    users[roomName][socket.id] = username;

    // If it is a new room then make the first user as the host
    if (rooms[roomName] === undefined) {
      setHost(roomName, username, socket.id);
    }

    if (messages[roomName] === undefined) {
      const roomDataRef = doc(firestoreDB, "communities", roomId);
      getDoc(roomDataRef).then((snapshot) => {
        const roomData = snapshot.data();
        messages[roomName] = roomData.messages ?? [];
        socket.emit("hydrateMessages", messages[roomName]);
      });
    } else {
      socket.emit("hydrateMessages", messages[roomName]);
    }

    // Every new joinee needs to know who the current host is
    socket.emit("newHost", { name: rooms[roomName].host, socketId: rooms[roomName].hostSocketId });

    // Tell all other clients that a new user has joined
    socket.broadcast.to(roomName).emit("newJoinee", username);

    // Broadcast all usernames to all the connected client
    io.sockets.to(roomName).emit("roomData", users[roomName]);
    console.log(users);
  });

  socket.on("makeHost", ({ socketId }) => {
    if(socketId) {
      const username = users[roomName][socketId];
      setHost(roomName, username, socketId);
      io.sockets.to(roomName).emit("newHost", { name: username, socketId: socketId });
    }
  });

  socket.on("sendMessage", ({ message }, callback) => {
    const senderUsername = users[roomName][socket.id];

    if (messages[roomName] === undefined) {
      messages[roomName] = [];
    }

    messages[roomName].push({
      sender: senderUsername,
      message,
    });
    io.sockets.to(roomName).emit("messagesBroadcast", messages[roomName].at(-1));

    if (callback) callback();
    console.log(messages[roomName]);
  });

  // This is called whenever the host pdf page number changes, this change is
  // then broadcasted to all other connected users
  socket.on("syncPages", ({ pageNumber, url }) => {
    if (rooms[roomName]?.hostSocketId === socket.id) {
      socket.broadcast.to(roomName).emit("syncPages", { pageNumber, url });
    }
  });

  socket.on("startVideo", () => {
    if (rooms[roomName]?.hostSocketId === socket.id) {
      socket.broadcast.to(roomName).emit("startVideo");
    }
  });

  socket.on("pauseVideo", () => {
    if (rooms[roomName]?.hostSocketId === socket.id) {
      socket.broadcast.to(roomName).emit("pauseVideo");
    }
  });

  socket.on("syncVideo", (seconds) => {
    if (rooms[roomName]?.hostSocketId === socket.id) {
      socket.broadcast
        .to(roomName)
        .emit("updateVideoProgressTime", seconds + 1);
    }
  });

  socket.on("leaveRoom", async (callback) => {
    cleanup(roomName, roomId, socket.id);
    if (callback) callback();
    console.log("Leaving room");
  });

  socket.on("disconnect", async () => {
    cleanup(roomName, roomId, socket.id);
    console.log("User disconnected");
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log("listening on *:4000");
});
