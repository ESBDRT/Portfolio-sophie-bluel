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
    isUserLoggedIn()
    window.location.href ="login.html"
};

document.getElementById('logout-btn').addEventListener("click", clearStorage)

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

            const deleteBtns = document.querySelectorAll('.fa-trash-can');           
            deleteBtns.forEach(trash => {
                trash.addEventListener('click', (e) => {
                    var idToDelete = e.target.getAttribute('data-id')
                // deleteWork(e.target.getAttribute('data-id'))
               const toDelete = document.querySelectorAll('figure[data-id="'+idToDelete+'"]')
               toDelete.forEach(e => {
                e.remove()
               })
                })
            })         
}

document.getElementById('edit-banner').addEventListener("click", openPopup)
document.getElementById('div-edit').addEventListener("click", openPopup)




// Fermer popup
function closePopup() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup')

    overlay.style.visibility = "hidden"
    popup.style.display = "none"
}

function openFileUploadPopup() {
    const popup = document.getElementById('popup')
    const formHTML = `
      <form id="myForm" class="upload-popup">
      <h3 class="popup-title upload-title"> Ajout Photo </h3>
        <div>
          <input type="file" id="file class="btn" />
        </div>
        <div>
            <p class="upload-title">Titre</p>
          <input type="text" id="title" class="text-inputs"/>
        </div>
        <div>
            <p class="upload-title" >Catégorie</p>
          <input type="text" id="category" class="text-inputs" />
        </div>
        <div class="upload-div">
          <button type="button" class="btn" >Validate</button>
        </div>
      </form>
    `;

    document.getElementById('popup').innerHTML = formHTML;
}

document.getElementById('upload-btn').addEventListener("click", openFileUploadPopup)


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
        console.log(response)
        if (response.ok) {
            console.log("Work deleted successfully");
        } else {
            console.error("Failed to delete work");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}