const gallery = document.querySelector('.gallery');
const boutons = document.querySelector('.boutons');
const modalContent = document.querySelector('.gallery-modal');


let works = []
let categories = []
const token = localStorage.getItem('token');

// La fonction qui récupére le projet depuis l'API
async function getWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    const data = await response.json();
    works = data
}

async function getCategories() {
    const response = await fetch('http://localhost:5678/api/categories');
    const data = await response.json();
    categories = data
}

//fonction qui affiche les élement works
function displayWorks(works) {
     gallery.innerHTML = ''; // vider la gallery avant de la reafficher
    works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement('figcaption');

        figcaption.textContent = work.title;
       
       
        img.src = work.imageUrl;
        img.alt = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    })
}

function displayWorksModal(works) {
     gallery.innerHTML = ''; // vider la gallery avant de la reafficher
    works.forEach(work => {
        const figure = document.createElement("figure");
        // const img = document.createElement("img");
        figure.textContent = work.title;
       
        // img.src = work.imageUrl;
        // img.alt = work.title;

        // figure.appendChild(img);
        modalContent.appendChild(figure);
    })
}

function dysplayOptions(categories) {
 // Remplir dynamiquement les catégories depuis les paramètres de l'API
    const categorySelect = document.getElementById("photo-category");
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });

}
//fonction pour récupérere les catégories depuis l'API
function displayCategories(categories) {
    // Ajouter le bouton "Tous"
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add('active');
    allButton.addEventListener('click', () => {
        const filters = document.querySelectorAll('.boutons button');
        filters.forEach(filter => filter.classList.remove('active'));
        allButton.classList.add('active');
        displayWorks(works); // Afficher toutes les œuvres
    });
    boutons.appendChild(allButton);
   
   
    categories.forEach(category => {       // ON a bouclé a l'aide de foreach aprés avoir déclaré les works et les catégories dans un tableau
        const button = document.createElement("button");
        button.textContent = category.name;

        button.addEventListener('click', () => {
           // Filtrer les œuvres par catégorie
            const filters = document.querySelectorAll('.boutons button');
            filters.forEach(filter => filter.classList.remove('active'));
            button.classList.add('active');
           const filteredWorks = works.filter(work => work.categoryId === category.id);
           displayWorks(filteredWorks); 
        })

        boutons.appendChild(button);
    })
}
// Fonction d'initialisation
async function init() {
    await getWorks();
    await getCategories();
    displayWorks(works);// Afficher toutes les œuvres par défaut
    displayWorksModal(works);
    displayCategories(categories);
    dysplayOptions(categories);
    // displayOptions(categories)
}

init()

const displayFirstModal = document.querySelector('.display-first-modal');
const firstModal = document.querySelector('#first-modal');
const secondModal = document.querySelector('#second-modal');
const closeModal = document.querySelector(".close");
const closeSecondModal = document.querySelector(".close-second");
const returnModal = document.querySelector(".go-back");
const galleryContainer = document.querySelector("#gallery-photos");
const addPhotoBtn = document.querySelector("#add-photo-btn");
const fileInput = document.querySelector("#file-input");
const submitPhotoBtn = document.querySelector("#submit-photo");
const photoPreview = document.querySelector("#photo-preview");
const loginButton = document.querySelector("#login");

if (token) {
    console.log('ceci est le mode admin')
    document.querySelector('.admin-panel').style.display = 'flex';
    boutons.style.display = 'none';
    displayFirstModal.style.display = 'block';
    
    loginButton.textContent = "logout";
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.reload();
    })


//ouvrir la premiére modal (galerie admin)
    displayFirstModal.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('appuie sur le bouton')
        firstModal.style.display = 'flex';
    })
}
// 🎨 Affichage des œuvres dans la **première modale**
function displayWorksModal(works) {
    modalContent.innerHTML = ''; // On vide la modale avant d'ajouter les éléments

    works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        // Remplir les éléments
        img.src = work.imageUrl;
        img.alt = work.title;
         

        figure.appendChild(img);
        figure.appendChild(figcaption);

  
        document.querySelector(".close").addEventListener("click", () => {
            document.getElementById("first-modal").style.display = "none";
        });

        // ✅ Si l'utilisateur est admin (token présent), afficher le bouton 🗑️
        if (token) {
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "🗑️"; // Icône de suppression
            deleteBtn.classList.add("delete-photo");

            // 🗑️ Ajouter l’événement de suppression
            deleteBtn.addEventListener("click", async () => {
                const confirmDelete = confirm("Voulez-vous vraiment supprimer cette image ?");
                if (confirmDelete) {
                    await deleteWork(work.id);
                }
            });

            figure.appendChild(deleteBtn);
        }

        modalContent.appendChild(figure);
    });
}

