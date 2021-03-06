const port = process.env.REACT_APP_SOCKET_PORT || 8900;
const io = require('socket.io')(port, {
  cors: {
    origin: "*"
  }
})

let users = [];

const addUser = (userId, socketId) => {
  !users.some(user => user.userId === userId) &&
    users.push({ userId, socketId });
}

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
  return users.find(user => user.userId === userId);
}

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("addUser", userId => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);

    console.log(user)

    if (user?.socketId) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text
      })
    }
  })

  socket.on("disconnect", () => {
    console.log("User disconnected")
    removeUser(socket.id);
    io.emit("getUsers", users);
  })
})