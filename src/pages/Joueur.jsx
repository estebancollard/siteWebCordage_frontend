import { useEffect, useState } from "react";
import { recupererPoses } from "../api/backend";

// ─── Config badges type de cordage ───────────────────────────────────────────
const TYPE_CONFIG = {
  monofilament: { label: "Mono",          background: "#E6F1FB", color: "#0C447C" },
  multifilament: { label: "Multi",        background: "#EAF3DE", color: "#27500A" },
  boyau:         { label: "Boyau",        background: "#FAEEDA", color: "#633806" },
  synthetic_gut: { label: "Synthetic Gut",background: "#EEEDFE", color: "#3C3489" },
  hybride:       { label: "Hybride",      background: "#FBEAF0", color: "#72243E" },
};

// ─── Styles de base réutilisables ────────────────────────────────────────────
const BASE = {
  badge: {
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 10,
    fontWeight: 500,
  },
  text: {
    fontSize: 11,
    color: "#888",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "2-digit",
  });

const formatCordage = (marque, nom, diametre) =>
  `${marque} ${nom} ${diametre}mm`;

const isSameCordage = (pose) =>
  pose.travers_marque === pose.montant_marque &&
  pose.travers_nom === pose.montant_nom &&
  pose.travers_diametre === pose.montant_diametre;

const getBadgeStyle = (type) => {
  const config = TYPE_CONFIG[type];
  if (!config) return BASE.badge;
  return { ...BASE.badge, background: config.background, color: config.color };
};

const getBadgeLabel = (type) => TYPE_CONFIG[type]?.label ?? type;
const getDotColor   = (type) => TYPE_CONFIG[type]?.color ?? "#185FA5";

const joursDepuis = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

// ─── Sous-composants ─────────────────────────────────────────────────────────
const StatCard = ({ label, children, sub }) => (
  <div style={styles.statCard}>
    <div style={styles.statLabel}>{label}</div>
    {children}
    {sub && <div style={styles.statSub}>{sub}</div>}
  </div>
);

const CordageLine = ({ prefix, texte }) => (
  <div style={styles.cordageLine}>
    <span style={styles.cordagePrefix}>{prefix}</span>
    <span>{texte}</span>
  </div>
);

