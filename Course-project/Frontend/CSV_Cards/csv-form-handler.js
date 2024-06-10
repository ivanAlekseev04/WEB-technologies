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
    
    fetch('../../Backend/API/upload_csv.php', {
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
            alert('CSV uploaded successfully!');
            form.reset(); // Reset the form
            errorMessage.textContent = '';
        }
    })
    .catch(error => {
        errorMessage.textContent = error.message;
        //errorMessage.textContent = 'An error occurred: ' + error.message;
        //console.log('An error occurred: ' + error.message);
    });
});