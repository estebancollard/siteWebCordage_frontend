const API_URL = "https://app.valentine-esteban.ovh/api";

export async function rechercherJoueur(prenom, nom) {
    const res = await fetch(
        `${API_URL}/joueurs/recherche?prenom=${prenom}&nom=${nom}`
    );

    if (!res.ok) {
        throw new Error("Erreur recherche joueur");
    }

    return res.json();
}

export async function recupererJoueurs() {
    const res = await fetch(
        `${API_URL}/joueurs`
    );

    if (!res.ok) {
        throw new Error("Erreur récupération joueurs");
    }

    const data = await res.json();
    return data ?? [];
}

export async function recupererPoses(joueurId) {
    const res = await fetch(
        `${API_URL}/joueurs/${joueurId}/poses`
    );

    if (!res.ok) {
        throw new Error("Erreur récupération poses");
    }

    const data = await res.json();
    return data ?? [];
}

export async function creerJoueur(prenom, nom) {
  const res = await fetch(`${API_URL}/joueurs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prenom, nom }),
  });

  if (!res.ok) {
    throw new Error("Erreur création joueur");
  }

  return res.json();
}

export async function creerPose(data) {
    const res = await fetch(`${API_URL}/poses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erreur création pose");
  }

  return res.json();
}

export async function creerCordage(marque, nom, type, jauge) {
  const res = await fetch(`${API_URL}/cordages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ marque, nom, type, jauge }),
  });

  return res.json();
}

export async function recupererCordages() {
  const res = await fetch(
        `${API_URL}/cordages`
    );

    if (!res.ok) {
        throw new Error("Erreur récupération cordages");
    }

    const data = await res.json();
    return data ?? [];
}

export async function supprimerCordage(id) {
  await fetch(`${API_URL}/cordages/${id}`, {
    method: "DELETE",
  });
}

export async function recupererTypesCordage() {
  const res = await fetch(`${API_URL}/cordages/typeCordage`);
  return res.json();
}