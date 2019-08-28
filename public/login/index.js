const usernameInputField = document.getElementById("username-input-field");
const passwordInputField = document.getElementById("pass-input-field");
const button = document.getElementById("login-button");
const header = document.getElementById("login-header");
const form = document.getElementById("login-form");
const validateMsgPopup = document.getElementById("username-validate-msg-popup");
const validateContainer = document.getElementsByClassName(
  "validation-msg-popup-container"
)[0];
const passwordValMsg = document.getElementById("password-validate-msg");
const lengthMessage = document.getElementById("char-num-validation");
const uppercaseMessage = document.getElementById("uppercase-validation");
const specialCharMessage = document.getElementById("special-char-validation");

const refEl = document.getElementById("ref");
const popEl = document.getElementById("pop");

new Popper(refEl, popEl, {
  placement: "right"
});

function getUsername() {
  return usernameInputField.value;
}

function getPassword() {
  return passwordInputField.value;
}

function loginIfUsernameStored() {
  let existingUsername = sessionStorage.getItem("username");
  if (existingUsername) {
    window.location.href = `/login/${existingUsername}`;
  } else {
    header.textContent = `please create a username and password`;
  }
}

loginIfUsernameStored();

console.log(sessionStorage);

async function login() {
  let username = getUsername();
  if (usernameValid() && passwordValid()) {
    window.location.href = `/login/${username}`;
  }
}

function passwordValid() {
  const valid = getPassword().length >= 8;

  if (valid) {
    passwordValMsg.classList.add("hide");
    passwordInputField.style.borderColor = "";
  } else {
    passwordValMsg.classList.remove("hide");
    passwordInputField.style.borderColor = "#fe6a6c";
    passwordValMsg.textContent = "password should be at least 8 characters";
  }

  return valid;
}

function usernameValid() {
  const input = getUsername();
  const capitalRegex = /[A-Z]/g;
  const specialRegex = /[!@#$%&()+=\|'";:,<>/?]/g;
  let valid = true;
  // valid &= something
  // is shorthand for
  // valid = valid && something
  valid &= validateRule(input.length >= 5 && input.length <= 20, lengthMessage);
  valid &= validateRule(capitalRegex.test(input), uppercaseMessage);
  valid &= validateRule(!specialRegex.test(input), specialCharMessage);

  if (valid) {
    validateMsgPopup.style.borderColor = "#47C664";
    usernameInputField.style.borderColor = "";
  } else {
    validateMsgPopup.style.borderColor = "#fe6a6c";
    usernameInputField.style.borderColor = "#fe6a6c";
  }

  return valid;
}

function validateRule(
  condition,
  element,
  validColor = "#47C664",
  invalidColor = "#FE6A6C"
) {
  element.style.color = condition ? validColor : invalidColor;
  return condition;
}

function displayUsernameRequirements(e) {
  validateContainer.classList.remove("hide");
}

function hideUsernameRequirements(e) {
  validateContainer.classList.add("hide");
}

button.addEventListener("click", () => login());
usernameInputField.addEventListener("focus", e =>
  displayUsernameRequirements(e)
);
usernameInputField.addEventListener("blur", e => hideUsernameRequirements(e));
usernameInputField.addEventListener("input", () => usernameValid());
passwordInputField.addEventListener("input", () => passwordValid());
