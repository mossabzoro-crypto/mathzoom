import { API_URL } from '../constants/api_url';

// ===================== HELPER =====================
const post = async (endpoint, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(k => formData.append(k, data[k]));
    const res = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        body: formData
    });
    return res.json();
};

const get = async (endpoint, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/${endpoint}?${query}`);
    return res.json();
};

// ===================== AUTH =====================
export const loginEtudiant = (username, password) =>
    post('auth_api.php', { action: 'loginEtudiant', username, password });

export const loginProf = (email, password) =>
    post('auth_api.php', { action: 'loginProf', email, password });

export const completerProfil = (id, nom, prenom, email, niveau) =>
    post('auth_api.php', { action: 'completerProfil', id, nom, prenom, email, niveau });

export const saveFcmToken = (id, token) =>
    post('auth_api.php', { action: 'saveFcmToken', id, token });

// ===================== EMPLOIS =====================
export const getEmplois = (niveau) =>
    get('emplois_api.php', { action: 'getEmplois', niveau });

export const ajouterSeance = (data) =>
    post('emplois_api.php', { action: 'ajouterSeance', ...data });

export const modifierSeance = (data) =>
    post('emplois_api.php', { action: 'modifierSeance', ...data });

export const supprimerSeance = (id) =>
    post('emplois_api.php', { action: 'supprimerSeance', id });

// ===================== PDFs =====================
export const getPDFs = (niveau) =>
    get('pdfs_api.php', { action: 'getPDFs', niveau });

export const supprimerPDF = (id) =>
    post('pdfs_api.php', { action: 'supprimerPDF', id });

// ===================== DRIVE =====================
export const getDriveLinks = (niveau) =>
    get('pdfs_api.php', { action: 'getDriveLinks', niveau });

// ===================== NOTIFICATIONS =====================
export const getNotifs = (niveau) =>
    get('notifications_api.php', { action: 'getNotifs', niveau });

export const envoyerNotif = (titre, message, niveau, profId) =>
    post('notifications_api.php', { action: 'envoyerNotif', titre, message, niveau, prof_id: profId });

// ===================== ÉTUDIANTS =====================
export const getEtudiants = () =>
    get('users_api.php', { action: 'getEtudiants' });

export const bloquerEtudiant = (id) =>
    post('users_api.php', { action: 'bloquerEtudiant', id });

export const debloquerEtudiant = (id) =>
    post('users_api.php', { action: 'debloquerEtudiant', id });

// ===================== PAIEMENTS =====================
export const getPaiements = () =>
    get('paiements_api.php', { action: 'getPaiements' });

export const updatePaiement = (userId, statut, mois, dateExp) =>
    post('paiements_api.php', { action: 'updatePaiement', user_id: userId, statut, mois, date_expiration: dateExp });