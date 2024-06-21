document.addEventListener('DOMContentLoaded', function() {
    const receivedPaginationContainer = document.createElement('div');
    receivedPaginationContainer.classList.add('pagination');
    document.getElementById('received').appendChild(receivedPaginationContainer);

    fetchReceivedCards(1);
});

function fetchReceivedCards(page) {
    fetch(`../../Backend/Api/CardBoxReceived.php?page=${page}&limit=1`)
        .then(response => response.json())
        .then(data => {
            const receivedCardsContainer = document.getElementById('received-cards');
            receivedCardsContainer.innerHTML = '';
            data.cards.forEach(card => {
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
                receivedCardsContainer.appendChild(cardElement);
            });
            updateReceivedPagination(data.totalPages, page);

        })
        .catch(error => {
            addMessage(error);
        });
}

function updateReceivedPagination(totalPages, currentPage) {
    const paginationContainer = document.querySelector('#received .pagination');
    paginationContainer.innerHTML = '';

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', function() {
            fetchReceivedCards(i);
        });
        paginationContainer.appendChild(pageButton);
    }
}

function addMessage(message) {
    const form = document.getElementById('received');
    const msg = document.getElementById('messageReceived');
    if (msg) {
        msg.className = 'error';
        msg.textContent = message.message;
        return;
    }
    const msgDiv = document.createElement('div');
    msgDiv.className = 'error';
    msgDiv.textContent = message.message;
    msgDiv.id = "messageReceived";

    form.appendChild(msgDiv);
}