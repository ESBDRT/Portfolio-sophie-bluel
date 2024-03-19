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
        isUserLoggedIn()
    })
}

// Fonction pour clear le local Storage
function clearStorage() {
    localStorage.removeItem('token'); 
    isUserLoggedIn()
    window.location.href ="login.html"
};

// Fonction pour modifier l'affichage quand l'utilisateur est login
function loggedInDisplay() {
    const token = localStorage.getItem('token');
    const filters = document.getElementById("filters");
    const editBanner = document.getElementById("edit-banner");
    const divEdit = document.getElementById("div-edit");
    const overlay = document.getElementById("overlay");
    const popup = document.getElementById("popup");

    if (token !== null) {
        filters.style.display = "none";
        editBanner.style.display ="flex";
        divEdit.style.display ="flex"; 
        overlay.style.display ="block"
    }
}

// Fonction pour check si un token est présent est affiché les boutons login / logout
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

// Request api works pour la popup
function FetchPopup() {
    fetch('http://localhost:5678/api/works').then(response => {
    response.json().then(data => {
        console.log(data)
        let html = "";
        data.forEach(elt => {
            html += '<a><img src="' + elt.imageUrl + '" class="popup-images"><i class="fa-solid fa-trash-can delete-logo"></i></a>'
        });
        document.getElementById('popup-gallery').innerHTML = html;
    });
});}

// Fonction pour ouvrir la popup
function openPopup() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup')

    overlay.style.visibility = "visible"
    popup.style.display = "flex"
    FetchPopup()
}

// Fonction pour fermer la popup
function closePopup() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup')

    overlay.style.visibility = "hidden"
    popup.style.display = "none"
}