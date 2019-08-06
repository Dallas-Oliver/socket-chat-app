var app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  console.log("Client connected.");

  socket.on("welcome msg", msg => {
    console.log(msg);
    socket.broadcast.emit("welcome msg", msg);
  });

  socket.on("chat message", msg => {
    socket.broadcast.emit("chat message", msg);
  });

  // Disconnect listener
  socket.on("disconnect", msg => {
    console.log("Client disconnected.");
    socket.broadcast.emit("disconnect msg", msg);
  });
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
