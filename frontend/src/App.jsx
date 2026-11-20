import { useState } from "react";
import LoginPage from "./components/LoginPage";
import ProfilChauffeur from "./components/ProfilChauffeur";

/**
 * App.jsx — Point d'entrée principal.
 *
 * Logique de navigation simple :
 *   - Non connecté → LoginPage
 *   - Connecté role CH → ProfilChauffeur
 *   - Connecté role DG → Message Dashboard DG (Sprint 2)
 *   - Connecté role DR → Message Dashboard DR (Sprint 2)
 */
export default function App() {
  const [user, setUser] = useState(null); // null = non connecté

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // ---- Non connecté ----
  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // ---- Chauffeur ----
  if (user.role === "CH") {
    return <ProfilChauffeur utilisateurId={user.id} onLogout={handleLogout} />;
  }

  // ---- DG / DR — placeholder Sprint 2 ----
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4f8" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: "40px 48px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
        <h2 style={{ color: "#1a3a5c" }}>
          Bienvenue {user.prenom} {user.nom}
        </h2>
        <p style={{ color: "#6b7280" }}>Rôle : <strong>{user.role}</strong></p>
        <p style={{ color: "#6b7280", fontSize: 14 }}>
          🚧 Dashboard {user.role} — implémenté en Sprint 2
        </p>
        <button
          onClick={handleLogout}
          style={{ marginTop: 20, padding: "10px 24px", background: "#1a3a5c", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 15 }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}
