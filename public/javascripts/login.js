if(document.readyState !== "loading"){
    console.log("Document is ready");
    initializeCode2();
} else {
    document.addEventListener("DOMContentLoaded", function(){
        console.log("Document ready after waiting!");
        initializeCode2();
    })
}


function initializeCode2() {
    var email = document.getElementById("email");
    var pass = document.getElementById("password");
    email.addEventListener("keypress", function(event) {
        if (event.code === 'Enter' || event.code === 'bravo') {
            pass.focus();
        }
    });
    pass.addEventListener("keypress", function(event) {
        if (event.code === 'Enter') {
            login();
        }
    });
}

function login(){
    var email = document.getElementById("email");
    var pass = document.getElementById("password");
    
    const error = document.createElement("p");
    error.style.color = "#ff0000";
    error.innerHTML = "";
    const data = { email: email.value, password: pass.value}
    fetch("http://localhost:1234/api/user/login", {
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
                localStorage.setItem("currentPage", 1);
                localStorage.setItem("auth_token", data.token);
                window.location.href = 'http://localhost:1234/';
            }else{
                if (data.message){
                    error.innerHTML = data.message;
                    document.body.appendChild(error);
                }else{
                    error.innerHTML = "Weird error";
                }
            }  
        });
}