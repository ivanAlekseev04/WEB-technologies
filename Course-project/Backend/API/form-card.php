<?php
    header('Content-Type: application/json; charset=utf-8');
    mb_internal_encoding("UTF-8");

    require_once('../db/db.php');

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

    function get_username($connection, $user_id) {
        $query = $connection->prepare("SELECT * FROM users WHERE id = :user_id");
        $query->execute(['user_id' => $user_id]);
        $row = $query->fetch(PDO::FETCH_ASSOC);
    
        if($row) {
            return $row["username"];
        } else {
            exit(json_encode(["success" => false, "message" => "Потребител с id $user_id не е намерен !"]));
        }
    }

    session_start();


    if(!isset($_SESSION['user'])) {
        http_response_code(401);
        exit(json_encode(['message' => 'потребител не е логнат']));
    }

    
    $cardData = json_decode(file_get_contents("php://input"), true);

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

// Fetch all cards
    try{
        $sender_id = get_id($connection, $_SESSION["user"]["username"]);
        $receiver_id = get_id($connection, $cardData["receiver-name"]);
        $stmt = $connection->prepare("INSERT INTO cards (sender_id, receiver_id, design_id, occasion, wish)
                            VALUES (:sender_id, :receiver_id, 1, :occasion, :wish)");

        // Bind parameters
        $stmt->bindParam(':sender_id', $sender_id);
        $stmt->bindParam(':receiver_id', $receiver_id);
        $stmt->bindParam(':occasion', $cardData["occasion"]);
        $stmt->bindParam(':wish', $cardData["wish"]);

        // Execute the statement
        $stmt->execute();
        echo json_encode(['success' => true, 'message' => 'Greeting card data has been saved successfully.']);
    } catch (PDOException $e) {
        // Error response
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
?>