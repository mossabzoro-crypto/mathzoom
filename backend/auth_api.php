<?php
require 'config.php';

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch($action){

    // ===================== LOGIN ÉTUDIANT =====================
    // username + code d'inscription (visible, pas hashé)
    case 'loginEtudiant':
        $username = $conn->real_escape_string($_POST['username'] ?? '');
        $code     = $conn->real_escape_string($_POST['code'] ?? '');

        if(!$username || !$code){
            echo json_encode(['success'=>false,'message'=>'Remplissez tous les champs']);
            exit;
        }

        $result = $conn->query(
            "SELECT u.*, p.statut as paiement_statut, p.acces_bloque,
                    p.mois_payes as paiement_mois, p.date_expiration
             FROM users u
             LEFT JOIN paiements p ON p.user_id = u.id
             WHERE u.username='$username' AND u.role='etudiant'"
        );

        if($result->num_rows === 0){
            echo json_encode(['success'=>false,'message'=>'❌ Nom d\'utilisateur incorrect']);
            exit;
        }

        $user = $result->fetch_assoc();

        // Vérifier code d'inscription
        if($user['code'] !== $code){
            echo json_encode(['success'=>false,'message'=>'❌ Code d\'inscription incorrect']);
            exit;
        }

        // Vérifier si accès bloqué
        if($user['acces_bloque'] == 1){
            echo json_encode([
                'success' => false,
                'message' => '⚠️ Votre accès est bloqué. Veuillez contacter le professeur.'
            ]);
            exit;
        }

        // Supprimer le code de la réponse (sécurité)
        unset($user['code']);
        unset($user['password']);

        echo json_encode([
            'success'     => true,
            'user'        => $user,
            'first_login' => $user['first_login'] == 1
        ]);
        break;

    // ===================== LOGIN PROF / ADMIN =====================
    case 'loginProf':
        $email    = $conn->real_escape_string($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if(!$email || !$password){
            echo json_encode(['success'=>false,'message'=>'Remplissez tous les champs']);
            exit;
        }

        $result = $conn->query(
            "SELECT * FROM users
             WHERE email='$email' AND role IN ('professeur','admin')"
        );

        if($result->num_rows === 0){
            echo json_encode(['success'=>false,'message'=>'❌ Email incorrect']);
            exit;
        }

        $user = $result->fetch_assoc();

        if(!password_verify($password, $user['password'])){
            echo json_encode(['success'=>false,'message'=>'❌ Mot de passe incorrect']);
            exit;
        }

        unset($user['password']);

        echo json_encode(['success'=>true,'user'=>$user]);
        break;

    // ===================== COMPLÉTER PROFIL (1ère connexion) =====================
    case 'completerProfil':
        $id     = intval($_POST['id'] ?? 0);
        $nom    = $conn->real_escape_string($_POST['nom'] ?? '');
        $prenom = $conn->real_escape_string($_POST['prenom'] ?? '');
        $email  = $conn->real_escape_string($_POST['email'] ?? '');
        $niveau = $conn->real_escape_string($_POST['niveau'] ?? '');

        if(!$nom || !$prenom || !$niveau){
            echo json_encode(['success'=>false,'message'=>'Remplissez tous les champs']);
            exit;
        }

        $conn->query(
            "UPDATE users
             SET nom='$nom', prenom='$prenom', email='$email',
                 niveau='$niveau', first_login=0
             WHERE id=$id"
        );

        echo json_encode(['success'=>true,'message'=>'✅ Profil complété !']);
        break;

    // ===================== SAUVEGARDER TOKEN FCM =====================
    case 'saveFcmToken':
        $id    = intval($_POST['id'] ?? 0);
        $token = $conn->real_escape_string($_POST['token'] ?? '');
        $conn->query("UPDATE users SET fcm_token='$token' WHERE id=$id");
        echo json_encode(['success'=>true]);
        break;

    // ===================== CRÉER ÉTUDIANT (par admin/prof) =====================
    case 'creerEtudiant':
        $username = $conn->real_escape_string($_POST['username'] ?? '');
        $code     = $conn->real_escape_string($_POST['code'] ?? '');
        $nom      = $conn->real_escape_string($_POST['nom'] ?? '');
        $prenom   = $conn->real_escape_string($_POST['prenom'] ?? '');
        $niveau   = $conn->real_escape_string($_POST['niveau'] ?? '');

        if(!$username || !$code){
            echo json_encode(['success'=>false,'message'=>'Username et code requis']);
            exit;
        }

        // Vérifier si username existe déjà
        $check = $conn->query("SELECT id FROM users WHERE username='$username'");
        if($check->num_rows > 0){
            echo json_encode(['success'=>false,'message'=>'❌ Ce nom d\'utilisateur existe déjà']);
            exit;
        }

        $conn->query(
            "INSERT INTO users (username, code, nom, prenom, niveau, role, first_login)
             VALUES ('$username','$code','$nom','$prenom','$niveau','etudiant', 1)"
        );

        $newId = $conn->insert_id;

        // Créer entrée paiement
        $conn->query(
            "INSERT INTO paiements (user_id, statut, acces_bloque)
             VALUES ($newId, 'non payé', 0)"
        );

        echo json_encode([
            'success'  => true,
            'message'  => '✅ Étudiant créé !',
            'id'       => $newId,
            'username' => $username,
            'code'     => $code
        ]);
        break;

    default:
        echo json_encode(['error'=>'Action inconnue']);
        break;
}

$conn->close();
?>
