if(document.readyState !== "loading"){
    console.log("Document is ready");
    initializeCode4();
} else {
    document.addEventListener("DOMContentLoaded", function(){
        console.log("Document ready after waiting!");
        initializeCode4();
    })
}

function initializeCode4() {
    getUserData()
    
}

// Gets user data from database and displays it
function getUserData(){
    const container = document.getElementById("container");
    fetch("http://localhost:1234/api/userdata", {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("auth_token"),
            "Content-type": "application/json",
            }
        })
        .then((response) => response.json())
        .then((data) => {
            const registerDate = document.createElement("h4");
            const username = document.createElement("h4");
            const firstname = document.createElement("h4");
            const lastname = document.createElement("h4");
            const bio = document.createElement("h4");
            bio.id = "bio";
            registerDate.innerHTML = "Register date: "+ data.registery_date;
            username.innerHTML = "Username: " + data.username;
            firstname.innerHTML = "First name: " + data.firstname;
            lastname.innerHTML = "Last name: " + data.lastname;
            bio.innerHTML = "Bio: " + data.bio;
            container.appendChild(registerDate);
            container.appendChild(username);
            container.appendChild(firstname);
            container.appendChild(lastname);
            container.appendChild(bio);
        });
}

// Handles bio updating
async function updateBio(){
    const biotext = document.getElementById("biotext");
    const bio = document.getElementById("bio");
    await fetch("http://localhost:1234/api/changebio", {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("auth_token"),
            "Content-type": "application/json"
        },
        body: JSON.stringify({bio: biotext.value}),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === "ok"){
                M.toast({html: 'Bio updated succesfully!'})
                bio.innerHTML = "Bio: " + biotext.value;
                biotext.value = "";
            }else{
                M.toast({html: 'Something went wrong!'})
                
            }
        });
}

// logout
function logout(){
    localStorage.removeItem('auth_token');
    window.location.href = 'http://localhost:1234/';
}