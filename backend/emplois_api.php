<?php
require 'config.php';

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch($action){

    // ===================== GET EMPLOIS =====================
    case 'getEmplois':
        $niveau = $conn->real_escape_string($_GET['niveau'] ?? '');
        $result = $conn->query(
            "SELECT * FROM emplois_du_temps
             WHERE niveau='$niveau'
             ORDER BY FIELD(jour,'Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche')"
        );
        $data = [];
        while($row = $result->fetch_assoc()) $data[] = $row;
        echo json_encode($data);
        break;

    // ===================== AJOUTER SÉANCE =====================
    case 'ajouterSeance':
        $niveau   = $conn->real_escape_string($_POST['niveau'] ?? '');
        $type     = $conn->real_escape_string($_POST['type'] ?? 'presentiel');
        $jour     = $conn->real_escape_string($_POST['jour'] ?? '');
        $matiere  = $conn->real_escape_string($_POST['matiere'] ?? '');
        $heure    = $conn->real_escape_string($_POST['heure'] ?? '');
        $lien     = $conn->real_escape_string($_POST['lien_zoom'] ?? '');

        if(!$niveau || !$jour || !$matiere || !$heure){
            echo json_encode(['success'=>false,'message'=>'Champs manquants']);
            exit;
        }

        $conn->query(
            "INSERT INTO emplois_du_temps (niveau,type,jour,matiere,heure,lien_zoom)
             VALUES ('$niveau','$type','$jour','$matiere','$heure','$lien')"
        );
        echo json_encode(['success'=>true,'message'=>'✅ Séance ajoutée !']);
        break;

    // ===================== MODIFIER SÉANCE =====================
    case 'modifierSeance':
        $id      = intval($_POST['id'] ?? 0);
        $type    = $conn->real_escape_string($_POST['type'] ?? 'presentiel');
        $jour    = $conn->real_escape_string($_POST['jour'] ?? '');
        $matiere = $conn->real_escape_string($_POST['matiere'] ?? '');
        $heure   = $conn->real_escape_string($_POST['heure'] ?? '');
        $lien    = $conn->real_escape_string($_POST['lien_zoom'] ?? '');

        $conn->query(
            "UPDATE emplois_du_temps
             SET type='$type', jour='$jour', matiere='$matiere',
                 heure='$heure', lien_zoom='$lien'
             WHERE id=$id"
        );
        echo json_encode(['success'=>true,'message'=>'✅ Séance modifiée !']);
        break;

    // ===================== SUPPRIMER SÉANCE =====================
    case 'supprimerSeance':
        $id = intval($_POST['id'] ?? 0);
        $conn->query("DELETE FROM emplois_du_temps WHERE id=$id");
        echo json_encode(['success'=>true,'message'=>'✅ Séance supprimée !']);
        break;

    default:
        echo json_encode(['error'=>'Action inconnue']);
        break;
}

$conn->close();
?>
