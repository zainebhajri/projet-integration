import { useState, useEffect } from "react";
import { getProfilChauffeur, updateProfilChauffeur } from "../services/api";

/**
 * ProfilChauffeur — Consultation et modification du profil.
 * Props :
 *   utilisateurId : id de l'utilisateur connecté
 *   onLogout()    : appelé lors de la déconnexion
 */
export default function ProfilChauffeur({ utilisateurId, onLogout }) {
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");

  // Formulaire de modification
  const [form, setForm] = useState({
    telephone: "",
    email: "",
    categoriePermis: "",
    dateExpirationPermis: "",
  });

  // ---- Charger le profil au montage ----
  useEffect(() => {
    getProfilChauffeur(utilisateurId)
      .then((data) => {
        setProfil(data);
        setForm({
          telephone: data.telephone || "",
          email: data.email,
          categoriePermis: data.categoriePermis,
          dateExpirationPermis: data.dateExpirationPermis || "",
        });
      })
      .catch((e) => setErreur(e.message))
      .finally(() => setLoading(false));
  }, [utilisateurId]);

  // ---- Soumettre la modification ----
  const handleSave = async (e) => {
    e.preventDefault();
    setErreur("");
    setSucces("");

    // Validation : date d'expiration dans le futur
    if (form.dateExpirationPermis) {
      const dateExp = new Date(form.dateExpirationPermis);
      if (dateExp < new Date()) {
        setErreur("La date d'expiration du permis doit être dans le futur.");
        return;
      }
    }

    try {
      const updated = await updateProfilChauffeur(utilisateurId, form);
      setProfil(updated);
      setEditing(false);
      setSucces("✅ Profil mis à jour avec succès !");
    } catch (err) {
      setErreur(err.message);
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 60 }}>Chargement...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* En-tête */}
        <div style={styles.headerBar}>
          <div>
            <h2 style={styles.title}>👤 Mon Profil</h2>
            <p style={styles.subtitle}>Rôle : <strong>Chauffeur</strong></p>
          </div>
          <button onClick={onLogout} style={styles.logoutBtn}>Déconnexion</button>
        </div>

        {/* Alerte permis expiré */}
        {profil?.permisExpire && (
          <div style={styles.alertePermis}>
            ⚠️ Votre permis est <strong>expiré</strong>. Veuillez le renouveler.
          </div>
        )}

        {/* Messages */}
        {erreur && <div style={styles.erreur}>⚠️ {erreur}</div>}
        {succes && <div style={styles.succes}>{succes}</div>}

        {/* Vue consultation */}
        {!editing && profil && (
          <div style={styles.section}>
            <Row label="Nom" value={`${profil.prenom} ${profil.nom}`} />
            <Row label="Email" value={profil.email} />
            <Row label="Téléphone" value={profil.telephone || "—"} />
            <hr style={styles.hr} />
            <Row label="N° Permis" value={profil.numeroPermis} />
            <Row label="Catégorie" value={profil.categoriePermis} />
            <Row
              label="Expiration permis"
              value={profil.dateExpirationPermis}
              danger={profil.permisExpire}
            />
            <Row label="Disponible" value={profil.disponibilite ? "Oui ✅" : "Non 🔴"} />
            <Row label="Date recrutement" value={profil.dateRecrutement || "—"} />

            <button onClick={() => { setEditing(true); setSucces(""); setErreur(""); }}
                    style={styles.editBtn}>
              ✏️ Modifier mon profil
            </button>
          </div>
        )}

        {/* Formulaire de modification */}
        {editing && (
          <form onSubmit={handleSave} style={styles.form}>
            <Field label="Email" type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })} />

            <Field label="Téléphone" type="tel"
              value={form.telephone}
              onChange={(v) => setForm({ ...form, telephone: v })} />

            <Field label="Catégorie permis" type="text"
              value={form.categoriePermis}
              onChange={(v) => setForm({ ...form, categoriePermis: v })} />

            <Field label="Date expiration permis" type="date"
              value={form.dateExpirationPermis}
              onChange={(v) => setForm({ ...form, dateExpirationPermis: v })} />

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button type="submit" style={styles.saveBtn}>💾 Enregistrer</button>
              <button type="button" onClick={() => { setEditing(false); setErreur(""); }}
                      style={styles.cancelBtn}>
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ---- Sous-composants ----
function Row({ label, value, danger }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowLabel}>{label}</span>
      <span style={{ ...styles.rowValue, color: danger ? "#dc2626" : "#111827" }}>
        {value}
      </span>
    </div>
  );
}

function Field({ label, type, value, onChange }) {
  return (
    <div style={styles.field}>
      <label style={styles.fieldLabel}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      />
    </div>
  );
}

// ---- Styles ----
const styles = {
  page: { minHeight: "100vh", background: "#f0f4f8", display: "flex", justifyContent: "center", padding: "40px 16px" },
  card: { background: "#fff", borderRadius: 12, padding: "32px 36px", boxShadow: "0 4px 24px rgba(0,0,0,0.10)", width: "100%", maxWidth: 520 },
  headerBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title: { margin: 0, color: "#1a3a5c", fontSize: 22, fontWeight: 700 },
  subtitle: { margin: "4px 0 0", color: "#6b7280", fontSize: 14 },
  logoutBtn: { background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#475569", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 14 },
  alertePermis: { background: "#fef9c3", border: "1px solid #fbbf24", color: "#92400e", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 14 },
  erreur: { background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 14 },
  succes: { background: "#f0fdf4", border: "1px solid #86efac", color: "#16a34a", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 14 },
  section: { display: "flex", flexDirection: "column", gap: 2 },
  row: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f3f4f6" },
  rowLabel: { color: "#6b7280", fontSize: 14, fontWeight: 500 },
  rowValue: { fontSize: 14, fontWeight: 600 },
  hr: { margin: "8px 0", border: "none", borderTop: "2px solid #e5e7eb" },
  editBtn: { marginTop: 20, padding: "11px 20px", background: "#1a3a5c", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" },
  form: { display: "flex", flexDirection: "column", gap: 14, marginTop: 8 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  fieldLabel: { fontSize: 14, fontWeight: 600, color: "#374151" },
  input: { padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15 },
  saveBtn: { flex: 1, padding: "11px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" },
  cancelBtn: { flex: 1, padding: "11px", background: "#f1f5f9", color: "#374151", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" },
};
