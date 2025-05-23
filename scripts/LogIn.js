const formLogIn = document.querySelector("form"); // Sélection du formulaire

formLogIn.addEventListener('submit', async function(event) {
    event.preventDefault()  // chargement de la page 
    // Construire un objet avec les valeurs du formulaire
    const champsForm = {
        email: formLogIn.querySelector("[name=email]").value,
        password: formLogIn.querySelector("[name=password]").value
    };

    // Convertir l'objet en JSON
    const champsFormJson = JSON.stringify(champsForm);

    try {
        // Envoyer les informations avec POST à l'API
        const reponse = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: champsFormJson
        });
        console.log("Réponse du serveur :", reponse);

        // Vérifier si la réponse est dans les statuts 200, 201 ou 204
        if (reponse.status === 200) {
            const connexionAPI = await reponse.json();

            // Stocker le token dans le localStorage
            const token = connexionAPI.token;
            window.localStorage.setItem("token", token);

            console.log("Token stocké :", localStorage.getItem("token"));

            // Rediriger vers la page d'accueil
            window.location.href = "index.html";
        } else {
            console.error("Erreur d'identification :", reponse.status);
            alert("Échec de connexion. Vérifiez votre email et votre mot de passe.");
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Une erreur est survenue. Veuillez réessayer plus tard.");
    }
})

