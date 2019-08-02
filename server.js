var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(3000);
// WARNING: app.listen(80) will NOT work here!

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");

  if (req.url.indexOf(".html") != -1) {
    //req.url has the pathname, check if it conatins '.html'

    fs.readFile(__dirname + "/public/index.html", function(err, data) {
      if (err) console.log(err);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    });
  }

  if (req.url.indexOf(".js") != -1) {
    //req.url has the pathname, check if it conatins '.js'

    fs.readFile(__dirname + "/public/index.js", function(err, data) {
      if (err) console.log(err);
      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.write(data);
      res.end();
    });
  }
  if (req.url.indexOf(".css") != -1) {
    //req.url has the pathname, check if it conatins '.css'

    fs.readFile(__dirname + "/public/styles.css", function(err, data) {
      if (err) console.log(err);
      res.writeHead(200, { "Content-Type": "text/css" });
      res.write(data);
      res.end();
    });
  }
});

io.on("connection", function(socket) {
  socket.emit("news", { hello: "world" });
  socket.on("my other event", function(data) {
    console.log(data);
  });
});
