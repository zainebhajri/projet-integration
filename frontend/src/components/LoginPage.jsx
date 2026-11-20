import { useState } from "react";
import { login } from "../services/api";

/**
 * LoginPage — Formulaire de connexion.
 * Props :
 *   onLoginSuccess(user) : appelé quand le login réussit
 */
export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");

    // Validation côté front (champs vides)
    if (!email.trim() || !motDePasse.trim()) {
      setErreur("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, motDePasse);
      onLoginSuccess(user); // remonter l'utilisateur connecté
    } catch (err) {
      setErreur(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo / Titre */}
        <div style={styles.header}>
          <h2 style={styles.title}>Gestion de Flotte</h2>
          <p style={styles.subtitle}>Connectez-vous à votre espace</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e-mail "
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Mot de passe</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="*******"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Message d'erreur */}
          {erreur && <div style={styles.erreur}>⚠️ {erreur}</div>}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ---- Styles inline simples ----
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f4f8",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "40px 36px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    width: "100%",
    maxWidth: 400,
  },
  header: { textAlign: "center", marginBottom: 28 },
  logo: { fontSize: 40 },
  title: { margin: "8px 0 4px", color: "#1a3a5c", fontSize: 22, fontWeight: 700 },
  subtitle: { color: "#6b7280", fontSize: 14, margin: 0 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 14, fontWeight: 600, color: "#374151" },
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 15,
    outline: "none",
    transition: "border 0.2s",
  },
  erreur: {
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    color: "#dc2626",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
  },
  btn: {
    marginTop: 8,
    padding: "12px",
    background: "#1a3a5c",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
};
