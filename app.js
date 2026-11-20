// ================================================================
// app.js – Logique principale de FlotteApp
// ================================================================
//
// Ce fichier est divisé en 10 parties claires :
//   1. Données initiales (utilisateurs & chauffeurs)
//   2. localStorage — sauvegarder et lire les données
//   3. Connexion et déconnexion
//   4. Navigation — afficher la bonne page
//   5. Page Directeur Général (DG)
//   6. Page Directeur Régional (DR)
//   7. Page Chauffeur — profil
//   8. Modale — ajouter / modifier un chauffeur
//   9. Supprimer un chauffeur
//  10. Démarrage de l'application
// ================================================================


// ================================================================
// 1. DONNÉES INITIALES
//    Ces tableaux remplacent une base de données.
//    On les stocke dans localStorage pour qu'ils persistent.
// ================================================================

// Les 3 utilisateurs qui peuvent se connecter
const UTILISATEURS = [
  {
    id: 1,
    nom:        "Benali",
    prenom:     "Ahmed",
    login:      "dg",
    motDePasse: "dg123",
    role:       "DG",          // Directeur Général
    telephone:  "0770000001",
    actif:      true
  },
  {
    id: 2,
    nom:        "Mansouri",
    prenom:     "Leila",
    login:      "dr",
    motDePasse: "dr123",
    role:       "DR",          // Directeur Régional
    telephone:  "0770000002",
    region:     "Alger",
    actif:      true
  },
  {
    id: 3,
    nom:        "Hamdi",
    prenom:     "Omar",
    login:      "chauffeur",
    motDePasse: "ch123",
    role:       "CH",          // Chauffeur
    telephone:  "0770000003",
    region:     "Alger",
    actif:      true
  }
];

// Les chauffeurs enregistrés dans le système
const CHAUFFEURS_INITIAUX = [
  {
    id:                   10,
    nom:                  "Hamdi",
    prenom:               "Omar",
    login:                "chauffeur",
    motDePasse:           "ch123",
    telephone:            "0770000003",
    region:               "Alger",
    numeroPermis:         "AL-2021-456",
    categoriePermis:      "B",
    dateExpirationPermis: "2027-05-10",
    disponible:           true,
    dateRecrutement:      "2021-03-15"
  },
  {
    id:                   11,
    nom:                  "Kaci",
    prenom:               "Sofiane",
    login:                "sofiane",
    motDePasse:           "ch456",
    telephone:            "0661234567",
    region:               "Oran",
    numeroPermis:         "OR-2019-123",
    categoriePermis:      "C",
    dateExpirationPermis: "2024-11-30",   // ⚠️ Permis expiré !
    disponible:           false,
    dateRecrutement:      "2019-06-01"
  },
  {
    id:                   12,
    nom:                  "Rahmani",
    prenom:               "Fatima",
    login:                "fatima",
    motDePasse:           "ch789",
    telephone:            "0551234567",
    region:               "Constantine",
    numeroPermis:         "CO-2023-789",
    categoriePermis:      "B",
    dateExpirationPermis: "2028-03-20",
    disponible:           true,
    dateRecrutement:      "2023-01-10"
  }
];


// ================================================================
// 2. LOCALSTORAGE — Lire et sauvegarder les données
//    localStorage = stockage du navigateur (comme une mini BD)
// ================================================================

// Appelé une seule fois au démarrage pour initialiser les données
function initialiserDonnees() {
  // Si les chauffeurs n'existent pas encore → les créer
  if (!localStorage.getItem("chauffeurs")) {
    localStorage.setItem("chauffeurs", JSON.stringify(CHAUFFEURS_INITIAUX));
  }
}

// Lire tous les chauffeurs depuis le navigateur
function lireChauffeurs() {
  return JSON.parse(localStorage.getItem("chauffeurs")) || [];
}

// Sauvegarder tous les chauffeurs dans le navigateur
function sauvegarderChauffeurs(chauffeurs) {
  localStorage.setItem("chauffeurs", JSON.stringify(chauffeurs));
}


