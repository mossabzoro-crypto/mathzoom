<?php
// ===================== CONFIG DB =====================
$host     = "localhost";
$user     = "root";
$password = "";
$dbname   = "mathzoom";

$conn = new mysqli($host, $user, $password, $dbname);
if($conn->connect_error){
    echo json_encode(['success'=>false,'message'=>'Erreur connexion DB: '.$conn->connect_error]);
    exit;
}
$conn->set_charset("utf8");

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
