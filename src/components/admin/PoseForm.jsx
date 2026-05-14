import { useState, useMemo } from "react";
import { creerPose } from "../../api/backend";
import Autocomplete from "../ui/Autocomplete";

// ─── Helper : grouper les cordages par marque+nom ────────────────────────────
function grouperCordages(cordages) {
  const map = {};
  cordages.forEach((c) => {
    const key = `${c.marque}|${c.nom}`;
    if (!map[key]) {
      map[key] = { id: key, label: `${c.marque} ${c.nom}`, jauges: [] };
    }
    map[key].jauges.push({ id: c.id, jauge: c.jauge });
  });
  Object.values(map).forEach((g) => {
    g.jauges.sort((a, b) => parseFloat(a.jauge) - parseFloat(b.jauge));
  });
  return Object.values(map);
}

// ─── Sélecteur de cordage : autocomplete + boutons jauge ─────────────────────
function CordageSelector({ cordages, value, onChange, placeholder }) {
  const grouped  = useMemo(() => grouperCordages(cordages), [cordages]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Quand on choisit un cordage dans l'autocomplete
  function handleSelectGroup(item) {
    setSelectedGroup(item);
    onChange(""); // reset la jauge
  }

  // Quand on change de cordage (✕)
  function handleClearGroup() {
    setSelectedGroup(null);
    onChange("");
  }

  // Jauges disponibles pour le cordage sélectionné
  const jauges = selectedGroup
    ? grouped.find((g) => g.id === selectedGroup.id)?.jauges ?? []
    : [];

  return (
    <div>
      <Autocomplete
        items={grouped}
        selected={selectedGroup}
        onSelect={(item) => item ? handleSelectGroup(item) : handleClearGroup()}
        placeholder={placeholder}
      />

      {/* Boutons de jauge */}
      {selectedGroup && jauges.length > 0 && (
        <div style={styles.jaugeRow}>
          {jauges.map((j) => (
            <button
              key={j.id}
              type="button"
              style={{
                ...styles.jaugeBtn,
                ...(value === String(j.id) ? styles.jaugeBtnActive : {}),
              }}
              onClick={() => onChange(String(j.id))}
            >
              {j.jauge} mm
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PoseForm ─────────────────────────────────────────────────────────────────
function PoseForm({ joueurs, cordages }) {
  const [joueurSelectionne, setJoueurSelectionne] = useState(null);
  const [raquette, setRaquette]       = useState("");
  const [cordageM, setCordageM]       = useState("");
  const [cordageT, setCordageT]       = useState("");
  const [tensionM, setTensionM]       = useState("");
  const [tensionT, setTensionT]       = useState("");
  const [datePose, setDatePose]       = useState(new Date().toISOString().split("T")[0]);
  const [memeCordage, setMemeCordage] = useState(true);
  const [memeTension, setMemeTension] = useState(true);
  const [message, setMessage]         = useState("");

  const joueurItems = joueurs.map((j) => ({
    id: j.id,
    label: `${j.prenom} ${j.nom}`,
  }));

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!joueurSelectionne) { setMessage("❌ Sélectionne un joueur"); return; }
    if (!cordageM)          { setMessage("❌ Sélectionne un cordage et une jauge pour le montant"); return; }
    if (!tensionM)          { setMessage("❌ Renseigne la tension montant"); return; }
    if (!memeCordage && !cordageT) { setMessage("❌ Sélectionne un cordage travers"); return; }

    try {
      await creerPose({
        joueur_id:          joueurSelectionne.id,
        date_pose:          datePose,
        modele_raquette:    raquette,
        cordage_montant_id: Number(cordageM),
        cordage_travers_id: memeCordage ? null : Number(cordageT),
        tension_montant:    Number(tensionM),
        tension_travers:    memeTension ? null : Number(tensionT) || null,
      });

      setRaquette(""); setCordageM(""); setCordageT("");
      setTensionM(""); setTensionT("");
      setMemeCordage(true); setMemeTension(true);
      setDatePose(new Date().toISOString().split("T")[0]); // remet à aujourd'hui
      setMessage("✅ Pose enregistrée");
    } catch {
      setMessage("❌ Erreur création pose");
    }
  }

  const etape2Active = !!joueurSelectionne;

  return (
    <div>
      {/* ── Étape 1 : joueur ── */}
      <div style={styles.stepRow}>
        <div style={{ ...styles.stepNum, ...(etape2Active ? styles.stepDone : {}) }}>
          {etape2Active ? "✓" : "1"}
        </div>
        <div style={styles.stepContent}>
          <div style={styles.stepLabel}>Sélectionner un joueur</div>
          <div style={{ marginTop: 8 }}>
            <Autocomplete
              items={joueurItems}
              selected={joueurSelectionne}
              onSelect={setJoueurSelectionne}
              placeholder="Rechercher un joueur..."
            />
          </div>
        </div>
      </div>

      <div style={styles.connector} />

      {/* ── Étape 2 : pose ── */}
      <div style={{ ...styles.stepRow, opacity: etape2Active ? 1 : 0.4, pointerEvents: etape2Active ? "auto" : "none" }}>
        <div style={styles.stepNum}>2</div>
        <div style={styles.stepContent}>
          <div style={styles.stepLabel}>Renseigner la pose</div>

          <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>

            {/* Date de la pose */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Date de pose</label>
              <input
                style={styles.input}
                type="date"
                value={datePose}
                onChange={(e) => setDatePose(e.target.value)}
              />
            </div>

            {/* Raquette */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Raquette</label>
              <input style={styles.input} placeholder="ex: Babolat Pure Drive" value={raquette} onChange={(e) => setRaquette(e.target.value)} />
            </div>

            {/* Cordage montant */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Cordage montant</label>
              <CordageSelector
                cordages={cordages}
                value={cordageM}
                onChange={setCordageM}
                placeholder="Rechercher un cordage..."
              />
            </div>

            {/* Tension montant */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Tension montant (kg)</label>
              <input style={styles.input} type="number" placeholder="ex: 25" value={tensionM} onChange={(e) => setTensionM(e.target.value)} />
            </div>

            {/* Même cordage ? */}
            <label style={styles.checkRow}>
              <input type="checkbox" checked={memeCordage} onChange={(e) => { setMemeCordage(e.target.checked); setCordageT(""); }} />
              Même cordage en travers
            </label>

            {/* Cordage travers */}
            {!memeCordage && (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Cordage travers</label>
                <CordageSelector
                  cordages={cordages}
                  value={cordageT}
                  onChange={setCordageT}
                  placeholder="Rechercher un cordage..."
                />
              </div>
            )}

            {/* Même tension ? */}
            <label style={styles.checkRow}>
              <input type="checkbox" checked={memeTension} onChange={(e) => { setMemeTension(e.target.checked); setTensionT(""); }} />
              Même tension en travers
            </label>

            {/* Tension travers */}
            {!memeTension && (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Tension travers (kg)</label>
                <input style={styles.input} type="number" placeholder="ex: 23" value={tensionT} onChange={(e) => setTensionT(e.target.value)} />
              </div>
            )}

            <button style={styles.btn} type="submit">Enregistrer la pose</button>
          </form>

          {message && <p style={styles.message}>{message}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  stepRow:     { display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 8 },
  stepNum:     { width: 26, height: 26, borderRadius: "50%", background: "#E6F1FB", color: "#0C447C", fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 },
  stepDone:    { background: "#D1FAE5", color: "#065F46" },
  stepContent: { flex: 1 },
  stepLabel:   { fontSize: 14, fontWeight: 500, color: "#111" },
  connector:   { width: 2, height: 16, background: "#e0e0e0", marginLeft: 12, marginBottom: 8 },
  fieldGroup:  { marginBottom: 12 },
  label:       { display: "block", fontSize: 11, color: "#888", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" },
  input:       { width: "100%", fontSize: 13, padding: "8px 12px", borderRadius: 8, border: "0.5px solid #ddd", boxSizing: "border-box" },
  checkRow:    { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#555", marginBottom: 12, cursor: "pointer" },
  btn:         { width: "100%", padding: "8px", borderRadius: 8, border: "none", background: "#E6F1FB", color: "#0C447C", fontWeight: 500, fontSize: 13, cursor: "pointer", marginTop: 4 },
  message:     { fontSize: 13, marginTop: 10, color: "#555" },

  // Jauges
  jaugeRow:      { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 },
  jaugeBtn:      { fontSize: 12, padding: "4px 10px", borderRadius: 8, border: "0.5px solid #ddd", background: "#f5f5f5", color: "#555", cursor: "pointer" },
  jaugeBtnActive:{ background: "#E6F1FB", color: "#0C447C", borderColor: "#185FA5", fontWeight: 500 },
};

export default PoseForm;
