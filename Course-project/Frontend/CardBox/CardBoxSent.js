document.addEventListener('DOMContentLoaded', function() {
    const sentPaginationContainer = document.createElement('div');
    sentPaginationContainer.classList.add('pagination');
    document.getElementById('sent').appendChild(sentPaginationContainer);

    fetchSentCards(1);
});

function fetchSentCards(page) {
    fetch(`../../Backend/Api/CardBoxSent.php?page=${page}&limit=1`)
        .then(response => response.json())
        .then(data => {
            const sentCardsContainer = document.getElementById('sent-cards');
            sentCardsContainer.innerHTML = '';
            data.cards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');
                cardElement.innerHTML = `
                    <p><strong>To:</strong> ${card.username}</p>
                    <p><strong>Date:</strong> ${card.created_at}</p>
                    <p><strong>Occasion:</strong> ${card.occasion}</p>
                    <p><strong>Wish:</strong></p>
                    <p>${card.wish}</p>
                `;
                cardElement.addEventListener('click', function() {
                    localStorage.setItem('selectedSentCard', JSON.stringify(card));
                    window.open('../Templates/Template1/Template.html', '_blank').focus();
                });
                sentCardsContainer.appendChild(cardElement);
            });
            updateSentPagination(data.totalPages, page);
        })
        .catch(error => {
            addSentMessage(error);
        });
}

function updateSentPagination(totalPages, currentPage) {
    const paginationContainer = document.querySelector('#sent .pagination');
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
            fetchSentCards(i);
        });
        paginationContainer.appendChild(pageButton);
    }
}

function addSentMessage(message) {
    const form = document.getElementById('sent');
    const msg = document.getElementById('messageSent');
    if (msg) {
        msg.className = 'error';
        msg.textContent = message.message;
        return;
    }
    const msgDiv = document.createElement('div');
    msgDiv.className = 'error';
    msgDiv.textContent = message.message;
    msgDiv.id = "messageSent";

    form.appendChild(msgDiv);
}