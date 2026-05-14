import { useState, useEffect } from "react";
import { recupererJoueurs, recupererCordages, recupererTypesCordage } from "../api/backend";
import PoseForm from "../components/admin/PoseForm";
import JoueurForm from "../components/admin/JoueurForm";
import CordagePanel from "../components/admin/CordagePanel";

const PASSWORD = "admin123";

// ─── Onglets ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: "poses",  label: "Poses" },
  { id: "config", label: "Configuration" },
];

function Admin() {
  const [input, setInput]           = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab]   = useState("poses");

  const [joueurs, setJoueurs]           = useState([]);
  const [cordages, setCordages]         = useState([]);
  const [typesCordage, setTypesCordage] = useState([]);

  // Chargement initial des données
  useEffect(() => {
    if (!authorized) return;
    recupererJoueurs().then(setJoueurs).catch(console.error);
    recupererCordages().then(setCordages).catch(console.error);
    recupererTypesCordage().then(setTypesCordage).catch(console.error);
  }, [authorized]);

  // ─── Login ────────────────────────────────────────────────────────────────
  if (!authorized) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <h2 style={styles.loginTitle}>Accès admin</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (input === PASSWORD) setAuthorized(true);
            else alert("Mot de passe incorrect");
          }}>
            <input
              style={styles.loginInput}
              type="password"
              placeholder="Mot de passe"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button style={styles.loginBtn} type="submit">Connexion</button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Interface admin ──────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Admin</h1>

      {/* Onglets */}
      <div style={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            style={{ ...styles.tab, ...(activeTab === tab.id ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      {activeTab === "poses" && (
        <PoseForm
          joueurs={joueurs}
          cordages={cordages}
        />
      )}

      {activeTab === "config" && (
        <div>
          <JoueurForm onJoueursUpdated={setJoueurs} />
          <CordagePanel
            cordages={cordages}
            typesCordage={typesCordage}
            onCordagesUpdated={setCordages}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  // Login
  loginPage:  { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" },
  loginCard:  { background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "2rem", width: 300 },
  loginTitle: { fontSize: 18, fontWeight: 500, margin: "0 0 16px", color: "#111" },
  loginInput: { width: "100%", fontSize: 13, padding: "8px 12px", borderRadius: 8, border: "0.5px solid #ddd", boxSizing: "border-box", marginBottom: 12 },
  loginBtn:   { width: "100%", padding: "8px", borderRadius: 8, border: "none", background: "#E6F1FB", color: "#0C447C", fontWeight: 500, fontSize: 13, cursor: "pointer" },

  // Page
  page:      { maxWidth: 600, margin: "0 auto", padding: "24px 16px", fontFamily: "system-ui, sans-serif" },
  title:     { fontSize: 22, fontWeight: 500, margin: "0 0 20px", color: "#111" },

  // Onglets
  tabs:      { display: "flex", gap: 8, marginBottom: 24, borderBottom: "0.5px solid #e0e0e0", paddingBottom: 12 },
  tab:       { padding: "6px 16px", borderRadius: 20, border: "0.5px solid #ddd", fontSize: 13, cursor: "pointer", background: "transparent", color: "#555" },
  tabActive: { background: "#E6F1FB", color: "#0C447C", border: "0.5px solid transparent", fontWeight: 500 },
};

export default Admin;
