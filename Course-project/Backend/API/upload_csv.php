<?php

header('Content-Type: application/json; charset=utf-8');
mb_internal_encoding("UTF-8");

require_once("../db/DB.php");

function get_id($connection, $username) {
    $query = $connection->prepare("SELECT * FROM users WHERE username = :username");
    $query->execute(['username' => $username]);
    $row = $query->fetch(PDO::FETCH_ASSOC);

    if($row) {
        return $row["id"];
    } else {
        exit(json_encode(["success" => false, "message" => "Потребител с име $username не е намерен !"]));
    }
}

session_start();

// When user isn't logged in
if(!isset($_SESSION['user'])) {
    http_response_code(301);
    exit(json_encode(['message' => 'потребител не е логнат']));
}


if (!isset($_FILES["csv"]["name"])) {
    http_response_code(400);
    exit(json_encode(["success" => false, "message" => "Не е намерен csv файл!"]));
}

$file_name = $_FILES["csv"]["name"];

$file_contents = null;
//expected: sender_id,receiver_id,occasion,wish

try {
    $file_contents = file_get_contents($_FILES["csv"]["tmp_name"]); 
}
catch (Exception $e) {
    http_response_code(500);
    exit(json_encode(["success" => false, "message" => "Настъпи грешка при отваряне на файл."]));
}

try {
    $database = new DB();
    $connection = $database->getConnection();
}
catch (PDOException $e) {
	exit(json_encode([
		"success" => false,
        "message" => "Неуспешно свързване с базата данни.",
        ]));
}

$rows = explode("\n", $file_contents); 
$cards = [];

for ($i = 0; $i < count($rows); $i++) {
    if($i > 0) { // TODO: i==0 that is the header
        $row = explode(",", rtrim($rows[$i]));

        if ($row[0] == "") { // TODO: how does it even can be reached ???
            continue;
        }

        $sender_id = get_id($connection, $row[0]);
        $receiver_id = get_id($connection, $row[1]);
        
        $card = ["sender_id" => $sender_id, "receiver_id" => $receiver_id, "design_id" => "1", "occasion" => ltrim($row[2]), "wish" => ltrim($row[3])];

        array_push($cards, $card);
    }
}

try {
    $sql = "INSERT INTO cards (sender_id, receiver_id, design_id, occasion, wish)
                        VALUES (:sender_id, :receiver_id, :design_id, :occasion, :wish)";

    $stmt = $connection->prepare($sql);

    for ($i = 0; $i < count($cards); $i++) {
        $stmt->execute($cards[$i]); 
    }
} 
catch (PDOException $e) {
    http_response_code(500);
    exit(json_encode(["success" => false, "message" => "Грешка в сървъра!"]));
}

http_response_code(200);
exit(json_encode(["success" => true, "message" => "Успешно добавена картичка!"]));

?>