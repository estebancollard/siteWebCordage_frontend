const API_URL = "https://app.valentine-esteban.ovh/api";

export async function rechercherJoueur(prenom, nom) {
    const res = await fetch(
        `${API_URL}/joueurs?prenom=${prenom}&nom=${nom}`
    );

    if (!res.ok) {
        throw new Error("Erreur recherche joueur");
    }

    return res.json();
}

export async function recupererPoses(joueurId) {
    const res = await fetch(
        `${API_URL}/joueurs/${joueurId}/poses`
    );

    if (!res.ok) {
        throw new Error("Erreur récupération poses");
    }

    return res.json();
}
