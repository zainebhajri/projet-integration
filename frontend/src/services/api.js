/**
 * api.js — Toutes les fonctions d'appel à l'API Spring Boot.
 * Centraliser les appels ici simplifie la maintenance.
 */

const BASE_URL = "http://localhost:8080/api";

// ---- 1. LOGIN ----
export async function login(email, motDePasse) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, motDePasse }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur de connexion");
  return data; // { id, nom, prenom, email, role }
}

// ---- 2. CONSULTER PROFIL CHAUFFEUR ----
export async function getProfilChauffeur(utilisateurId) {
  const res = await fetch(`${BASE_URL}/chauffeur/profil/${utilisateurId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Profil introuvable");
  return data;
}

// ---- 3. MODIFIER PROFIL CHAUFFEUR ----
export async function updateProfilChauffeur(utilisateurId, payload) {
  const res = await fetch(`${BASE_URL}/chauffeur/profil/${utilisateurId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur lors de la mise à jour");
  return data;
}
