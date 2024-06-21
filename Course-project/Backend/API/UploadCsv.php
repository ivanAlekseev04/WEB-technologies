<?php

    header('Content-Type: application/json; charset=utf-8');
    mb_internal_encoding("UTF-8");

    require_once("../Db/Db.php");

    function get_id($connection, $username) {
        $query = $connection->prepare("SELECT * FROM users WHERE username = :username");
        $query->execute(['username' => $username]);
        $row = $query->fetch(PDO::FETCH_ASSOC);
        
        if(!empty($row)) { 
            return $row["id"];
        } else {
            http_response_code(404);
            exit(json_encode(["success" => false, "message" => "User with name $username can't be found !"]));
        }
    }

    session_start();

    // When user isn't logged in
    if(!isset($_SESSION['user'])) {
        http_response_code(401);
        exit(json_encode(['success' => false, 'message' => "User isn't logged in"]));
    }


    if (!isset($_FILES["csv"]["name"])) {
        http_response_code(400);
        exit(json_encode(["success" => false, "message" => "CSV file can't be found"]));
    }

    $file_name = $_FILES["csv"]["name"];

    $file_contents = null;

    try {
        $file_contents = file_get_contents($_FILES["csv"]["tmp_name"]); 
    }
    catch (Exception $e) {
        http_response_code(500);
        exit(json_encode(["success" => false, "message" => "Failed to open CSV file"]));
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

    $rows = explode("\n", $file_contents); 
    $cards = [];

    if(count($rows) <= 1) {
        http_response_code(400); 
        exit(json_encode(["success" => false, "message" => "Invalid CSV file format. Is empty/has only header !"]));
    }

    for ($i = 0; $i < count($rows); $i++) {
        if($i > 0) { 
            $row = explode(",", rtrim($rows[$i]));

            $sender_id = get_id($connection, $_SESSION['user']["username"]);
            $receiver_id = get_id($connection, $row[0]);

            if($sender_id == $receiver_id) {
                http_response_code(400); 
                exit(json_encode(["success" => false, "message" => "Sender and receiver can't be the same person"]));
            }
            
            $card = ["sender_id" => $sender_id, "receiver_id" => $receiver_id, 
                "occasion" => ltrim($row[1]), "wish" => ltrim($row[2])];

            array_push($cards, $card);
        }
    }

    try {
        $sql = "INSERT INTO cards (sender_id, receiver_id, occasion, wish)
                            VALUES (:sender_id, :receiver_id, :occasion, :wish)";

        $stmt = $connection->prepare($sql);

        for ($i = 0; $i < count($cards); $i++) {
            $stmt->execute($cards[$i]); 
        }
    } 
    catch (PDOException $e) {
        http_response_code(500);
        exit(json_encode(["success" => false, "message" => "Server error"]));
    }

    exit(json_encode(["success" => true, "message" => "Successfully added gift card"]));
?>