// ================================================================
// 3. CONNEXION & DÉCONNEXION
// ================================================================

// Écouter la soumission du formulaire de connexion
document.getElementById("form-login").addEventListener("submit", function(e) {
  e.preventDefault(); // ← Empêche le rechargement de la page

  // Récupérer ce que l'utilisateur a tapé
  const loginSaisi   = document.getElementById("login").value.trim();
  const mdpSaisi     = document.getElementById("motdepasse").value.trim();
  const zoneErreur   = document.getElementById("login-erreur");

  // Chercher l'utilisateur dans notre tableau UTILISATEURS
  const utilisateur = UTILISATEURS.find(
    u => u.login === loginSaisi && u.motDePasse === mdpSaisi && u.actif
  );

  if (!utilisateur) {
    // ❌ Identifiants incorrects → afficher un message d'erreur
    zoneErreur.textContent   = "❌ Login ou mot de passe incorrect. Vérifiez vos identifiants.";
    zoneErreur.style.display = "block";
    return; // Arrêter ici
  }

  // ✅ Connexion réussie → sauvegarder l'utilisateur connecté
  localStorage.setItem("utilisateurConnecte", JSON.stringify(utilisateur));
  zoneErreur.style.display = "none";

  // Rediriger vers la bonne page selon le rôle
  if (utilisateur.role === "DG") afficherPageDG(utilisateur);
  if (utilisateur.role === "DR") afficherPageDR(utilisateur);
  if (utilisateur.role === "CH") afficherPageChauffeur(utilisateur);
});

// Remplir automatiquement le formulaire (boutons de démonstration)
function remplirLogin(login, mdp) {
  document.getElementById("login").value      = login;
  document.getElementById("motdepasse").value = mdp;
}

// Déconnexion : effacer la session et retourner au login
function deconnecter() {
  localStorage.removeItem("utilisateurConnecte");
  afficherPage("page-login");
  // Vider le formulaire de connexion
  document.getElementById("login").value      = "";
  document.getElementById("motdepasse").value = "";
}


// ================================================================
// 4. NAVIGATION — Afficher la bonne page
//    On cache toutes les pages et on affiche seulement celle voulue
// ================================================================

function afficherPage(idPage) {
  // Étape 1 : cacher toutes les pages
  document.querySelectorAll(".page").forEach(function(page) {
    page.classList.remove("active");
  });
  // Étape 2 : afficher uniquement la page demandée
  document.getElementById(idPage).classList.add("active");
}


// ================================================================
// 5. PAGE DIRECTEUR GÉNÉRAL (DG)
//    Affiche les statistiques et la liste de tous les chauffeurs
// ================================================================

function afficherPageDG(utilisateur) {
  afficherPage("page-dg");

  // Afficher le prénom + nom dans la barre supérieure
  document.getElementById("dg-nom").textContent = utilisateur.prenom + " " + utilisateur.nom;

  // Charger les chauffeurs et les afficher dans le tableau
  const chauffeurs = lireChauffeurs();
  document.getElementById("dg-total-chauffeurs").textContent = chauffeurs.length;

  const tbody = document.getElementById("dg-chauffeurs-body");
  tbody.innerHTML = ""; // Vider le tableau avant de le remplir

  // Pour chaque chauffeur, créer une ligne dans le tableau
  chauffeurs.forEach(function(ch) {
    const permisExpire = new Date(ch.dateExpirationPermis) < new Date();

    const ligne = document.createElement("tr");
    ligne.innerHTML = `
      <td>${ch.prenom} ${ch.nom}</td>
      <td>${ch.numeroPermis}</td>
      <td>${ch.categoriePermis}</td>
      <td>${ch.region}</td>
      <td>
        <span class="badge ${ch.disponible ? 'badge-disponible' : 'badge-indisponible'}">
          ${ch.disponible ? '✅ Disponible' : '❌ Indisponible'}
        </span>
        ${permisExpire ? '<span class="badge badge-expire" style="margin-left:.4rem;">⚠️ Permis expiré</span>' : ''}
      </td>
    `;
    tbody.appendChild(ligne);
  });
}


