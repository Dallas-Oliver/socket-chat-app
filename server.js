const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");

app.use(express.static(path.join(__dirname, "public/login/login-styles.css")));

app.use("/public", (req, res) => {
  res.sendFile(path.join((__dirname, "/login/login.html")));
});

io.on("connection", function(socket) {
  console.log("Client connected.");

  socket.on("welcome msg", msg => {
    socket.broadcast.emit("welcome msg", msg);
  });

  socket.on("chat message", data => {
    io.emit(
      "chat message",
      `<li class='chat-msg'><span style="color:${
        data.color
      }}" class='username'><strong>${data.username}</strong></span>: ${
        data.value
      }</li>`
    );
  });

  socket.on("image", data => {
    io.emit("image", data);
  });

  // Disconnect listener
  socket.on("disconnect", () => {
    console.log("Client disconnected.");
    io.on("disconnect msg", data => {
      console.log(data);
      io.emit(
        "disconnect msg",
        `<li class='chat-msg'>another user <span style="color:${
          data.color
        }}" class='username'><strong>${
          data.username
        }</strong></span>: has diconnected</li>`
      );
    });
  });
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
