import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Joueur from "./pages/Joueur";
import Admin from "./pages/Admin";

function App() {
  const [joueur, setJoueur] = useState(null);

  return (
    <Routes>      
      {/* ✅ Route ADMIN uniquement */}
      <Route path="/admin" element={<Admin />} />

      
      {/* ✅ App classique */}
      <Route
        path="*"
        element={
          <div style={{ padding: "2rem" }}>
            <h1>Suivi de cordage 🎾</h1>

            {!joueur && (
              <Home onJoueurTrouve={setJoueur} />
            )}

            {joueur && (
              <Joueur
                joueur={joueur}
                onRetour={() => setJoueur(null)}
              />
            )}
          </div>
        }
      />

    </Routes>
  );
}

export default App;
