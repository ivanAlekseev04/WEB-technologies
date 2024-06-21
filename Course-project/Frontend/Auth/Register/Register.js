let form = document.getElementById("registrationForm");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputs = Array.from(document.querySelectorAll("input"));
    const userData = {};
    inputs.forEach(i => {
        userData[i.name] = i.value;
    })

    fetch("../../../Backend/Api/Registration.php", {
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
        location = "../Login/Login.html";
    })
    .catch(err => {
        addMessage(err);
    });
})

function addMessage(message) {
    // Find the form element
    const form = document.getElementById('registrationForm');
    const msg = document.getElementById('message');

    if(msg) {
    
        msg.className = 'error';
    
        // Add the error message text
        msg.textContent = message.message;

        return;
    }

    // Create a new div element
    const msgDiv = document.createElement('div');

    msgDiv.className = 'error';

    // Add the error message text
    msgDiv.textContent = message.message;

    msgDiv.id = "message";
    // Append the error div to the end of the form
    form.appendChild(msgDiv);
}