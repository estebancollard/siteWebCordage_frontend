import { useEffect, useState } from "react";
import { rechercherJoueur, recupererPoses } from "../api/backend";

function Joueur({ joueur, onRetour }) {
    const [poses, setPoses] = useState([]);

    useEffect(() => { recupererPoses(joueur.id).then(setPoses); }, [joueur.id]);

    console.log(" Render - poses =", poses);
    console.log(" pose.length =", poses.length);

    return (
        <div>
            <button onClick={onRetour}>← Retour</button>
        
            <h2>{joueur.prenom} {joueur.nom} {joueur.id}</h2>

            <h3>Historique des poses</h3>

            {poses.length === 0 && <p>Aucune pose enregistrée</p>}

            <ul>
                {poses.map(pose => (
                    <li key={pose.id}>
                        <strong>{pose.date_pose}</strong> - {pose.modele_raquette}
                        <br />
                        {pose.cordage_montant} / {pose.cordage_travers}
                        <br />
                        {pose.tension_montant} kg / {pose.tension_travers} kg
                        {pose.commentaire && (
                            <>
                                <br />
                                <em>{pose.commentaire}</em>
                            </>
                        )}
                    </li>
                ))}
            </ul>

        </div>
    )
}

export default Joueur;