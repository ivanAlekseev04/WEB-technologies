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
            http_response_code(400);
            exit(json_encode(["success" => false, "message" => "User with name $username can't be found !"]));
        }
    }

    session_start();


    if(!isset($_SESSION['user'])) {
        http_response_code(401);
        exit(json_encode(['success' => false, 'message' => "User isn't logged in"]));
    }

    
    $cardData = json_decode(file_get_contents("php://input"), true);

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

    try{
        $sender_id = get_id($connection, $_SESSION["user"]["username"]);
        $receiver_id = get_id($connection, $cardData["receiver-name"]);

        if($sender_id === $receiver_id) {
            http_response_code(400);
            echo json_encode(['success' => false, "message" => "Sender and receiver can't be the same person"]);
        }
        else { 
            $stmt = $connection->prepare("INSERT INTO cards (sender_id, receiver_id, occasion, wish)
                            VALUES (:sender_id, :receiver_id, :occasion, :wish)");

            $stmt->bindParam(':sender_id', $sender_id);
            $stmt->bindParam(':receiver_id', $receiver_id);
            $stmt->bindParam(':occasion', $cardData["occasion"]);
            $stmt->bindParam(':wish', $cardData["wish"]);

            $stmt->execute();
            echo json_encode(['success' => true, 'message' => 'Greeting card data has been saved successfully']);   
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
?>