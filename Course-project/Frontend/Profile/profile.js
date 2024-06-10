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
        console.log('Logout button clicked');
        fetch('../../Backend/API/logout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'изходът е успешен') {
                console.log('Logout successful');
                location = '../Home/home.html'; 
                console.error('Logout failed:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function handleSeeYourCardBox() {   
        console.log('See your card box button clicked');
        window.location.href = '../Card_Box/card-box.html';
    }

    function handleSendCardWithForm() {
        console.log('Send card with form button clicked');
        window.location.href = '../Form_Card/form-card.html';
    }

    function handleSendCardWithCsv() {
        console.log('Send card with CSV button clicked');
        window.location.href = '../CSV_Cards/csv-card-upload.html';
    }
});