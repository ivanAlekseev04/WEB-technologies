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
        alert('All fields are required.');
        return;
    }

    // Send the form data using fetch and JSON.stringify
    fetch('../../Backend/API/form-card.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Send data as JSON
        },
        body: JSON.stringify(userData) // Convert the userData object to JSON
    })
    .then(res => {
        if (!res.ok) {
            // Convert response to JSON and throw an error with the message
            return res.json().then(errorData => {
                throw new Error(errorData.message || 'An unknown error occurred');
            });
        }
        return res.json(); // Convert response to JSON if successful
    })
    .then(data => {
        // Handle the success scenario
        alert('Greeting card sent successfully!');
        form.reset(); // Clear the form
    })
    .catch(err => {
        // Handle errors
        alert('Error: ' + err.message);
    });
});