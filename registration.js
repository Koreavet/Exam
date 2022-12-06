const form = document.querySelector("#reg"),
  emailField = form.querySelector(".email-field"),
  emailInput = emailField.querySelector(".email"),
  passField = form.querySelector(".create-password"),
  passInput = passField.querySelector(".password"),
  cPassField = form.querySelector(".confirm-password"),
  cPassInput = cPassField.querySelector(".cPassword"),
  confirmCode = form.querySelector(".confirm-code");
let writeCode = document.querySelector(".write");
let btn = document.querySelector("#code");
let sbtn = document.querySelector("#sub");

// Email Validtion
function checkEmail() {
  const emaiPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!emailInput.value.match(emaiPattern)) {
    return emailField.classList.add("invalid"); //adding invalid class if email value do not mathced with email pattern
  }
  emailField.classList.remove("invalid"); //removing invalid class if email value matched with emaiPattern
}

// Hide and show password
const eyeIcons = document.querySelectorAll(".show-hide");
eyeIcons.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    const pInput = eyeIcon.parentElement.querySelector("input"); //getting parent element of eye icon and selecting the password input
    if (pInput.type === "password") {
      eyeIcon.classList.replace("bx-hide", "bx-show");
      return (pInput.type = "text");
    }
    eyeIcon.classList.replace("bx-show", "bx-hide");
    pInput.type = "password";
  });
});

// Password Validation
function createPass() {
  const passPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passInput.value.match(passPattern)) {
    return passField.classList.add("invalid"); //adding invalid class if password input value do not match with passPattern
  }
  passField.classList.remove("invalid"); //removing invalid class if password input value matched with passPattern
}

// Confirm Password Validtion
function confirmPass() {
  if (passInput.value !== cPassInput.value || cPassInput.value === "") {
    return cPassField.classList.add("invalid");
  }
  cPassField.classList.remove("invalid");
}

//Generator of code confirmation
function passwordGenerate(length) {
  let result = "";
  let numbers = "0123456789";
  let uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let lowercase = "abcdefghijklmnopqrstuvwxyz";
  let numbersLength = numbers.length;
  let uppercaseLength = uppercase.length;
  let lowercaseLength = lowercase.length;
  for (let i = 0; i < length; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbersLength));
    result += uppercase.charAt(Math.floor(Math.random() * uppercaseLength));
    result += lowercase.charAt(Math.floor(Math.random() * lowercaseLength));
  }
  return result;
}

//Code confirmation field
function inputCode() {
  const codePattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
  if (!writeCode.value.match(codePattern)) {
    return confirmCode.classList.add("invalid");
  }
  confirmCode.classList.remove("invalid");
  if (
    writeCode.value !== passwordGenerate.value ||
    passwordGenerate.value === ""
  ) {
    return passwordGenerate.classList.add("invalid");
  }
  passwordGenerate.classList.remove("invalid");
}

// Calling Funtion on Form Sumbit
form.addEventListener("submit", (e) => {
  e.preventDefault(); //preventing form submitting
  checkEmail();
  createPass();
  confirmPass();
  inputCode();
  //calling function on key up
  emailInput.addEventListener("keyup", checkEmail);
  passInput.addEventListener("keyup", createPass);
  cPassInput.addEventListener("keyup", confirmPass);
  writeCode.addEventListener("keyup", inputCode);

  if (
    !emailField.classList.contains("invalid") &&
    !passField.classList.contains("invalid") &&
    !cPassField.classList.contains("invalid") &&
    !confirmCode.classList.contains("invalid")
  ) {
    location.href = form.getAttribute("action");
  }
});

// Structure of send email
const sendEmail = (email, subject, message) => {
  const templateParams = {
    subject: subject,
    message: message,
    to_email: email,
  };

  emailjs.send("service_it1i2ac", "template_o7dh903", templateParams).then(
    function (response) {
      console.log("SUCCESS!", response.status, response.text);
    },
    function (error) {
      console.log("FAILED...", error);
    }
  );
};

//Send confirmation code to email
btn.addEventListener("click", () => {
  let code = passwordGenerate(3);
  const email_input = emailInput.value;
  const pass_input = passInput.value;
  if (email_input && pass_input) {
    sendEmail(`${emailInput.value}`, "Code conformation", code);
    localStorage.setItem("code", code);
    alert(
      "We send you code in your email. Please check and input code in form!"
    );
  } else {
    alert("Input data is incorrect");
  }
});

//Personal ID for each user
function getId(min, max) {
  let int = Math.floor(Math.random() * (max - min + 1)) + min;
  return int.toString(36);
}

//Submit button
sbtn.onclick = function () {
  const email_input = emailInput.value;
  const pass_input = passInput.value;
  const write_code = writeCode.value;

  let getCode = localStorage.getItem("code");
  console.log(getCode);
  let usersDataBase = JSON.parse(localStorage.getItem("AllUsers"));

  if (usersDataBase === null || usersDataBase === undefined) {
    localStorage.setItem("AllUsers", JSON.stringify([]));
  }
  if (write_code === getCode && email_input && pass_input) {
    let users = JSON.parse(localStorage.getItem("AllUsers"));
    let id = getId(0, 16789765);
    let user = {
      id: id,
      emailInput: email_input,
      passInput: pass_input,
      writeCode: write_code,
    };
    users.push(user);
    localStorage.setItem("AllUsers", JSON.stringify(users));
    alert("Registration success!");
    location.href = "login.html";
  } else {
    alert("Please fill out the forms.");
  }
};
