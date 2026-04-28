import { useState } from "react";
import Home from "./pages/Home";
import Joueur from "./pages/Joueur";

function App() {
  const [joueur, setJoueur] = useState(null);

  return (
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
  );
}

export default App;
