<?php
require 'config.php';

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch($action){

    // ===================== GET TOUS LES ÉTUDIANTS =====================
    case 'getEtudiants':
        $result = $conn->query(
            "SELECT u.id, u.username, u.nom, u.prenom, u.email, u.niveau,
                    u.first_login, u.created_at,
                    p.statut as paiement_statut, p.acces_bloque,
                    p.mois_payes as paiement_mois, p.date_expiration
             FROM users u
             LEFT JOIN paiements p ON p.user_id = u.id
             WHERE u.role = 'etudiant'
             ORDER BY u.created_at DESC"
        );
        $data = [];
        while($row = $result->fetch_assoc()) $data[] = $row;
        echo json_encode($data);
        break;

    // ===================== BLOQUER ÉTUDIANT =====================
    case 'bloquerEtudiant':
        $id = intval($_POST['id'] ?? 0);
        $conn->query("UPDATE paiements SET acces_bloque=1 WHERE user_id=$id");
        echo json_encode(['success'=>true,'message'=>'🚫 Accès bloqué !']);
        break;

    // ===================== DÉBLOQUER ÉTUDIANT =====================
    case 'debloquerEtudiant':
        $id = intval($_POST['id'] ?? 0);
        $conn->query("UPDATE paiements SET acces_bloque=0 WHERE user_id=$id");
        echo json_encode(['success'=>true,'message'=>'✅ Accès débloqué !']);
        break;

    // ===================== SUPPRIMER ÉTUDIANT =====================
    case 'supprimerEtudiant':
        $id = intval($_POST['id'] ?? 0);
        $conn->query("DELETE FROM users WHERE id=$id AND role='etudiant'");
        echo json_encode(['success'=>true,'message'=>'✅ Étudiant supprimé !']);
        break;

    // ===================== MODIFIER ÉTUDIANT =====================
    case 'modifierEtudiant':
        $id     = intval($_POST['id'] ?? 0);
        $nom    = $conn->real_escape_string($_POST['nom'] ?? '');
        $prenom = $conn->real_escape_string($_POST['prenom'] ?? '');
        $email  = $conn->real_escape_string($_POST['email'] ?? '');
        $niveau = $conn->real_escape_string($_POST['niveau'] ?? '');

        $conn->query(
            "UPDATE users SET nom='$nom', prenom='$prenom',
             email='$email', niveau='$niveau' WHERE id=$id"
        );
        echo json_encode(['success'=>true,'message'=>'✅ Étudiant modifié !']);
        break;

    // ===================== CHANGER CODE ÉTUDIANT =====================
    case 'changerCode':
        $id      = intval($_POST['id'] ?? 0);
        $newCode = $conn->real_escape_string($_POST['code'] ?? '');

        if(!$newCode){
            echo json_encode(['success'=>false,'message'=>'Code requis']);
            exit;
        }

        $conn->query("UPDATE users SET code='$newCode' WHERE id=$id");
        echo json_encode(['success'=>true,'message'=>'✅ Code changé !']);
        break;

    // ===================== STATS DASHBOARD =====================
    case 'getStats':
        $total  = $conn->query("SELECT COUNT(*) as c FROM users WHERE role='etudiant'")->fetch_assoc()['c'];
        $payes  = $conn->query("SELECT COUNT(*) as c FROM paiements WHERE statut='payé'")->fetch_assoc()['c'];
        $bloque = $conn->query("SELECT COUNT(*) as c FROM paiements WHERE acces_bloque=1")->fetch_assoc()['c'];
        $notifs = $conn->query("SELECT COUNT(*) as c FROM notifications")->fetch_assoc()['c'];

        echo json_encode([
            'total'   => $total,
            'payes'   => $payes,
            'nonPay'  => $total - $payes,
            'bloques' => $bloque,
            'notifs'  => $notifs,
        ]);
        break;

    default:
        echo json_encode(['error'=>'Action inconnue']);
        break;
}

$conn->close();
?>
