<?php
    header('Content-Type: application/json; charset=utf-8');
    mb_internal_encoding("UTF-8");

    require_once('../db/db.php');

    function login($userData) {
        try {
            $db = new DB();
            $connection = $db->getConnection();

            $stmt = $connection->prepare("SELECT * FROM users WHERE username = :username");
            $stmt->execute(['username' => $userData['username']]);

            if($stmt->rowCount() === 1) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                $passwordValid = password_verify($userData['password'], $user['password']);

                if($passwordValid) {
                    return $user;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch(PDOException $e) {
            throw new Error($e->getMessage());
        }
    }

    $userData = json_decode(file_get_contents("php://input"), true);

    if(!empty($userData)) {
        try {
            $user = login($userData);

            if(!$user) {
                http_response_code(400);
                echo json_encode(['message' => 'входът е неуспешен']);
            } else {
                session_start();
                
                $_SESSION['user'] = $user;
            }
        } catch(Error $e) {
            http_response_code(500);
            echo json_encode(['message' => 'грешка при вход']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'невалидни данни']);
    }
?>