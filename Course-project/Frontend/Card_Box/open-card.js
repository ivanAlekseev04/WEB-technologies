const cards = document.querySelectorAll('.card');

cards.forEach(card => {

    card.addEventListener('click', function() {
        const encodedUsername = encodeURIComponent(card.username);
        const encodedOccasion = encodeURIComponent(card.occasion);
        const encodedWish = encodeURIComponent(card.wish);
        window.open(`../Templates/template-1/template-1.html?username=${encodedUsername}&occasion=${encodedOccasion}&wish=${encodedWish}`,'_blank').focus();

    });

});