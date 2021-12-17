if(document.readyState !== "loading"){
    console.log("Document is ready");
    initializeCode();
} else {
    document.addEventListener("DOMContentLoaded", function(){
        console.log("Document ready after waiting!");
        initializeCode();
    })
}

function initializeCode() {
    var username = document.getElementById("username");
    username.addEventListener("keypress", function(event) {
        if (event.code === 'Enter') {
            register();
        }
    });
}

// Handles user registering
function register(){
    
    var first_name = document.getElementById("first_name");
    var last_name = document.getElementById("last_name");
    var email = document.getElementById("email");
    var pass = document.getElementById("password");
    var username = document.getElementById("username");

    const error = document.createElement("p");
    error.style.color = "#ff0000";
    error.innerHTML = "";
    const data = { email: email.value, password: pass.value,first_name: first_name.value,
         last_name: last_name.value, username: username.value}
    fetch("http://localhost:1234/api/user/register", {
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.success === true){
                window.location.href = "/login.html";
            }else{
                
                if (data.message){
                    error.innerHTML = data.message;
                    document.body.appendChild(error);
                }else{
                    error.innerHTML = "Weird error";
                }
            }
        })
}