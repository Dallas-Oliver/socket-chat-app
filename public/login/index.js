const usernameInputField = document.getElementById("username-input-field");
const button = document.getElementById("login-button");
const header = document.getElementById("login-header");
const form = document.getElementById("login-form");
const validateMsgPopup = document.getElementById("username-validate-msg-popup");
const validateContainer = document.getElementById(
  "validation-msg-popup-container"
);
const charNumValidateMsg = document.getElementById("char-num-validation");
const uppercaseValMsg = document.getElementById("uppercase-validation");
const specialCharValMsg = document.getElementById("special-char-validation");
let username;
let usernameValid = false;

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
  if (usernameValid === true) {
    if (username !== null) {
      window.location.href = `/login/${username}`;
    } else if (username === null) {
      window.location.href = `/chatroom`;
      sessionStorage.clear();
    }
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
  } else {
    validateMsgPopup.style.borderColor = "#fe6a6c";
    usernameValid = false;
  }

  //   //passsword must contain at least 8 characters(letters, numbers, special characters)
  //   //password must contain at least one uppercase and one lowercase character
  //   //password can contain only "!_$^*" as special characters

  //   const specialRegex = /[!@#%&()-+=\|'";:,<.>/?]/g;

  //   if (specialRegex.test(input) === true) {
  //     usernameInputField.classList.add("invalid-input");
  //     validateMsg.classList.remove("hide");
  //     validateMsg.textContent += `username can only contain "$*^_" as special characters!`;
  //   }
}

function displayUsernameRequirements(e) {
  validateContainer.classList.remove("hide");
}

// function hideUsernameRequirements(e) {
//   validateContainer.classList.add("hide");
// }

button.addEventListener("click", () => login());
usernameInputField.addEventListener("focus", e =>
  displayUsernameRequirements(e)
);
// usernameInputField.addEventListener("blur", e => hideUsernameRequirements(e));
usernameInputField.addEventListener("input", e => usernameFormValidation(e));
