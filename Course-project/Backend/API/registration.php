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

            $stmt_username = $conn->prepare("SELECT * FROM users WHERE username = :username");
            $stmt_username->execute(['username' => $userData['username']]);

            $stmt_email = $conn->prepare("SELECT * FROM users WHERE email = :email");
            $stmt_email->execute(['email' => $userData['email']]);

            if($stmt_username->rowCount() != 0) {
                http_response_code(400);
                echo json_encode(['success' => false, "message" => "Username is already used"]);
            }
            else if($stmt_email->rowCount() != 0) {
                http_response_code(400);
                echo json_encode(['success' => false, "message" => "Email is already used"]);
            }
            else {
                 $sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

                $stmt = $conn->prepare($sql);
                $stmt->execute([$userData["username"], $userData["email"],
                            $userData["password"]]);

                echo json_encode(['success' => true, "message" => "Successful registration"]);
            }
           
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, "message" => "Failed registration"]);   
        }

    } else {
        http_response_code(400);
        echo json_encode(['success' => false, "message" => $valid["message"]]);
    }

?>