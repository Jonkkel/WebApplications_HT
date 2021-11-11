if(document.readyState !== "loading"){
    console.log("Document is ready");
    initializeCode3();
} else {
    document.addEventListener("DOMContentLoaded", function(){
        console.log("Document ready after waiting!");
        initializeCode3();
    })
}


function initializeCode3() {
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
    console.log(localStorage.getItem("auth_token") === "null");
    if (localStorage.getItem("auth_token") === "null"){
        const login = document.createElement("a");
        const register = document.createElement("a");

        const space = document.createTextNode("\u00A0");
        login.href = "/login.html";
        login.innerHTML = "Login";
        register.href = "/register.html";
        register.innerHTML = "Register";
        document.body.appendChild(login);
        document.body.appendChild(space)
        document.body.appendChild(register);
    }else{
        const button = document.createElement("button");
        const p = document.createElement("p");
        button.innerHTML = "Logout";
        fetch("http://localhost:1234/api/private", {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("auth_token")
             }
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                p.innerHTML = data.email;
            });
        button.addEventListener("click", function() {
            localStorage.setItem("auth_token",null);
            window.location.href = 'http://localhost:1234/';
        });
        document.body.appendChild(p);
        

        // Todos

        const text = document.createElement("input");
        const br = document.createElement("br");
        const br1 = document.createElement("br");
        text.type = "text";
        text.id = "add-item";
        document.body.appendChild(text);
        document.body.appendChild(br);
        document.body.appendChild(br1);
        document.body.appendChild(button);
        fetch("http://localhost:1234/api/todos", {
            method: "post",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("auth_token"),
                "Content-type": "application/json"
             },
             body: JSON.stringify({items: []}),
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.todos);
                for( let i = 0; i < data.todos.length; i++){
                    var p = document.createElement("p");
                    p.innerHTML = data.todos[i];
                    document.body.append(p);
                }
            });
        

    }
    
}