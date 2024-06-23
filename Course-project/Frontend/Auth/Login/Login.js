let form = document.getElementById("loginForm");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputs = Array.from(document.querySelectorAll("input"));
    const userData = {};
    inputs.forEach(i => {
        userData[i.name] = i.value;
    })

    fetch("../../../Backend/API/Login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(res => {
        if(!res.ok) {
            return res.json().then(errorData => {
                throw new Error(errorData.message || 'Unknown error occurred');
            });
        }

        form.reset();
    })
    .then(data => {
        location = "../../Profile/Profile.html";
    })
    .catch(err => {
        addMessage(err);
    });
})

function addMessage(message) {
    const form = document.getElementById('loginForm');
    const msg = document.getElementById('message');

    if(msg) {
    
        msg.className = 'error';
        msg.textContent = message.message;

        return;
    }

    const msgDiv = document.createElement('div');

    msgDiv.className = 'error';
    msgDiv.textContent = message.message;

    msgDiv.id = "message";
    form.appendChild(msgDiv);
}