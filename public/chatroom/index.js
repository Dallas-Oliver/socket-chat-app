const chatBox = document.getElementById("chat-box");
const msgStream = document.getElementById("msg-stream");
const sendButton = document.getElementById("send-msg");
const captureButton = document.getElementById("capture-img");
const logoutButton = document.getElementById("logout-button");

const socket = io.connect();

let username;
let usernameColor;

class ChatMessageBase {
  constructor(username, message, timestamp) {
    this.username = username;
    this.message = message;
    this.timestamp = timestamp;
  }
}

class ChatMessage extends ChatMessageBase {
  constructor(username, message, timestamp) {
    super(username, message, timestamp);
    this.messageType = "ChatMessage";
  }

  renderToHTML() {
    return `<p class="chat-message">[${new Date(
      this.timestamp
    ).toLocaleTimeString()}] ${this.username}: ${this.message}</p>`;
  }
}

class WelcomeChatMessage extends ChatMessageBase {
  constructor(username, timestamp) {
    super(username, null, timestamp);
    this.messageType = "WelcomeChatMessage";
  }

  renderToHTML() {
    return `<p class="welcome-message">${this.username} has joined the chat room.</p>`;
  }
}

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
  const chatMessage = new ChatMessage(username, chatBox.value);
  socket.emit("chat message", chatMessage);
  chatBox.value = "";
}

function renderChatMessage(message) {
  let chatMessage = null;
  if (message.messageType === "ChatMessage") {
    chatMessage = new ChatMessage(
      message.username,
      message.message,
      message.timestamp
    );
  } else if (message.messageType === "WelcomeChatMessage") {
    chatMessage = new WelcomeChatMessage(message.username, message.timestamp);
  }

  const li = document.createElement("li");
  li.innerHTML = chatMessage.renderToHTML();
  msgStream.append(li);
}

socket.on("connect", () => {
  usernameColor = randomColorForUsername();
  const params = new URLSearchParams(window.location.search);
  usernameParam = params.get("username");
  console.log(usernameParam);

  if (usernameParam === null) {
    username = randomUsername();
    renderChatMessage(new WelcomeChatMessage(username));
    console.log("random name used");
  } else if (usernameParam !== null) {
    if (!sessionStorage.getItem("username")) {
      sessionStorage.setItem("username", usernameParam);
      username = usernameParam;
      renderChatMessage(new WelcomeChatMessage(username));
      console.log(
        "new local username created and used",
        sessionStorage.getItem("username")
      );
    } else if (sessionStorage.getItem("username")) {
      username = sessionStorage.getItem("username");
      renderChatMessage(new WelcomeChatMessage(username));
      console.log("existing local username used");
    }
  }

  socket.emit("welcome msg", new WelcomeChatMessage(username));
});

socket.on("welcome msg", msg => {
  renderChatMessage(msg);
});

socket.on("disconnect msg", msg => {
  console.log(msg);
  renderChatMessage(msg);
});

socket.on("chat message", msg => {
  renderChatMessage(msg);
});

socket.on("image", data => {
  renderChatMessage(
    `<li class''chat-msg'><span style="color:${data.color}}" class='username'><strong>${data.username}</strong></span>: <img src=${data.image} /> </li>`
  );
});

socket.on("disconnect", () => {
  chatAttributes = {
    username: username,
    color: usernameColor
  };
  socket.emit("disconnect msg", chatAttributes);
});

function logout() {
  sessionStorage.clear();
  window.location.href = `/homepage`;
}

sendButton.addEventListener("click", () => sendMessage());
captureButton.addEventListener("click", () => captureImage());
logoutButton.addEventListener("click", () => logout());
