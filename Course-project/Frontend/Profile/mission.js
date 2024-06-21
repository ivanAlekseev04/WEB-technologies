document.addEventListener("DOMContentLoaded", function() {
    
    const mission_text = document.getElementById('mission-text');

    fetch('../../Backend/API/mission.php', {
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
        const randomIndex = Math.floor(Math.random() * data['usernames'].length);
        const randomUsername = data['usernames'][randomIndex]['username'];
        mission_text.innerText = "Your mission is to send card to: " + randomUsername;
    })
    .catch(error => {
        addMessage(error);
    });
    
});
