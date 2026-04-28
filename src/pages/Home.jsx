import { useState } from "react";
import { rechercherJoueur } from "../api/backend";

function Home({ onJoueurTrouve }) {
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [erreur, setErreur] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setErreur("");

        try {
            const joueur = await rechercherJoueur(prenom, nom);
            if (!joueur) {
                setErreur("Aucun joueur trouvé");
            } else {
                onJoueurTrouve(joueur);
            }
        } catch (e) {
            setErreur("Erreur serveur");
        }
    }

    return (
        <div>
            <h2>Rechercher un joueur</h2>

            <form onSubmit={handleSubmit}>
                <input 
                    placeholder="Prénom" 
                    value={prenom} 
                    onChange={e => setPrenom(e.target.value)}
                />
                <br /><br />
                <input 
                    placeholder="Nom" 
                    value={nom} 
                    onChange={e => setNom(e.target.value)}
                />
                <br /><br />
                <button type="submit">Rechercher</button>
            </form>

            {erreur && <p style={{ color: "red" }}>{erreur}</p>}
        </div>
    );
}

export default Home;