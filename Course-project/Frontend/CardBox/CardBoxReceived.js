document.addEventListener('DOMContentLoaded', function() {
   
    fetch('../../Backend/Api/CardBoxReceived.php')
        .then(response => {
            if(response.ok) {
                return response.json();
            }
    
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Unknown error occurred');
            });
        })
        .then(data => {
            // if(data.success) {
                data.forEach(card => {
                    // Create a card element
                    const cardElement = document.createElement('div');
                    cardElement.classList.add('card');
                        cardElement.innerHTML = `
                            <p><strong>From:</strong> ${card.username}</p>
                            <p><strong>Date:</strong> ${card.created_at}</p>
                            <p><strong>Occasion:</strong> ${card.occasion}</p>
                            <p><strong>Wish:</strong></p>
                            <p>${card.wish}</p>
                        `;
    
                        cardElement.addEventListener('click', function() {
                            localStorage.setItem('selectedReceivedCard', JSON.stringify(card));
                            window.open('../Templates/Template2/Template.html', '_blank').focus();
                        });
    
                        document.getElementById('received-cards').appendChild(cardElement);
                });
            // }
        })
        .catch(error => {
            addMessage(error);
        });
});

function addMessage(message) {
    // Find the form element
    const form = document.getElementById('received');
    const msg = document.getElementById('messageReceived');

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

    msgDiv.id = "messageReceived";
    // Append the error div to the end of the form
    form.appendChild(msgDiv);
}