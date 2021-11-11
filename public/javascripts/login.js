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
    const options = {
        edge: 'right',
        draggable: false,
        inDuration: 250,
        outDuration: 200,
        onOpenStart: null,
        onOpenEnd: null,
        onCloseStart: null,
        onCloseEnd: null,
        preventScrolling: true
    };
    var email = document.getElementById("email");
    var pass = document.getElementById("password");

    var button = document.getElementById("login");
    button.addEventListener("click", function() {
        console.log(pass.value);
        console.log(email.value);
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
                localStorage.setItem("auth_token", data.token);
                
                window.location.href = 'http://localhost:1234/';
                
            });
    });
}