// 🗑️ Fonction pour supprimer une image (ADMIN SEULEMENT)
async function deleteWork(workId) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // 🔄 Mettre à jour la liste après suppression
            works = works.filter(work => work.id !== workId);
            displayWorks(works);       // Mettre à jour la galerie principale
            displayWorksModal(works);  // Mettre à jour la modale
            alert("Image supprimée avec succès !");
        } else {
            alert("Erreur lors de la suppression !");
        }
    } catch (error) {
        console.error("Erreur :", error);
        alert("Une erreur est survenue !");
    }
}

//fermer la pprmiére model
closeModal.addEventListener("click", () => {
    firstModal.style.display = "none";
});
//fermer en cliquant a l'extérieur 
window.addEventListener("click", (event) => {
    if (event.target === firstModal) {
        firstModal.style.display = "none";
    }
});
//ouvrire la modal d'ajout des photo
addPhotoBtn.addEventListener('click', (event) => {
    secondModal.style.display = 'flex';
    firstModal.style.display = 'none';
})
//retourne a la premiére modal depuis la seconde
returnModal.addEventListener('click', (event) => {
    firstModal.style.display = 'flex';
    secondModal.style.display = 'none';
});
//fermer la modal d'ajout de photo
closeSecondModal.addEventListener("click", () => {
    secondModal.style.display = "none";
});

async function loadGallery(){
    galleryContainer.innerHTML="";
    works.forEach(work=> {

        

    })
}
//deuxieme model 

  const photoInput = document.getElementById("photo-upload");
  const titleInput = document.getElementById("photo-title");
  const selectPhoto = document.getElementById("photo-category");
  const uploadBox = document.getElementById("image-upload");
  
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = "Aperçu de l'image";
        img.style.width = "50%"; // Ajuster la largeur de l'image
        img.style.height = "100%"; // Ajuster la hauteur de l'image
        img.style.objectFit = "cover"; // Ajuster le recadrage de l'image
        img.classList.add("preview-image");
        uploadBox.appendChild(img);
      };
      reader.readAsDataURL(file);
      toggleSubmitButton()
    }
  });

  const form = document.getElementById("add-photo-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // empêche le rechargement de la page
  
    const formData = new FormData(form);
  
    const token = localStorage.getItem("token"); // récupère le token d'authentification
  
    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      console.log(response)
  
      if (response.ok) {
          await getWorks(); // Récupérer les œuvres mises à jour
          displayWorks(works);       // Mettre à jour la galerie principale
          displayWorksModal(works);
          uploadBox.querySelector(".preview-image").remove(); // enlever l'image d'aperçu
          form.reset(); // reset le formulaire
          alert("Photo ajoutée avec succès !");
            secondModal.style.display = 'none'; // fermer la modale
            firstModal.style.display = 'flex'; // ouvrir la première modale
        // tu peux aussi rafraîchir la galerie ici
      } else {
        alert("Erreur lors de l'ajout de la photo");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur s'est produite");
    }
  });

  titleInput.addEventListener('input', () => {
    toggleSubmitButton();

  });

    selectPhoto.addEventListener('input', () => {
    toggleSubmitButton();
  });
    
  function toggleSubmitButton() {
    const isPhotoFilled = photoInput.files.length > 0;
    const isTitleFilled = titleInput.value.trim() !== '';
    const isCategorySelected = selectPhoto.value !== '';
    console.log(!(isTitleFilled && isCategorySelected))
    
    submitPhotoBtn.disabled = !(isPhotoFilled && isTitleFilled && isCategorySelected);

    if (isPhotoFilled && isTitleFilled && isCategorySelected) {
        submitPhotoBtn.style.backgroundColor = "#1D6154"; // Couleur de fond du bouton
        submitPhotoBtn.style.color = "#fff"; // Couleur du texte
        submitPhotoBtn.style.cursor = "pointer"; // Curseur en main
        return
    } 
    submitPhotoBtn.style.backgroundColor = "#A7A7A7"; // Couleur de fond du bouton
    submitPhotoBtn.style.cursor = "not-allowed"; // Curseur en main

  }

