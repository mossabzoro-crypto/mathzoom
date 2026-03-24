<?php
require 'config.php';

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch($action){

    // ===================== GET PAIEMENTS =====================
    case 'getPaiements':
        $result = $conn->query(
            "SELECT u.id, u.nom, u.prenom, u.username, u.niveau,
                    p.statut, p.acces_bloque, p.mois_payes, p.date_expiration
             FROM users u
             LEFT JOIN paiements p ON p.user_id = u.id
             WHERE u.role='etudiant'
             ORDER BY p.statut ASC, u.nom ASC"
        );
        $data = [];
        while($row = $result->fetch_assoc()) $data[] = $row;
        echo json_encode($data);
        break;

    // ===================== METTRE À JOUR PAIEMENT =====================
    case 'updatePaiement':
        $userId  = intval($_POST['user_id'] ?? 0);
        $statut  = $conn->real_escape_string($_POST['statut'] ?? 'non payé');
        $mois    = intval($_POST['mois'] ?? 0);
        $dateExp = $conn->real_escape_string($_POST['date_expiration'] ?? '');

        $dateExpSQL = !empty($dateExp) ? "'$dateExp'" : "NULL";

        // Si payé → débloquer automatiquement
        $bloque = $statut === 'payé' ? 0 : 1;

        $conn->query(
            "UPDATE paiements
             SET statut='$statut', mois_payes=$mois,
                 date_expiration=$dateExpSQL, acces_bloque=$bloque
             WHERE user_id=$userId"
        );

        echo json_encode([
            'success' => true,
            'message' => $statut === 'payé'
                ? '✅ Paiement confirmé — accès activé !'
                : '❌ Marqué non payé — accès bloqué'
        ]);
        break;

    default:
        echo json_encode(['error'=>'Action inconnue']);
        break;
}

$conn->close();
?>
