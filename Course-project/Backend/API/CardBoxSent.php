<?php
header('Content-Type: application/json; charset=utf-8');
mb_internal_encoding("UTF-8");

require_once('../Db/Db.php');

function get_id($connection, $username) {
    $query = $connection->prepare("SELECT * FROM users WHERE username = :username");
    $query->execute(['username' => $username]);
    $row = $query->fetch(PDO::FETCH_ASSOC);

    if($row) {
        return $row["id"];
    } else {
        exit(json_encode(["success" => false, "message" => "User with name $username can't be found !"]));
    }
}

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

$user_id = get_id($connection, $_SESSION["user"]["username"]);

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 1; 
$offset = ($page - 1) * $limit;

$sql = $connection->prepare("SELECT * FROM cards JOIN users ON cards.receiver_id=users.id WHERE sender_id = :user_id LIMIT :limit OFFSET :offset");
$sql->bindValue(':user_id', $user_id, PDO::PARAM_INT);
$sql->bindValue(':limit', $limit, PDO::PARAM_INT);
$sql->bindValue(':offset', $offset, PDO::PARAM_INT);
$sql->execute();

$cards = array();
if ($sql->rowCount() > 0) {
    while($row = $sql->fetch(PDO::FETCH_ASSOC)) {
        $cards[] = $row;
    }
}

$totalCardsQuery = $connection->prepare("SELECT COUNT(*) as total FROM cards WHERE sender_id = :user_id");
$totalCardsQuery->execute(['user_id' => $user_id]);
$totalCards = $totalCardsQuery->fetch(PDO::FETCH_ASSOC)['total'];
$totalPages = ceil($totalCards / $limit);

echo json_encode([
    'cards' => $cards,
    'totalPages' => $totalPages
]);
?>