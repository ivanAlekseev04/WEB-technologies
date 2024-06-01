let form = document.getElementById("registrationForm");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputs = Array.from(document.querySelectorAll("input"));
    const userData = {};
    inputs.forEach(i => {
        userData[i.name] = i.value;
    })

    fetch("../../../Backend/API/registration.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(res => {
        if(!res.ok) {
            return res.json().then(errorData => {
                throw new Error(errorData.message || 'Unknown error occurred');
            });
        }

        form.reset();
        //return res.json();
    })
    // .then(data => {
    //     console.log(data);
    // })
    .catch(err => {
        // console.error(err.message);
        alert(err.message);
    });
})