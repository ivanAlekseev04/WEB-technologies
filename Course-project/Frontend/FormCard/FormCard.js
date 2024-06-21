const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Collect input data from the form
    const formData = new FormData(form);
    const userData = {};

    // Convert FormData to a plain object
    formData.forEach((value, key) => {
        userData[key] = value.trim(); // Trim to remove extra whitespace
    });

    // Validate form data (check if fields are empty)
    if (!userData['receiver-name'] || !userData['occasion'] || !userData['wish']) {
        addMessage({success: false, message: 'All fields are required.'});
        return;
    }

    // Send the form data using fetch and JSON.stringify
    fetch('../../Backend/Api/FormCard.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Send data as JSON
        },
        body: JSON.stringify(userData) // Convert the userData object to JSON
    })
    .then(res => {
        if(res.ok) {
            return res.json();
        }

        return res.json().then(errorData => {
            throw new Error(errorData.message || 'Unknown error occurred');
        });
    })
    .then(data => {
        if(data.success) {
            // Handle the success scenario
            form.reset(); // Clear the form
            addMessage({success: true, message: 'Greeting card sent successfully!'});
        }
    })
    .catch(err => {
        // Handle errors
        addMessage(err);
    });
});

function addMessage(message) {
    // Find the form element
    const form = document.getElementById('formCard');
    const msg = document.getElementById('message');

    if(msg) {
        if(message.success) {
            //msgDiv.className ='success';
            msg.className = 'success';
    
            msg.textContent = message.message;
        } else {
            msg.className = 'error';
    
            // Add the error message text
            msg.textContent = message.message;
        }

        return;
    }

    // Create a new div element
    const msgDiv = document.createElement('div');

    // Set its class to 'error' or 'success'
    if(message.success) {
        //msgDiv.className ='success';
        msgDiv.className = 'success';

        msgDiv.textContent = message.message;
    } else {
        msgDiv.className = 'error';

        // Add the error message text
        msgDiv.textContent = message.message;
    }

    msgDiv.id = "message";
    // Append the error div to the end of the form
    form.appendChild(msgDiv);
}