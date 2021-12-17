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

    // Aka user hasn't logged in
    console.log(localStorage.getItem("auth_token"));
    
    // User hasn't logged in so only show posts and comments
    if (localStorage.getItem("auth_token") === null ){
        // Hide the post input - it is secured with authentication so this should be ok.
        const postInput = document.getElementById("header");
        postInput.style.display='none';
        // TODO
        const links = document.getElementById("links");

        const logout = document.getElementById("logout");
        const logout_mobile = document.getElementById("logout_mobile");
        const profile = document.getElementById("profile");
        const profile_mobile = document.getElementById("profile_mobile");
        logout.style.display='none';
        logout_mobile.style.display='none';
        profile.style.display='none';
        profile_mobile.style.display='none';

        getPosts(false);
        
    }else{
        const login = document.getElementById("login");
        const login_mobile = document.getElementById("login_mobile");
        const register = document.getElementById("register");
        const register_mobile = document.getElementById("register_mobile");
        login.style.display='none';
        login_mobile.style.display='none';
        register.style.display='none';
        register_mobile.style.display='none';

        // Post input and logout button added to body
        const postInput = document.getElementById("textarea1");
        
        getPosts(true);

        postInput.addEventListener("keypress", function(event) {
            if (event.code === 'Enter' && !event.shiftKey) {
                addPost(postInput);
            }
        });

    }
}
// sets current page to "mainpage"
function setCurrectPage(){
    localStorage.setItem("currentPage", 1);
}


// Handles post posting
function addPost(postInput){
    fetch("http://localhost:1234/api/post", {
        method: "post",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("auth_token"),
            "Content-type": "application/json"
        },
        body: JSON.stringify({"text": postInput.value}),
        });
        location.reload();
}

// Handles comment posting
function addComment(commentInput){
    fetch("http://localhost:1234/api/comment", {
            method: "post",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("auth_token"),
                "Content-type": "application/json"
            },
            body: JSON.stringify({"ID": commentInput.id, "text": commentInput.value}),
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

            });
            location.reload();
}

// Currently when people comment new post you always reload to page one which is frustrating
function getPosts(flag){
        
        // Get code snippets for preview
        var container = document.getElementById("container");
        // Fetching posts and comments
        fetch("http://localhost:1234/snippets/posts", {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            }
        })
        .then((response) => response.json())
        .then((data) => {
            // Create elements for pager
            if (data.snippets.length > 10){
                const ul = document.getElementById("pager");
                for (let i = 1; i <= Math.ceil(data.snippets.length/10); i++){
                    const li = document.createElement("li");
                    const a = document.createElement("a");
                    a.href = "#!";
                    // Using localstorage to save current page for better using experience
                    if (i == localStorage.getItem("currentPage")){
                        li.className="active";
                    }else{
                        li.className="waves-effect";
                    }
                    a.innerHTML = i;
                    li.appendChild(a);
                    a.addEventListener("click", () =>{
                        removeChild(container);
                        getPostsForPage(data, flag, i);
                        for (let i = 0; i < ul.getElementsByTagName("li").length; i++){
                            ul.getElementsByTagName("li")[i].className ="waves-effect";
                        }
                        ul.getElementsByTagName("li")[i-1].className ="active";
                        console.log(i);
                        localStorage.setItem("currentPage", i);
                    });
                    ul.appendChild(li);
                }
                getPostsForPage(data,flag, localStorage.getItem("currentPage"));
            }else{
                getPostsForPage(data,flag, 1);
            }
            // TÄSSÄ vanha for loop plaaplaa
        });
}

