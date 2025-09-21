<?php
header("Content-Type: application/json; charset=UTF-8");
include 'db.php';

$response = [];

function saveUserToJson($username, $email, $hashedPassword) {
    $usersFile = '../users.json';
    
    // Create users.json if it doesn't exist
    if (!file_exists($usersFile)) {
        file_put_contents($usersFile, json_encode([]));
    }
    
    // Read existing users
    $usersData = json_decode(file_get_contents($usersFile), true);
    if (!$usersData) {
        $usersData = [];
    }
    
    // Check if username or email already exists
    foreach ($usersData as $user) {
        if ($user['username'] === $username || $user['email'] === $email) {
            return false; // User already exists
        }
    }
    
    // Add new user
    $newUser = [
        'id' => count($usersData) + 1,
        'username' => $username,
        'email' => $email,
        'password' => $hashedPassword,
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $usersData[] = $newUser;
    
    // Save back to file
    return file_put_contents($usersFile, json_encode($usersData, JSON_PRETTY_PRINT));
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST["username"] ?? '';
    $email = $_POST["email"] ?? '';
    $password = $_POST["password"] ?? '';

    if (empty($username) || empty($email) || empty($password)) {
        $response = [
            "success" => false,
            "message" => "Bitte alle Felder ausfüllen."
        ];
    } else {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Save to JSON file first
        $jsonSaved = saveUserToJson($username, $email, $hashedPassword);
        
        if (!$jsonSaved) {
            $response = [
                "success" => false,
                "message" => "Benutzername oder E-Mail bereits vergeben."
            ];
        } else {
            // Also save to database if connection exists
            $dbSaved = false;
            if (isset($conn)) {
                $sql = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$hashedPassword')";
                $dbSaved = $conn->query($sql) === TRUE;
            }

            $response = [
                "success" => true,
                "message" => "Registrierung erfolgreich!"
            ];
        }
    }
} else {
    $response = [
        "success" => false,
        "message" => "Ungültige Anfrage."
    ];
}

echo json_encode($response);
?>
