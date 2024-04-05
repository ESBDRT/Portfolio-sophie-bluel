// Requéte API login
function sendDataToAPI(event) {
    event.preventDefault(); // Prevent form submission

    var email = document.getElementById("emailInput").value;
    var password = document.getElementById("passwordInput").value;

    var formData = {
        email: email,
        password: password
    };

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            window.location.href ="index.html"
            return response.json();
        }
        else 
            throw new Error('Erreur dans l’identifiant ou le mot de passe');
    })
    .then(data => {
        console.log(data);
        var token = data.token;
        localStorage.setItem('token', token);
    })
}

// Restriction d'accés a la page login si déja connecté
function restrictLoginPage(){
    const token = localStorage.getItem('token');
        if (token) {
            // Redirect user to another page (e.g., index page)
            window.location.href = 'index.html';
        }
}

restrictLoginPage()

function isUserLoggedIn() {
    const token = localStorage.getItem('token');
    const loginButton = document.getElementById("login-btn");
    const logoutButton = document.getElementById("logout-btn");

    if (token !== null) {
        loginButton.style.display = "none";
        logoutButton.style.display = "block"; 
        loggedInDisplay()
    } else {
        logoutButton.style.display = "none";
        loginButton.style.display = "block";    
    }
}

isUserLoggedIn()