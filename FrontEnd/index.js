// Requéte API Catégories
async function FetchCategories() {
    return await fetch('http://localhost:5678/api/categories').then(response => {
        return response.json()
    })
  }

// Requéte API Works  
async function FetchWorks() {
    return await fetch('http://localhost:5678/api/works').then(response => {
        return response.json()
    })
}

// Requéte Fetch Delete
async function deleteWork(id) {   
    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
        });
        if (!response.ok) { 
            console.error("Failed to delete work");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Filtrage 
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

// Créations boutons filtres
async function renderFilters() {
    const filters = await FetchCategories();
    let html = '<button class="btn" data-id="0">Tous</button>';
    filters.forEach(elt => {
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
}

renderFilters()

// Création galerie
async function renderGallery() {
    const works = await FetchWorks()
    let html = "";
    works.forEach(elt => {
        html += '<figure data-category-id="' + elt.category.id + '" data-id="' + elt.id + '"><img src="'+elt.imageUrl+'" alt="'+elt.title+'"> <figcaption>'+elt.title+'</figcaption> </figure>';
    });
    document.getElementById('gallery').innerHTML = html;
 }

renderGallery()

// Clear local storage
function clearStorage() {
    localStorage.removeItem('token'); 
};

document.getElementById('logout-btn').addEventListener("click", () => {
    clearStorage()
    window.location.href ="login.html"
})

// Fonction pour modifier l'affichage quand l'utilisateur est login
function loggedInDisplay() {
    const token = localStorage.getItem('token');
    const filters = document.getElementById("filters");
    const editBanner = document.getElementById("edit-banner");
    const divEdit = document.getElementById("div-edit");
    const overlay = document.getElementById("overlay");

    if (token !== null) {
        filters.style.display = "none";
        editBanner.style.display ="flex";
        divEdit.style.display ="flex"; 
        overlay.style.display ="block"
    }
}

// Fonction pour check si un token est présent et affiché les boutons login / logout
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


// Ouvrir popup
async function openPopup() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup')

    overlay.style.visibility = "visible"
    popup.style.display = "flex"

    const works = await FetchWorks()
    let html = "";
        works.forEach(elt => {
        html += '<figure data-id="' + elt.id + '"><span><i class="fa-solid fa-trash-can delete-logo" data-id="'+ elt.id +'" ></i><img src="'+elt.imageUrl+'" class="popup-images"></span></figure>';
    });
    document.getElementById('popup-gallery').innerHTML = html;

    const deleteBtns = document.querySelectorAll('.fa-trash-can');                          // On séléctionne tout les éléments avec cette classe     
    deleteBtns.forEach(trash => {
        trash.addEventListener('click', (e) => {                                                 // On ajoute les event listeners 
            var idToDelete = e.target.getAttribute('data-id')                                    // On récupére le data-id de l'élément cliqué
            deleteWork(e.target.getAttribute('data-id'))                                         // Réquéte API 
            const toDelete = document.querySelectorAll('figure[data-id="'+idToDelete+'"]')       // On définit ce qui doit étre supprimé 
            toDelete.forEach(e => {
                e.remove()
            })
        })
    })         
}

document.getElementById('div-edit').addEventListener("click", openPopup)

// Fermer popup
async function closePopup() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup')

    overlay.style.visibility = "hidden"
    popup.style.display = "none"
}

function reversePopup() {
    const form = document.getElementById('myForm')
    const gallery = document.getElementById('popup-gallery')
    const uploaddiv = document.getElementById('upload-div')
    const popuptitle = document.getElementById('popup-title')

    form.style.display ="none";
    gallery.style.display ="flex";
    uploaddiv.style.display ="flex"
    popuptitle.style.display ="block"
}

async function openFileUploadPopup(){
    const form = document.getElementById('myForm');
    const gallery = document.getElementById('popup-gallery');
    const uploaddiv = document.getElementById('upload-div');
    const popuptitle = document.getElementById('popup-title');

    form.style.display = "flex";
    gallery.style.display = "none";
    uploaddiv.style.display = "none";
    popuptitle.style.display = "none";

    const categories = await FetchCategories() 
    let html = "";
    categories.forEach(elt => {
        html += '<option value="'+ elt.id +'">"'+ elt.name +'"</option>'
    })
    document.getElementById('cats').innerHTML = html;
}

async function renderGallery() {
    const works = await FetchWorks()
    let html = "";
    works.forEach(elt => {
        html += '<figure data-category-id="' + elt.category.id + '" data-id="' + elt.id + '"><img src="'+elt.imageUrl+'" alt="'+elt.title+'"> <figcaption>'+elt.title+'</figcaption> </figure>';
    });
    document.getElementById('gallery').innerHTML = html;
 }

document.getElementById('upload-btn').addEventListener("click", openFileUploadPopup)

function previewFile() {
    const preview = document.getElementById('button-upload-div');
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        const imagelogo = document.getElementById('image-logo')
        const file = document.getElementById('file')
        const filelabel = document.getElementById('file-label')
        const filep = document.getElementById('file-p')

        imagelogo.style.display ='none'
        file.style.display = 'none'
        filelabel.style.display = 'none'
        filep.style.display = 'none'

        preview.style.backgroundImage = `url(${reader.result})`;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.style.backgroundImage = null;
    } 
}

function addWork() {   

    var formData = new FormData();
        
        // Retrieve input values
        var title = document.getElementById('title').value;
        var cat = document.getElementById('cats').value;
        
        // Add fields to the FormData object
        formData.append('title', title);
        formData.append('category', cat);
        
        // Add files to the FormData object
        var fileInput = document.getElementById('file'); 
        var file = fileInput.files[0];
        formData.append('image', file);

        var headers = new Headers();
        headers.append("Authorization", "Bearer " + localStorage.getItem('token'));

    try {
            fetch(`http://localhost:5678/api/works`, {
            method: "POST",
            body: formData,
            headers: headers               
        });
    } catch (error) {
        console.error("An error occurred:", error);
    }
    renderGallery()
    reversePopup()
    openPopup()
}