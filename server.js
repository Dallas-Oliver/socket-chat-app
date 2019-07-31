const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
io.on("connection", () => {
  console.log("socket connection established");
});

app.use(express.static("public"));

server.listen(3000, () => {
  console.log("listening on port 3000");
});
