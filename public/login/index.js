const inputField = document.getElementById("username-input-field");
const button = document.getElementById("login-button");
const header = document.getElementById("login-header");
const form = document.getElementById("login-form");
let username;

function checkStorage() {
  if (sessionStorage.getItem("username")) {
    header.textContent = `Welcome back ${sessionStorage.getItem("username")}!`;
  } else {
    header.textContent = `please create a username and password`;
  }
}
checkStorage();

console.log(sessionStorage);
async function login() {
  username = inputField.value;

  if (username) {
    window.location.href = `/login/${username}`;
  } else {
    window.location.href = `/chatroom`;
  }
}

button.addEventListener("click", () => login());
