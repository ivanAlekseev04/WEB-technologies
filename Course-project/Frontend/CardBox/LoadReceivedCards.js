document.addEventListener('DOMContentLoaded', function() {
    const card = JSON.parse(localStorage.getItem('selectedReceivedCard'));

    if (card) {
        document.getElementById('username').textContent = card.username;
        document.getElementById('occasion').textContent = card.occasion;
        document.getElementById('wish').textContent = card.wish;
        //TODO: maybe there i will need to change something

        if(card.style != null) {
            const parsedCss = parseCSS(card.style);
            
            let cardId = document.getElementById('card');
            Object.entries(parsedCss['.card']).forEach(([property, value]) => {
                const parts = value.split(':').map(part => part.trim());
                cardId.style[parts[0]] = parts[1];
            });

            let cardHeaderId = document.getElementById('card-header');
            Object.entries(parsedCss['.card-header']).forEach(([property, value]) => {
                const parts = value.split(':').map(part => part.trim());
                cardHeaderId.style[parts[0]] = parts[1];
            });
        }
        if(card.image != null) {
            document.getElementById('card').style.backgroundImage = `url('data:image/jpeg;base64,${card.image}')`;
        }
    } else {
        addMessage({"success": false, "message": "No card data found"});
    }
});

function addMessage(message) {
    // Find the form element
    const form = document.getElementById('main-container');
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

function parseCSS(cssString) {
    const cssObject = {};
    const cssRules = cssString.split('}');

    cssRules.forEach(rule => {
        rule = rule.trim();
        if (!rule) return;

        const [selector, properties] = rule.split('{');
        if (!selector || !properties) return;

        const propertyPairs = properties.split(';').filter(Boolean);
        cssObject[selector.trim()] = propertyPairs.map(pair => pair.trim());
    });

    return cssObject;
}