// ================================================================
// 6. PAGE DIRECTEUR RÉGIONAL (DR)
//    Affiche et gère les chauffeurs de sa région (CRUD)
// ================================================================

function afficherPageDR(utilisateur) {
  afficherPage("page-dr");
  document.getElementById("dr-nom").textContent = utilisateur.prenom + " " + utilisateur.nom;
  chargerTableauChauffeursDR(); // Remplir le tableau des chauffeurs
}

// Remplir le tableau des chauffeurs (page DR)
function chargerTableauChauffeursDR() {
  const chauffeurs = lireChauffeurs();
  const tbody      = document.getElementById("dr-chauffeurs-body");
  tbody.innerHTML  = "";

  // Si aucun chauffeur → afficher un message
  if (chauffeurs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; color:var(--texte-gris); padding:2rem;">
          Aucun chauffeur enregistré. Cliquez sur "Ajouter" pour commencer.
        </td>
      </tr>`;
    return;
  }

  // Créer une ligne pour chaque chauffeur
  chauffeurs.forEach(function(ch) {
    const permisExpire = new Date(ch.dateExpirationPermis) < new Date();

    const ligne = document.createElement("tr");
    ligne.innerHTML = `
      <td>${ch.nom}</td>
      <td>${ch.prenom}</td>
      <td>${ch.numeroPermis}</td>
      <td>${ch.categoriePermis}</td>
      <td>
        ${ch.dateExpirationPermis}
        ${permisExpire ? '<span class="badge badge-expire" style="margin-left:.4rem;">⚠️ Expiré</span>' : ''}
      </td>
      <td>
        <span class="badge ${ch.disponible ? 'badge-disponible' : 'badge-indisponible'}">
          ${ch.disponible ? '✅ Oui' : '❌ Non'}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-primaire" onclick="ouvrirModalModification(${ch.id})">
          ✏️ Modifier
        </button>
        <button class="btn btn-sm btn-danger" onclick="supprimerChauffeur(${ch.id})" style="margin-left:.5rem;">
          🗑️ Supprimer
        </button>
      </td>
    `;
    tbody.appendChild(ligne);
  });
}


// ================================================================
// 7. PAGE CHAUFFEUR — Profil
//    Le chauffeur voit et modifie son propre profil
// ================================================================

function afficherPageChauffeur(utilisateur) {
  afficherPage("page-chauffeur");

  // Chercher les données complètes du chauffeur dans la liste
  const chauffeurs = lireChauffeurs();
  const profil = chauffeurs.find(ch => ch.login === utilisateur.login) || utilisateur;

  // Afficher les initiales dans l'avatar (ex: "Omar Hamdi" → "OH")
  const initiales = (profil.prenom[0] + profil.nom[0]).toUpperCase();
  document.getElementById("ch-initiales").textContent = initiales;

  // Remplir la carte de profil (côté gauche)
  document.getElementById("ch-nom-complet").textContent  = profil.prenom + " " + profil.nom;
  document.getElementById("ch-telephone").textContent    = profil.telephone || "—";
  document.getElementById("ch-region").textContent       = profil.region || "—";
  document.getElementById("ch-recrutement").textContent  = profil.dateRecrutement || "—";

  // Remplir les cartes de permis (bas de page)
  document.getElementById("ch-permis-numero").textContent    = profil.numeroPermis || "—";
  document.getElementById("ch-permis-categorie").textContent = profil.categoriePermis || "—";
  document.getElementById("ch-permis-expiration").textContent= profil.dateExpirationPermis || "—";
  document.getElementById("ch-disponibilite").textContent    = profil.disponible ? "✅ Disponible" : "❌ Indisponible";

  // Pré-remplir le formulaire de modification (côté droit)
  document.getElementById("ch-edit-nom").value        = profil.nom || "";
  document.getElementById("ch-edit-prenom").value     = profil.prenom || "";
  document.getElementById("ch-edit-telephone").value  = profil.telephone || "";
  document.getElementById("ch-edit-permis").value     = profil.numeroPermis || "";
  document.getElementById("ch-edit-categorie").value  = profil.categoriePermis || "B";
  document.getElementById("ch-edit-expiration").value = profil.dateExpirationPermis || "";
}

// Sauvegarder les modifications du profil chauffeur
function sauvegarderProfil(e) {
  e.preventDefault();

  // Récupérer l'utilisateur actuellement connecté
  const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));
  const chauffeurs  = lireChauffeurs();
  const index       = chauffeurs.findIndex(ch => ch.login === utilisateur.login);

  if (index === -1) {
    afficherMessageChauffeur("❌ Profil introuvable.", "rouge");
    return;
  }

  // Mettre à jour les champs du chauffeur
  chauffeurs[index].nom                  = document.getElementById("ch-edit-nom").value.trim();
  chauffeurs[index].prenom               = document.getElementById("ch-edit-prenom").value.trim();
  chauffeurs[index].telephone            = document.getElementById("ch-edit-telephone").value.trim();
  chauffeurs[index].numeroPermis         = document.getElementById("ch-edit-permis").value.trim();
  chauffeurs[index].categoriePermis      = document.getElementById("ch-edit-categorie").value;
  chauffeurs[index].dateExpirationPermis = document.getElementById("ch-edit-expiration").value;

  // Sauvegarder dans localStorage
  sauvegarderChauffeurs(chauffeurs);

  // Rafraîchir l'affichage du profil
  afficherPageChauffeur(utilisateur);

  // Afficher un message de succès
  afficherMessageChauffeur("✅ Profil mis à jour avec succès !", "vert");
}

// Afficher un message temporaire sur la page chauffeur
function afficherMessageChauffeur(texte, couleur) {
  const zone         = document.getElementById("ch-message");
  zone.textContent   = texte;
  zone.className     = "alerte alerte-" + couleur;
  zone.style.display = "block";
  // Masquer automatiquement après 3 secondes
  setTimeout(function() { zone.style.display = "none"; }, 3000);
}


// ================================================================
// 8. MODALE — Ajouter / Modifier un chauffeur (DR)
//    La modale est une fenêtre pop-up avec un formulaire
// ================================================================

// Ouvrir la modale pour AJOUTER un nouveau chauffeur
function ouvrirModalAjout() {
  document.getElementById("modal-titre").textContent = "➕ Ajouter un chauffeur";
  document.getElementById("modal-id").value          = "";  // Vide = mode ajout
  document.getElementById("form-chauffeur").reset();        // Vider tous les champs
  document.getElementById("modal-message").style.display = "none";
  document.getElementById("modal-chauffeur").style.display = "flex";
}

// Ouvrir la modale pour MODIFIER un chauffeur existant
function ouvrirModalModification(id) {
  const chauffeurs = lireChauffeurs();
  const ch         = chauffeurs.find(c => c.id === id); // Trouver le chauffeur par son ID

  if (!ch) return;

  // Changer le titre de la modale
  document.getElementById("modal-titre").textContent = "✏️ Modifier le chauffeur";
  document.getElementById("modal-id").value          = ch.id; // Mémoriser l'ID

  // Pré-remplir les champs avec les données existantes
  document.getElementById("modal-nom").value        = ch.nom;
  document.getElementById("modal-prenom").value     = ch.prenom;
  document.getElementById("modal-telephone").value  = ch.telephone;
  document.getElementById("modal-login").value      = ch.login;
  document.getElementById("modal-permis").value     = ch.numeroPermis;
  document.getElementById("modal-categorie").value  = ch.categoriePermis;
  document.getElementById("modal-expiration").value = ch.dateExpirationPermis;
  document.getElementById("modal-recrutement").value= ch.dateRecrutement || "";
  document.getElementById("modal-region").value     = ch.region || "Alger";

  document.getElementById("modal-message").style.display = "none";
  document.getElementById("modal-chauffeur").style.display = "flex";
}

// Fermer la modale
function fermerModal() {
  document.getElementById("modal-chauffeur").style.display = "none";
}

// Sauvegarder le formulaire de la modale (Ajout OU Modification)
function sauvegarderChauffeur(e) {
  e.preventDefault();

  const chauffeurs  = lireChauffeurs();
  const idExistant  = document.getElementById("modal-id").value; // "" si ajout, sinon l'ID

  // Lire toutes les valeurs saisies dans le formulaire
  const donnees = {
    nom:                  document.getElementById("modal-nom").value.trim(),
    prenom:               document.getElementById("modal-prenom").value.trim(),
    telephone:            document.getElementById("modal-telephone").value.trim(),
    login:                document.getElementById("modal-login").value.trim(),
    motDePasse:           document.getElementById("modal-mdp").value.trim() || "ch000",
    numeroPermis:         document.getElementById("modal-permis").value.trim(),
    categoriePermis:      document.getElementById("modal-categorie").value,
    dateExpirationPermis: document.getElementById("modal-expiration").value,
    dateRecrutement:      document.getElementById("modal-recrutement").value,
    region:               document.getElementById("modal-region").value,
    disponible:           true
  };

  // ✅ Vérification : le numéro de permis doit être unique
  const permisDejaUtilise = chauffeurs.find(
    ch => ch.numeroPermis === donnees.numeroPermis && ch.id !== parseInt(idExistant)
  );

  if (permisDejaUtilise) {
    const zone         = document.getElementById("modal-message");
    zone.textContent   = "❌ Ce numéro de permis est déjà utilisé par un autre chauffeur.";
    zone.style.display = "block";
    return; // Arrêter ici
  }

  if (idExistant) {
    // --- MODE MODIFICATION ---
    const index = chauffeurs.findIndex(ch => ch.id === parseInt(idExistant));
    if (index !== -1) {
      // Fusionner les nouvelles données avec les données existantes
      chauffeurs[index] = Object.assign({}, chauffeurs[index], donnees);
    }
  } else {
    // --- MODE AJOUT ---
    // Générer un nouvel ID unique (max existant + 1)
    const idsExistants = chauffeurs.map(c => c.id);
    const nouvelId     = idsExistants.length > 0 ? Math.max(...idsExistants) + 1 : 1;
    chauffeurs.push(Object.assign({ id: nouvelId }, donnees));
  }

  // Sauvegarder et fermer
  sauvegarderChauffeurs(chauffeurs);
  fermerModal();
  chargerTableauChauffeursDR(); // Rafraîchir le tableau
}


// ================================================================
// 9. SUPPRIMER UN CHAUFFEUR (DR)
// ================================================================

function supprimerChauffeur(id) {
  // Demander une confirmation avant de supprimer
  const confirme = confirm("Voulez-vous vraiment supprimer ce chauffeur ? Cette action est irréversible.");

  if (!confirme) return; // L'utilisateur a annulé

  let chauffeurs = lireChauffeurs();

  // Garder tous les chauffeurs sauf celui avec cet ID
  chauffeurs = chauffeurs.filter(function(ch) {
    return ch.id !== id;
  });

  sauvegarderChauffeurs(chauffeurs);
  chargerTableauChauffeursDR(); // Rafraîchir le tableau
}


// ================================================================
// 10. DÉMARRAGE DE L'APPLICATION
//     Ce code s'exécute au chargement de la page
// ================================================================

// Initialiser les données au premier lancement
initialiserDonnees();

// Vérifier si un utilisateur est déjà connecté (session précédente)
const sessionEnCours = localStorage.getItem("utilisateurConnecte");

if (sessionEnCours) {
  // Un utilisateur était connecté → le rediriger directement
  const u = JSON.parse(sessionEnCours);
  if (u.role === "DG") afficherPageDG(u);
  if (u.role === "DR") afficherPageDR(u);
  if (u.role === "CH") afficherPageChauffeur(u);
} else {
  // Pas de session → afficher la page de connexion
  afficherPage("page-login");
}
