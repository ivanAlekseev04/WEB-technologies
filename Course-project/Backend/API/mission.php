<?php

header('Content-Type: application/json; charset=utf-8');
mb_internal_encoding("UTF-8");

require_once('../Db/Db.php');

session_start();

if(!isset($_SESSION['user'])) {
    http_response_code(401);
    exit(json_encode(['success' => false, 'message' => "User isn't logged in"]));
}

try {
    $database = new DB();
    $connection = $database->getConnection();
}
catch (PDOException $e) {
    exit(json_encode([
        "success" => false,
        "message" => "Failed connection with DB",
    ]));
}


$sql = $connection->prepare("SELECT username FROM users");
$sql->execute();

$usernames = array();
if ($sql->rowCount() > 0) {
    while($row = $sql->fetch(PDO::FETCH_ASSOC)) {
        $usernames[] = $row;
    }
}

echo json_encode([
    'usernames' => $usernames
]);
