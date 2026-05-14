import { useState } from "react";
import { creerJoueur, recupererJoueurs } from "../../api/backend";

function JoueurForm({ onJoueursUpdated }) {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    try {
      await creerJoueur(prenom, nom);
      const updated = await recupererJoueurs();
      onJoueursUpdated(updated);
      setPrenom("");
      setNom("");
      setMessage("✅ Joueur créé");
    } catch {
      setMessage("❌ Erreur création joueur");
    }
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Créer un joueur</h3>
      <form onSubmit={handleSubmit}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Prénom</label>
          <input
            style={styles.input}
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Nom</label>
          <input
            style={styles.input}
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </div>
        <button style={styles.btn} type="submit">Créer le joueur</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  card:       { background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 16 },
  title:      { fontSize: 15, fontWeight: 500, margin: "0 0 16px", color: "#111" },
  fieldGroup: { marginBottom: 12 },
  label:      { display: "block", fontSize: 11, color: "#888", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" },
  input:      { width: "100%", fontSize: 13, padding: "8px 12px", borderRadius: 8, border: "0.5px solid #ddd", boxSizing: "border-box" },
  btn:        { width: "100%", padding: "8px", borderRadius: 8, border: "none", background: "#E6F1FB", color: "#0C447C", fontWeight: 500, fontSize: 13, cursor: "pointer", marginTop: 4 },
  message:    { fontSize: 13, marginTop: 10, color: "#555" },
};

export default JoueurForm;
