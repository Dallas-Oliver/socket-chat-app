const chatBox = document.getElementById("chat-box");
const msgStream = document.getElementById("msg-stream");
const sendButton = document.getElementById("send-msg");
const captureButton = document.getElementById("capture-img");

const socket = io.connect();

let username;
let usernameColor;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: false
  })
  .then(localMediaStream => {
    video.srcObject = localMediaStream;
    video.play();
  })
  .catch(err => {
    console.error(err);
  });

function captureImage() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.height = 150;
  canvas.width = 200;
  const image = ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const base64Img = canvas.toDataURL(image);

  console.log(usernameColor);

  const imageDetails = {
    username: username,
    color: usernameColor,
    image: base64Img
  };

  socket.emit("image", imageDetails);
}

function randomColorForUsername() {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);

  const color = `rgb(${r}, ${g}, ${b});`;
  return color;
}

function randomUsername() {
  adjectives = [
    "ecstatic",
    "bouncy",
    "tall",
    "quiet",
    "scary",
    "flippant",
    "excitable",
    "friendly",
    "fearful"
  ];
  animals = [
    "aardvark",
    "baboon",
    "badger",
    "camel",
    "eagle",
    "clam",
    "penguin",
    "falcon",
    "gecko",
    "hedgehog"
  ];
  let adj = adjectives[Math.floor(Math.random() * adjectives.length)];

  let animal = animals[Math.floor(Math.random() * animals.length)];

  return `${adj}_${animal}`;
}

function sendMessage() {
  const chatAttributes = {
    username: username,
    color: usernameColor,
    value: chatBox.value
  };
  socket.emit("chat message", chatAttributes);

  chatBox.value = "";
}

function createChatMessage(message) {
  const li = document.createElement("li");
  li.innerHTML = message;
  msgStream.append(li);
}

socket.on("connect", () => {
  usernameColor = randomColorForUsername();
  const params = new URLSearchParams(window.location.search);
  usernameParam = params.get("username");
  console.log(usernameParam);

  if (usernameParam === null) {
    username = randomUsername();
    createChatMessage(
      `<li class='chat-msg'>Welcome to the chat room!<br/> you've been given a temporary username: <span style="color:${usernameColor}}" class='username'><strong>${username}</strong></span>`
    );
    console.log("random name used");
  } else if (usernameParam !== null) {
    if (!sessionStorage.getItem("username")) {
      sessionStorage.setItem("username", usernameParam);
      username = usernameParam;
      createChatMessage(
        `<li class='chat-msg'>Welcome to the chat room <span style="color:${usernameColor}}" class='username'><strong>${username}</strong></span>!<br/>`
      );
      console.log(
        "new local username created and used",
        sessionStorage.getItem("username")
      );
    } else if (sessionStorage.getItem("username")) {
      username = sessionStorage.getItem("username");
      createChatMessage(
        `<li class='chat-msg'>Welcome to the chat room <span style="color:${usernameColor}}" class='username'><strong>${username}</strong></span>!<br/>`
      );
      console.log("existing local username used");
    }
  }

  socket.emit(
    "welcome msg",
    `<li class='chat-msg'>Another user <span  style="color:${usernameColor}}" class='username'><strong>${username}</strong></span> has joined the chat room</li>`
  );
});

socket.on("welcome msg", msg => {
  createChatMessage(msg);
});

socket.on("disconnect msg", msg => {
  console.log(msg);
  createChatMessage(msg);
});

socket.on("chat message", msg => {
  createChatMessage(msg);
});

socket.on("image", data => {
  createChatMessage(
    `<li class''chat-msg'><span style="color:${
      data.color
    }}" class='username'><strong>${data.username}</strong></span>: <img src=${
      data.image
    } /> </li>`
  );
});

socket.on("disconnect", () => {
  chatAttributes = {
    username: username,
    color: usernameColor
  };
  socket.emit("disconnect msg", chatAttributes);
});

sendButton.addEventListener("click", () => sendMessage());
captureButton.addEventListener("click", () => captureImage());