const PoseCard = ({ pose }) => {
  const montantStr  = formatCordage(pose.montant_marque, pose.montant_nom, pose.montant_diametre);
  const isHybride   = pose.travers_marque && pose.travers_nom && pose.travers_diametre && !isSameCordage(pose);
  const traversStr  = isHybride ? formatCordage(pose.travers_marque, pose.travers_nom, pose.travers_diametre) : null;
  const dotColor    = getDotColor(pose.montant_type);

  return (
    <div style={styles.card}>
      <div style={styles.cardRow}>

        {/* Point coloré centré sur la première ligne */}
        <div style={{ ...styles.dot, background: dotColor }} />

        <div style={styles.cardBody}>

          {/* Ligne 1 : date + raquette + jours */}
          <div style={styles.topRow}>
            <div style={styles.dateText}>
              <span style={styles.icon}>📅</span>
              {formatDate(pose.date_pose)}
            </div>
            <div style={styles.topRowRight}>
              <span style={styles.badgeRaquette}>
                🎾 {pose.modele_raquette}
              </span>
              <span style={styles.joursDepuis}>
                il y a {joursDepuis(pose.date_pose)} j
              </span>
            </div>
          </div>

          {/* Cordage — 2 lignes si hybride, 1 ligne si mono */}
          <div style={styles.cordageBlock}>
            {isHybride ? (
              <>
                <CordageLine prefix="M" texte={montantStr} />
                <CordageLine prefix="T" texte={traversStr} />
              </>
            ) : (
              <div style={styles.cordageLine}>
                <span>{montantStr}</span>
              </div>
            )}
          </div>

          {/* Badges tension + type */}
          <div style={styles.badges}>
            <span style={styles.badgeTension}>
              {pose.tension_montant} kg
              {pose.tension_travers && ` / ${pose.tension_travers} kg`}
            </span>
            <span style={getBadgeStyle(pose.montant_type)}>
              {getBadgeLabel(pose.montant_type)}
            </span>
          </div>

          {/* Commentaire */}
          {pose.commentaire && (
            <div style={styles.commentaire}>💬 {pose.commentaire}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Composant principal ─────────────────────────────────────────────────────
function Joueur({ joueur, onRetour }) {
  const [poses, setPoses] = useState([]);

  useEffect(() => {
    recupererPoses(joueur.id).then(setPoses);
  }, [joueur.id]);

  const totalPoses = poses.length;

  const cordageFavori = (() => {
    if (!totalPoses) return null;
    const compteur = {};
    poses.forEach((p) => {
      const key = formatCordage(p.montant_marque, p.montant_nom, p.montant_diametre);
      compteur[key] = (compteur[key] || 0) + 1;
    });
    const [nom, count] = Object.entries(compteur).sort((a, b) => b[1] - a[1])[0];
    return { nom, count };
  })();

  const dureeMoyenne = (() => {
    if (poses.length < 2) return null;
    const dates = poses.map((p) => new Date(p.date_pose)).sort((a, b) => b - a);
    const totalJours = dates.reduce((acc, date, i) => {
      if (i === 0) return acc;
      return acc + (dates[i - 1] - date) / (1000 * 60 * 60 * 24);
    }, 0);
    return Math.round(totalJours / (dates.length - 1));
  })();

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.retourBtn} onClick={onRetour}>← Retour</button>
        <h2 style={styles.joueurNom}>{joueur.prenom} {joueur.nom}</h2>
        <p style={styles.subtitle}>
          {totalPoses} pose{totalPoses !== 1 ? "s" : ""} enregistrée{totalPoses !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Stats — hauteur uniforme avec alignItems stretch */}
      {totalPoses > 0 && (
        <div style={styles.statsRow}>
          <StatCard label="Total poses">
            <div style={{ ...styles.statVal, textAlign: "center", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>{totalPoses}</div>
          </StatCard>
          {cordageFavori && (
            <StatCard label="Cordage favori" sub={`${cordageFavori.count} fois sur ${totalPoses}`}>
              <div style={{ ...styles.statVal, fontSize: 13, lineHeight: 1.4, marginTop: 4 }}>
                {cordageFavori.nom}
              </div>
            </StatCard>
          )}
          {dureeMoyenne !== null && (
            <StatCard label="Durée moyenne" sub="entre 2 poses">
              <div style={styles.statVal}>{dureeMoyenne} j</div>
            </StatCard>
          )}
        </div>
      )}

      {/* Liste des poses */}
      {totalPoses === 0 ? (
        <p style={styles.empty}>Aucune pose enregistrée</p>
      ) : (
        <div style={styles.list}>
          {poses.map((pose) => <PoseCard key={pose.id} pose={pose} />)}
        </div>
      )}
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  page:      { maxWidth: 600, margin: "0 auto", padding: "24px 16px", fontFamily: "system-ui, sans-serif" },
  header:    { marginBottom: 24 },
  retourBtn: { background: "transparent", border: "1px solid #ddd", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", marginBottom: 16, color: "#555" },
  joueurNom: { fontSize: 22, fontWeight: 600, margin: "0 0 4px" },
  subtitle:  { fontSize: 13, color: "#aaa", margin: 0 },

  // Stats — alignItems: stretch pour hauteur uniforme
  statsRow:  { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: 24, alignItems: "stretch" },
  statCard:  { background: "#f5f5f5", borderRadius: 8, padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  statLabel: { ...BASE.text, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" },
  statVal:   { fontSize: 20, fontWeight: 500, color: "#111" },
  statSub:   { ...BASE.text, color: "#aaa", marginTop: 2 },

  list:      { display: "flex", flexDirection: "column", gap: 12 },
  card:      { background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "14px 16px" },
  cardRow:   { display: "flex", gap: 12, alignItems: "flex-start" },

  // Point centré sur la première ligne (date ~20px de hauteur, dot 10px → marginTop 5)
  dot:       { width: 10, height: 10, borderRadius: "50%", marginTop: 5, flexShrink: 0 },
  cardBody:  { flex: 1 },

  // Ligne 1 : date + badge raquette côte à côte
  topRow:        { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  dateText:      { display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 500, color: "#185FA5" },
  topRowRight:   { display: "flex", alignItems: "center", gap: 8 },
  badgeRaquette: { fontSize: 12, fontWeight: 500, padding: "2px 10px", borderRadius: 10, background: "#F3F4F6", color: "#374151", border: "0.5px solid #E5E7EB" },
  joursDepuis:   { fontSize: 11, color: "#aaa", whiteSpace: "nowrap" },

  icon: { fontSize: 13 },

  // Cordage aligné à gauche, gris foncé
  cordageBlock:  { marginBottom: 8 },
  cordageLine:   { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#444" },
  cordagePrefix: { fontSize: 10, fontWeight: 600, padding: "1px 5px", borderRadius: 4, background: "#E5E7EB", color: "#6B7280", flexShrink: 0 },

  badges:       { display: "flex", gap: 6, flexWrap: "wrap" },
  badgeTension: { ...BASE.badge, background: "#FEF3C7", color: "#92400E" },

  commentaire: { fontSize: 12, color: "#888", marginTop: 6, fontStyle: "italic" },
  empty:       { fontSize: 14, color: "#aaa", textAlign: "center", padding: "40px 0" },
};

export default Joueur;