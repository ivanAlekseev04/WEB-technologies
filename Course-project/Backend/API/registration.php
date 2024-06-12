<?php
    header('Content-Type: application/json; charset=utf-8');
    mb_internal_encoding("UTF-8");
    
    require_once("../Db/Db.php");

    function isUserDataValid($userData) {
        if(!$userData) {
            return ['isValid' => false, 'message' => 'Empty credentials'];
        }

        $regex = "/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/";
        
        if(!preg_match($regex, $userData['email'])) {
            return ['isValid' => false, 'message' => 'Invalid email address format'];
        }

        return ["isValid" => true, "message" => "Valid data"];
    }

    $userData = json_decode(file_get_contents("php://input"), true);
    $valid = isUserDataValid($userData);

    if ($valid["isValid"]) {

        $userData["password"] = password_hash($userData["password"], PASSWORD_DEFAULT);

        try {

            $db = new DB();
            $conn = $db->getConnection();

            $sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

            $stmt = $conn->prepare($sql);
            $stmt->execute([$userData["username"], $userData["email"],
                            $userData["password"]]);

            echo json_encode(['success' => true, "message" => "Successful registration"]);
 
        } catch (PDOException $e) {
            http_response_code(500);

            if ($e->errorInfo[1] === 1062) {
                echo json_encode(['success' => false, "message" => "Email address is already registered"]);
            } else {
                echo json_encode(['success' => false, "message" => "Failed registration"]);
            }
        }

    } else {
        http_response_code(400);
        echo json_encode(['success' => false, "message" => $valid["message"]]);
    }

?>