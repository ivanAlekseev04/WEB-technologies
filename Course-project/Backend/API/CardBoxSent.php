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

    // Fetch all cards
    $user_id = get_id($connection, $_SESSION["user"]["username"]);
    $sql = $connection->prepare("SELECT * FROM cards JOIN users ON cards.receiver_id=users.id WHERE sender_id = :user_id");
    $sql->execute(["user_id" => $user_id]);

    // Prepare an array to store the cards
    $cards = array();

    if ($sql->rowCount() > 0) {
        // Fetch each row as an associative array
        while($row = $sql->fetch(PDO::FETCH_ASSOC)) {
            $cards[] = $row;
        }
    }

    // Return the cards data as JSON
    echo json_encode($cards);
?>