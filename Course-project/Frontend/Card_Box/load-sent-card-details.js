document.addEventListener('DOMContentLoaded', function() {
    const card = JSON.parse(localStorage.getItem('selectedSentCard'));

    if (card) {
        document.getElementById('username').textContent = card.username;
        document.getElementById('occasion').textContent = card.occasion;
        document.getElementById('wish').textContent = card.wish;
    } else {
        document.querySelector('.card-body').innerHTML = '<p>Error: No card data found.</p>';
    }
});