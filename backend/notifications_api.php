<?php
require 'config.php';

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch($action){

    // ===================== GET NOTIFICATIONS =====================
    case 'getNotifs':
        $niveau = $conn->real_escape_string($_GET['niveau'] ?? '');
        $result = $conn->query(
            "SELECT n.*, u.nom as prof_nom, u.prenom as prof_prenom
             FROM notifications n
             LEFT JOIN users u ON u.id = n.envoye_par
             WHERE n.niveau='$niveau' OR n.niveau='tous'
             ORDER BY n.created_at DESC
             LIMIT 30"
        );
        $data = [];
        while($row = $result->fetch_assoc()) $data[] = $row;
        echo json_encode($data);
        break;

    // ===================== ENVOYER NOTIFICATION =====================
    case 'envoyerNotif':
        $titre   = $conn->real_escape_string($_POST['titre'] ?? '');
        $message = $conn->real_escape_string($_POST['message'] ?? '');
        $niveau  = $conn->real_escape_string($_POST['niveau'] ?? 'tous');
        $profId  = intval($_POST['prof_id'] ?? 0);

        if(!$titre || !$message){
            echo json_encode(['success'=>false,'message'=>'Titre et message requis']);
            exit;
        }

        // Sauvegarder en DB
        $conn->query(
            "INSERT INTO notifications (titre, message, niveau, envoye_par)
             VALUES ('$titre','$message','$niveau',$profId)"
        );

        // Récupérer tokens FCM
        $query = $niveau === 'tous'
            ? "SELECT fcm_token FROM users WHERE role='etudiant' AND fcm_token IS NOT NULL AND fcm_token != ''"
            : "SELECT fcm_token FROM users WHERE role='etudiant' AND niveau='$niveau' AND fcm_token IS NOT NULL AND fcm_token != ''";

        $result = $conn->query($query);
        $tokens = [];
        while($row = $result->fetch_assoc()){
            if($row['fcm_token']) $tokens[] = $row['fcm_token'];
        }

        $sent = 0;

        // Envoyer via Firebase FCM
        if(!empty($tokens)){
            $fcmKey = 'TA_SERVER_KEY_FIREBASE'; // ← Remplace par ta clé Firebase

            $payload = json_encode([
                'registration_ids' => $tokens,
                'notification' => [
                    'title' => $titre,
                    'body'  => $message,
                    'sound' => 'default',
                    'badge' => 1,
                ],
                'data' => [
                    'niveau'  => $niveau,
                    'message' => $message,
                    'titre'   => $titre,
                ]
            ]);

            $ch = curl_init('https://fcm.googleapis.com/fcm/send');
            curl_setopt_array($ch, [
                CURLOPT_POST           => true,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER     => [
                    'Content-Type: application/json',
                    'Authorization: key='.$fcmKey
                ],
                CURLOPT_POSTFIELDS => $payload
            ]);

            $response = curl_exec($ch);
            curl_close($ch);

            $resp = json_decode($response, true);
            $sent = $resp['success'] ?? 0;
        }

        echo json_encode([
            'success' => true,
            'message' => "✅ Notification envoyée ! ($sent téléphones notifiés)"
        ]);
        break;

    // ===================== SUPPRIMER NOTIFICATION =====================
    case 'supprimerNotif':
        $id = intval($_POST['id'] ?? 0);
        $conn->query("DELETE FROM notifications WHERE id=$id");
        echo json_encode(['success'=>true,'message'=>'✅ Notification supprimée !']);
        break;

    default:
        echo json_encode(['error'=>'Action inconnue']);
        break;
}

$conn->close();
?>
