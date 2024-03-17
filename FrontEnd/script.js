// Fonction filtrage catégories
function filtering(categoryId) {
    const figures = document.querySelectorAll('#gallery figure');
    figures.forEach(figure => {
        if (categoryId === '0' || parseInt( figure.getAttribute('data-category-id')) == parseInt(categoryId)) {
            figure.style.display = 'block';
        } else {
            figure.style.display = 'none';
        }
    });
}

// Request API categories
fetch('http://localhost:5678/api/categories').then(response => {
    response.json().then(data => {
        let html = '<button class="btn" data-id="0">Tous</button>'; // Adding "Tous" button
        data.forEach(elt => {
            html += '<button class="btn" data-id="' + elt.id + '">' + elt.name + '</button>';
        });
        document.getElementById('filters').innerHTML = html;

        const buttons = document.querySelectorAll('#filters .btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const categoryId = this.getAttribute('data-id');
                filtering(categoryId);
            });      
        });       
    });    
});

// Request API works 
fetch('http://localhost:5678/api/works').then(response => {
    response.json().then(data => {
        let html = "";
        data.forEach(elt => {
            html += '<figure data-category-id="' + elt.category.id + '"><img src="'+elt.imageUrl+'" alt="'+elt.title+'"> <figcaption>'+elt.title+'</figcaption> </figure>';
        });
        document.getElementById('gallery').innerHTML = html;
    });
});

// Fonction login
function sendDataToAPI(event) {
    event.preventDefault(); // Prevent form submission

    // Retrieve input values
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

function clearStorage() {
    localStorage.removeItem('token'); // Si un token est trouvé, clear le localStorage
};

function updateLoginStatus() {
    var token = localStorage.getItem('token'); // Retrieve the token from localStorage
    var ulElement = document.getElementById("ul");

    if (token) {
        // User is logged in
        var logoutButton = document.createElement("a");
        logoutButton.href = "";
        logoutButton.textContent = "logout";
        logoutButton.onclick = function() { clearStorage(); };
        ulElement.appendChild(logoutButton);
    } else {
        // User is not logged in
        var loginButton = document.createElement("li");
        loginButton.href = "#";
        loginButton.textContent = "login";
        ulElement.appendChild(loginButton);
    }
}