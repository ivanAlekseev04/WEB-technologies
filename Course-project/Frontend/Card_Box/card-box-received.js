document.addEventListener('DOMContentLoaded', function() {
   
    fetch('../../Backend/API/card-box-received.php')
        .then(response => response.json())
        .then(data => {

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
                        window.open('../Templates/template-2/template-2.html', '_blank').focus();
                    });

                    document.getElementById('received-cards').appendChild(cardElement);
            });
        })
        .catch(error => console.error('Error fetching cards:', error));
    
});