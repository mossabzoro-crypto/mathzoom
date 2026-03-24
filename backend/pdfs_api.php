<?php
require 'config.php';

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch($action){

    // ===================== GET PDFs =====================
    case 'getPDFs':
        $niveau = $conn->real_escape_string($_GET['niveau'] ?? '');
        $result = $conn->query(
            "SELECT * FROM pdfs
             WHERE niveau='$niveau' OR niveau='tous'
             ORDER BY created_at DESC"
        );
        $data = [];
        while($row = $result->fetch_assoc()) $data[] = $row;
        echo json_encode($data);
        break;

    // ===================== GET DRIVE LINKS =====================
    case 'getDriveLinks':
        $niveau = $conn->real_escape_string($_GET['niveau'] ?? '');
        $result = $conn->query(
            "SELECT * FROM drive_links
             WHERE niveau='$niveau' OR niveau='tous'
             ORDER BY created_at DESC"
        );
        $data = [];
        while($row = $result->fetch_assoc()) $data[] = $row;
        echo json_encode($data);
        break;

    // ===================== AJOUTER PDF =====================
    case 'ajouterPDF':
        $titre      = $conn->real_escape_string($_POST['titre'] ?? '');
        $niveau     = $conn->real_escape_string($_POST['niveau'] ?? '');
        $type       = $conn->real_escape_string($_POST['type'] ?? 'cours');
        $lien_drive = $conn->real_escape_string($_POST['lien_drive'] ?? '');

        if(!$titre || !$niveau || !$lien_drive){
            echo json_encode(['success'=>false,'message'=>'Champs manquants']);
            exit;
        }

        $conn->query(
            "INSERT INTO pdfs (titre, niveau, type, lien_drive)
             VALUES ('$titre','$niveau','$type','$lien_drive')"
        );
        echo json_encode(['success'=>true,'message'=>'✅ PDF ajouté !']);
        break;

    // ===================== AJOUTER DRIVE LINK =====================
    case 'ajouterDriveLink':
        $titre  = $conn->real_escape_string($_POST['titre'] ?? '');
        $niveau = $conn->real_escape_string($_POST['niveau'] ?? '');
        $lien   = $conn->real_escape_string($_POST['lien'] ?? '');

        if(!$titre || !$niveau || !$lien){
            echo json_encode(['success'=>false,'message'=>'Champs manquants']);
            exit;
        }

        $conn->query(
            "INSERT INTO drive_links (titre, niveau, lien)
             VALUES ('$titre','$niveau','$lien')"
        );
        echo json_encode(['success'=>true,'message'=>'✅ Lien Drive ajouté !']);
        break;

    // ===================== SUPPRIMER PDF =====================
    case 'supprimerPDF':
        $id = intval($_POST['id'] ?? 0);
        $conn->query("DELETE FROM pdfs WHERE id=$id");
        echo json_encode(['success'=>true,'message'=>'✅ PDF supprimé !']);
        break;

    // ===================== SUPPRIMER DRIVE LINK =====================
    case 'supprimerDriveLink':
        $id = intval($_POST['id'] ?? 0);
        $conn->query("DELETE FROM drive_links WHERE id=$id");
        echo json_encode(['success'=>true,'message'=>'✅ Lien supprimé !']);
        break;

    default:
        echo json_encode(['error'=>'Action inconnue']);
        break;
}

$conn->close();
?>
