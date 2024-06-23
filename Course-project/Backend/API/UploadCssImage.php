<?php
    header('Content-Type: application/json; charset=utf-8');
    mb_internal_encoding("UTF-8");

    require_once('../Db/Db.php');

    session_start();

    if(!isset($_SESSION['user'])) {
        http_response_code(401);
        exit(json_encode(['success' => false, 'message' => "User isn't logged in"]));
    }

    try {
        // Create database connection using PDO
        $db = new DB();
        $conn = $db->getConnection();
    
        // Check if form was submitted
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            
            $sql = "UPDATE cards SET is_styled = true";

            // Prepare image data
            $imageTmpPath;
            $imageData;
            if(isset($_FILES['image'])) {
                $imageTmpPath = $_FILES['image']['tmp_name'];
                $imageData = file_get_contents($imageTmpPath);
                $sql = $sql . ", " . " image = :image"; // TODO: check this
            }

            // Prepare CSS data
            $cssTmpPath;
            $cssData;
            if(isset($_FILES['css'])) {
                $cssTmpPath = $_FILES['css']['tmp_name'];
                $cssData = file_get_contents($cssTmpPath);
                $sql = $sql . ", " . " style = :style"; // TODO: check this
            }

            $sql = $sql . " " . "WHERE is_styled = false"; // TODO: check this
            $stmt = $conn->prepare($sql);

            if(isset($_FILES['image'])) {
                $stmt->bindParam(':image', $imageData, PDO::PARAM_LOB);
            }

            if(isset($_FILES['css'])) {
                $stmt->bindParam(':style', $cssData, PDO::PARAM_STR);
            }
            //TODO: check cases when: 1 file is missing, both files were uploaded, no files were uploaded
            // $sql = "UPDATE cards SET style = :style, is_styled = true, image = :image WHERE is_styled = false";

            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => "Files uploaded and saved to the database successfully"]);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => "Error uploading files to the database"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "Only POST method accepts"]);
        }
    } catch(PDOException $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Error: " . $e->getMessage()]);
    }
    
    // Close the connection
    $conn = null;
?>