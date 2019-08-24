const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use("/chatroom", express.static("public/chatroom"));
app.use("/", express.static("public/login"));

app.get("/login/:username", (req, res) => {
  const username = req.params.username;

  res.redirect(`/chatroom?username=${username}`);
});

// app.get("/chatroom", (req, res) => {
//   const options = {
//     root: path.join(__dirname, "public/chatroom")
//   };
//   res.redirect("/chatroom", options);
// });

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
