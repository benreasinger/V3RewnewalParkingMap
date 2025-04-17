const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");
let loginattemps = 0;

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const password = loginForm.password.value;

    if (password === "3478") {
        loginErrorMsg.style.opacity = 0;
        window.location.replace("../admin-page.html");
        loginattemps=0;
    }
     else if(loginattemps<1) {
        loginErrorMsg.style.opacity = 1;
        loginattemps++;

        loginErrorMsg.style.opacity = 0;
    }else{
        loginErrorMsg.style.opacity = 1;
        delay(2000)
        loginErrorMsg.style.opacity = 0;
        login++;
    }
})

function goBack(){
    window.history.back();
  }