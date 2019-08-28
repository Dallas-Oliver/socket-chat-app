const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

class ChatMessageBase {
  constructor(username, message) {
    this.username = username;
    this.message = message;
    this.timestamp = Date.now();
  }
}

class ChatMessage extends ChatMessageBase {
  constructor(username, message) {
    super(username, message);
    this.messageType = "ChatMessage";
  }
}

class WelcomeChatMessage extends ChatMessageBase {
  constructor(username) {
    super(username, null);
    this.messageType = "WelcomeChatMessage";
  }
}

app.use("/chatroom", express.static("public/chatroom"));
app.use("/", express.static("public/login"));
app.use("/models", express.static("public/models"));

app.get("/login/:username", (req, res) => {
  const username = req.params.username;

  res.redirect(`/chatroom?username=${username}`);
});

app.get("/homepage", (req, res) => {
  res.redirect(`/`);
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
    socket.broadcast.emit("welcome msg", new WelcomeChatMessage(msg.username));
  });

  socket.on("chat message", data => {
    io.emit("chat message", new ChatMessage(data.username, data.message));
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
        `<li class='chat-msg'>another user <span style="color:${data.color}}" class='username'><strong>${data.username}</strong></span>: has diconnected</li>`
      );
    });
  });
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