// Getting posts for given page
function getPostsForPage(data, flag, ind){
    // variable k helps to get only 10 posts per page
    var k;
    if(ind*10 > data.snippets.length){
        k = data.snippets.length;
    }else{
        k = ind*10;
    }
    for(let i = (ind-1)*10; i < k ; i++){
        var li = document.createElement("li");
        const divider = document.createElement("div");
        const section = document.createElement("div");
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        const div = document.createElement("div");
        var ul = document.createElement("ul");
        

        divider.className = "divider";
        section.className = "section";
        
        codeSnippet = hljs.highlightAuto(data.snippets[i]).value;
        code.innerHTML = codeSnippet;
        ul.className = "Text" ;
        
        
        
        
        

        section.appendChild(ul);

        // If flag then user is logged in and we can show the comment input
        if (flag == true){
            // Add edit button if the current user is same as post creator
            createEdit(data.creators[i], data.ids[i], data.snippets[i], div, code);
            const commentInput = document.createElement("textarea");
            commentInput.placeholder = "Add comment: ";
            commentInput.id = data.ids[i];
            // TODO submit button ei enter
            commentInput.addEventListener("keypress", function(event) {
                if (event.code === 'Enter' && !event.shiftKey) {
                    addComment(commentInput, ind);
                }
            })
            section.appendChild(commentInput);
        }
        getComments(data.ids[i], div, flag);
        pre.appendChild(code);
        div.appendChild(pre);
        li.appendChild(div)
        ul.appendChild(li);
        container.appendChild(divider);
        container.appendChild(section);
    }
}

// removes all posts from given parent object
function removeChild(parent){
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
}

// logout button
function logout(){
    localStorage.removeItem('auth_token');
    window.location.href = 'http://localhost:1234/';
}

async function getComments(id, ul, flag){
    await fetch("http://localhost:1234/snippets/comments/"+id, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
            },
        })
        .then((response) => response.json())
        .then((data) => {
            for(let i = 0; i < data.snippets.length ; i++){
                var li = document.createElement("li");
                const divider = document.createElement("div");
                const pre = document.createElement("pre");
                const code = document.createElement("code");
                const div = document.createElement("div");

                codeSnippet = hljs.highlightAuto(data.snippets[i]).value;
                code.innerHTML = codeSnippet;
                divider.className = "divider"
                if (flag) {
                    createEdit(data.creators[i], data.ids[i], data.snippets[i], div, code);
                }
                pre.appendChild(code);
                div.appendChild(pre);
                li.appendChild(div)
                ul.appendChild(divider);
                ul.appendChild(li);
                
               
            }
        })
        
}


// Create edit and submit buttons and everything needed to let user edit comments/posts
async function createEdit(creator, postID, ogtext, div, code){
    user = await getUserEmail();    
    if (creator === user){

        var editButton = document.createElement("a");
        var submitButton = document.createElement("a");

        editButton.className = "btn-small waves-effect waves-black red darken-2";
        editButton.innerText = "edit"
        submitButton.className = "btn-small waves-effect waves-black red darken-2 disabled";
        submitButton.innerText = "submit"

        div.appendChild(editButton);
        div.appendChild(document.createTextNode( '\u00A0' ));
        div.appendChild(submitButton);

        // If edit pressed let user edit comment/post
        editButton.addEventListener("click", () =>{
            code.contentEditable = true;
            code.innerHTML = ogtext;
            code.focus();
            editButton.className = "btn-small waves-effect waves-black red darken-2 disabled";
            submitButton.className = "btn-small waves-effect waves-black red darken-2";
            M.toast({html: 'You can now edit your post/comment.'})
        });
        // If submit pressed 
        submitButton.addEventListener("click", () =>{
            var codeText = code.innerHTML;
            code.contentEditable = false;

            // Changing &amp = & and &gt and &lt to > <
            var reg = new RegExp('&amp;', 'g');
            codeText = codeText.replace(reg, '&');
            var reg = new RegExp('&gt;', 'g');
            codeText = codeText.replace(reg, '>');
            var reg = new RegExp('&lt;', 'g');
            codeText = codeText.replace(reg, '<');
            ogtext = codeText;
            fetch("http://localhost:1234/snippets/edit", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({"postID": postID, "text": ogtext}),
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message === "ok"){
                        M.toast({html: 'Post updated succesfully!'})
                        codeSnippet = hljs.highlightAuto(ogtext).value;
                        code.innerHTML = codeSnippet;
                    }else{
                        M.toast({html: 'Something went wrong!'}) 
                    }
                });
            editButton.className = "btn-small waves-effect waves-black red darken-2";
            submitButton.className = "btn-small waves-effect waves-black red darken-2 disabled";
        });
    }
}

// Returns current users email
async function getUserEmail(){
    // Adding user email to page
    var user = "";
    await fetch("http://localhost:1234/api/private", {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("auth_token")
            }
        })
        .then((response) => response.json())
        .then((data) => {
            user = data.user;
        });
    return user;
}