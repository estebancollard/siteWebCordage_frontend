import { useState } from "react";
import { creerCordage, supprimerCordage, recupererCordages } from "../../api/backend";

function CordagePanel({ cordages, typesCordage, onCordagesUpdated }) {
  const [marque, setMarque]   = useState("");
  const [nom, setNom]         = useState("");
  const [jauge, setJauge]     = useState("");
  const [type, setType]       = useState("");
  const [message, setMessage] = useState("");

  async function handleAdd(e) {
    e.preventDefault();
    setMessage("");
    try {
      await creerCordage(marque, nom, type, jauge);
      const updated = await recupererCordages();
      onCordagesUpdated(updated);
      setMarque(""); setNom(""); setJauge(""); setType("");
      setMessage("✅ Cordage ajouté");
    } catch {
      setMessage("❌ Erreur ajout cordage");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer ce cordage ?")) return;
    try {
      await supprimerCordage(id);
      const updated = await recupererCordages();
      onCordagesUpdated(updated);
      setMessage("✅ Cordage supprimé");
    } catch {
      setMessage("❌ Erreur suppression cordage");
    }
  }

  return (
    <div>
      {/* Formulaire ajout */}
      <div style={styles.card}>
        <h3 style={styles.title}>Ajouter un cordage</h3>
        <form onSubmit={handleAdd}>
          <div style={styles.grid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Marque</label>
              <input style={styles.input} placeholder="Marque" value={marque} onChange={(e) => setMarque(e.target.value)} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Nom</label>
              <input style={styles.input} placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Jauge</label>
              <input style={styles.input} placeholder="ex: 1.25" value={jauge} onChange={(e) => setJauge(e.target.value)} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Type</label>
              <select style={styles.input} value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Sélectionner...</option>
                {typesCordage.map((t) => (
                  <option key={t.enumlabel} value={t.enumlabel}>{t.enumlabel}</option>
                ))}
              </select>
            </div>
          </div>
          <button style={styles.btn} type="submit">Ajouter le cordage</button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>

      {/* Liste cordages */}
      <div style={styles.card}>
        <h3 style={styles.title}>Cordages enregistrés</h3>
        {cordages.length === 0 ? (
          <p style={styles.empty}>Aucun cordage enregistré</p>
        ) : (
          cordages.map((c) => (
            <div key={c.id} style={styles.row}>
              <div>
                <span style={styles.cordageName}>{c.marque} {c.nom}</span>
                <span style={styles.cordageSub}> — {c.jauge} mm · {c.type}</span>
              </div>
              <button style={styles.deleteBtn} onClick={() => handleDelete(c.id)}>Supprimer</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  card:        { background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 16 },
  title:       { fontSize: 15, fontWeight: 500, margin: "0 0 16px", color: "#111" },
  grid:        { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 },
  fieldGroup:  { marginBottom: 0 },
  label:       { display: "block", fontSize: 11, color: "#888", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" },
  input:       { width: "100%", fontSize: 13, padding: "8px 12px", borderRadius: 8, border: "0.5px solid #ddd", boxSizing: "border-box" },
  btn:         { width: "100%", padding: "8px", borderRadius: 8, border: "none", background: "#E6F1FB", color: "#0C447C", fontWeight: 500, fontSize: 13, cursor: "pointer" },
  message:     { fontSize: 13, marginTop: 10, color: "#555" },
  row:         { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "0.5px solid #f0f0f0" },
  cordageName: { fontSize: 13, fontWeight: 500, color: "#111" },
  cordageSub:  { fontSize: 12, color: "#888" },
  deleteBtn:   { fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "0.5px solid #ddd", background: "transparent", color: "#c00", cursor: "pointer" },
  empty:       { fontSize: 13, color: "#aaa" },
};

export default CordagePanel;
