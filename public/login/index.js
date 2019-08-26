const usernameInputField = document.getElementById("username-input-field");
const button = document.getElementById("login-button");
const header = document.getElementById("login-header");
const form = document.getElementById("login-form");
let username;

function checkStorage() {
  if (sessionStorage.getItem("username")) {
    window.location.href = `/login/${username}`;
  } else {
    header.textContent = `please create a username and password`;
  }
}
checkStorage();

console.log(sessionStorage);

async function login() {
  username = usernameInputField.value;

  if (username !== null) {
    window.location.href = `/login/${username}`;
  } else {
    window.location.href = `/chatroom`;
    sessionStorage.clear();
  }
}

function formValidation(e) {
  e.preventDefault();

  console.log(e.data);
}

button.addEventListener("click", () => login());
usernameInputField.addEventListener("input", e => formValidation(e));
