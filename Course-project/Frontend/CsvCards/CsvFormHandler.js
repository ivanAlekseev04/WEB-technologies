const form = document.getElementById('csv-form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('csv');
    const file = fileInput.files[0];

    if (!file) {
        errorMessage.textContent = 'Please select a file.';
        return;
    }

    const formData = new FormData();
    formData.append('csv', file);
    
    fetch('../../Backend/Api/UploadCsv.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if(response.ok) {
            return response.json();
        }

        return response.json().then(errorData => {
            throw new Error(errorData.message || 'Unknown error occurred');
        });
    }) 
    .then(data => {
        if (data.success) {
            form.reset(); // Reset the form
  
            addMessage(data);
        }
    })
    .catch(error => {
        addMessage(error);
    });
});

function addMessage(message) {
    // Find the form element
    const form = document.getElementById('csv-form');
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