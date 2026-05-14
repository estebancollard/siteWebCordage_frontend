import { useState, useRef, useEffect } from "react";

// ─── Autocomplete ─────────────────────────────────────────────────────────────
// Props :
//   items        : [{ id, label }]  — liste complète
//   onSelect     : (item) => void   — callback quand un item est sélectionné
//   placeholder  : string
//   selected     : item | null      — item actuellement sélectionné
function Autocomplete({ items = [], onSelect, placeholder = "Rechercher...", selected }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Fermer si clic extérieur
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrer selon la saisie
  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  function handleSelect(item) {
    onSelect(item);
    setQuery("");
    setOpen(false);
  }

  function handleClear() {
    onSelect(null);
    setQuery("");
  }

  return (
    <div ref={ref} style={styles.wrapper}>
      {selected ? (
        // Joueur sélectionné — affiche son nom + bouton pour changer
        <div style={styles.selectedRow}>
          <span style={styles.selectedLabel}>{selected.label}</span>
          <button style={styles.clearBtn} onClick={handleClear} aria-label="Changer de joueur">
            ✕
          </button>
        </div>
      ) : (
        // Champ de recherche
        <input
          style={styles.input}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
      )}

      {/* Liste déroulante */}
      {open && !selected && (
        <div style={styles.dropdown}>
          {filtered.length === 0 ? (
            <div style={styles.empty}>Aucun résultat</div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                style={styles.item}
                onMouseDown={() => handleSelect(item)}
              >
                {item.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper:       { position: "relative" },
  input:         { width: "100%", fontSize: 13, padding: "8px 12px", borderRadius: 8, border: "0.5px solid #ddd", boxSizing: "border-box", outline: "none" },
  selectedRow:   { display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, border: "0.5px solid #185FA5", background: "#E6F1FB" },
  avatar:        { width: 26, height: 26, borderRadius: "50%", background: "#185FA5", color: "#fff", fontSize: 10, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  selectedLabel: { flex: 1, fontSize: 13, fontWeight: 500, color: "#0C447C" },
  clearBtn:      { background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "#0C447C", padding: "0 4px" },
  dropdown:      { position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "0.5px solid #ddd", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", zIndex: 100, maxHeight: 220, overflowY: "auto" },
  item:          { display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", fontSize: 13, cursor: "pointer", color: "#111" },
  empty:         { padding: "10px 12px", fontSize: 13, color: "#aaa" },
};

export default Autocomplete;
