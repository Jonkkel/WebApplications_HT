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

    var button = document.getElementById("submit");
    button.addEventListener("click", function() {
        console.log(pass.value);
        console.log(email.value);
        const data = { email: email.value, password: pass.value}
        fetch("http://localhost:1234/api/user/register", {
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data),
            })
            .then((response) => 
            {
                if (response.status === 200){
                    window.location.href = 'http://localhost:1234/login.html';
                }
            })
    });
}