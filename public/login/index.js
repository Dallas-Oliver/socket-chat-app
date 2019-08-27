const usernameInputField = document.getElementById("username-input-field");
const passInputField = document.getElementById("pass-input-field");
const button = document.getElementById("login-button");
const header = document.getElementById("login-header");
const form = document.getElementById("login-form");
const validateMsgPopup = document.getElementById("username-validate-msg-popup");
const validateContainer = document.getElementById(
  "validation-msg-popup-container"
);
const passwordValMsg = document.getElementById("password-validate-msg");
const charNumValidateMsg = document.getElementById("char-num-validation");
const uppercaseValMsg = document.getElementById("uppercase-validation");
const specialCharValMsg = document.getElementById("special-char-validation");
let username;
let usernameValid = false;
passwordValid = false;

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
  if (usernameValid === true && passwordValid === true) {
    if (username !== null) {
      window.location.href = `/login/${username}`;
    } else if (username === null) {
      window.location.href = `/chatroom`;
      sessionStorage.clear();
    }
  }
}

function passwordFormValidation(e) {
  const passwordLength = passInputField.value.length;
  console.log(e.data);
  if (passwordLength < 8) {
    passwordValMsg.classList.remove("hide");
    passInputField.style.borderColor = "#fe6a6c";
    passwordValMsg.textContent = "password should be at least 8 characters";
  } else {
    passwordValMsg.classList.add("hide");
    passInputField.style.borderColor = "";
    passwordValid = true;
  }
}

function usernameFormValidation(e) {
  e.preventDefault();
  const input = usernameInputField.value;
  const capitalRegex = /[A-Z]/g;
  const specialRegex = /[!@#$%&()+=\|'";:,<>/?]/g;
  let charNum;
  let uppercase;
  let specialChars;

  if (input.length >= 5 && input.length <= 20) {
    charNumValidateMsg.style.color = "#47C664";
    charNum = true;
  } else {
    charNumValidateMsg.style.color = "#fe6a6c";
    charNum = false;
  }

  if (capitalRegex.test(input) === false) {
    uppercaseValMsg.style.color = "#fe6a6c";
    uppercase = false;
  } else {
    uppercaseValMsg.style.color = "#47C664";
    uppercase = true;
  }

  if (specialRegex.test(input) === true) {
    specialCharValMsg.style.color = "#fe6a6c";
    specialChars = false;
  } else {
    specialCharValMsg.style.color = "#47C664";
    specialChars = true;
  }

  if (charNum === true && uppercase === true && specialChars === true) {
    validateMsgPopup.style.borderColor = "#47C664";
    usernameValid = true;
    usernameInputField.style.borderColor = "";
  } else {
    validateMsgPopup.style.borderColor = "#fe6a6c";
    usernameValid = false;
    usernameInputField.style.borderColor = "#fe6a6c";
  }
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
usernameInputField.addEventListener("input", e => usernameFormValidation(e));
passInputField.addEventListener("input", e => passwordFormValidation(e));
