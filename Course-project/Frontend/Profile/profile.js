document.addEventListener("DOMContentLoaded", function() {
    
    const logoutBtn = document.getElementById('logout_btn');
    const seeYourCardBoxBtn = document.getElementById('see_your_card_box_btn');
    const sendCardWithFormBtn = document.getElementById('send_card_with_form_btn');
    const sendCardWithCsvBtn = document.getElementById('send_card_with_csv_btn');

    logoutBtn.addEventListener('click', function() {
        handleLogout();
    });

    seeYourCardBoxBtn.addEventListener('click', function() {
        handleSeeYourCardBox();
    });

    sendCardWithFormBtn.addEventListener('click', function() {
        handleSendCardWithForm();
    });

    sendCardWithCsvBtn.addEventListener('click', function() {
        handleSendCardWithCsv();
    });

    function handleLogout() {
        fetch('../../Backend/API/logout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
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
                location = '../Home/Home.html'; 
            }
        })
        .catch(error => {
            addMessage(error);
        });
    }

    function handleSeeYourCardBox() {   
        window.location.href = '../CardBox/CardBox.html';
    }

    function handleSendCardWithForm() {
        window.location.href = '../FormCard/FormCard.html';
    }

    function handleSendCardWithCsv() {
        window.location.href = '../CsvCards/CsvCardUpload.html';
    }
});

function addMessage(message) {
    // Find the form element
    const form = document.getElementById('navigationBar');
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