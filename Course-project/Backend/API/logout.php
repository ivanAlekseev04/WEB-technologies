<?php
    header('Content-Type: application/json; charset=utf-8');
    mb_internal_encoding("UTF-8");
    
    session_start();

    if(isset($_SESSION['user'])) {
        $_SESSION = array();

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }

        session_destroy();

        exit(json_encode(['success' => true, 'message' => 'Succesfully logged out']));
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => "User isn't logged in"]);
    }
?>
