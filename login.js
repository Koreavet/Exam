let login = document.querySelector("#login");
let url = document.querySelector("#catalog");

url.addEventListener("submit", (e) => {
  console.log("dsd");
  e.preventDefault(); //preventing form submitting
  return false;
});

login.onclick = function () {
  let email = document.querySelector(".email").value;
  let pass = document.querySelector(".password").value;
  let allUsers = JSON.parse(localStorage.getItem("AllUsers"));
  let count = 0;

  for (let user of allUsers) {
    if (user.emailInput === email && user.passInput === pass) {
      localStorage.setItem("currentUserId", user.id);
      localStorage.setItem("currentUserEmails", user.emailInput);
      count += 1;
    }
  }
  if (count > 0) {
    alert("Authorization success!");
    window.location.href = "catalogue.html";
  } else {
    alert("User not found!");
  }
};
