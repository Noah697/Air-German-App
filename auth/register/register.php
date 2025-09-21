<?php
session_start();

function saveUserToJson($username, $password_hash) {
    $usersFile = '../../users.json';
    
    // Create users.json if it doesn't exist
    if (!file_exists($usersFile)) {
        file_put_contents($usersFile, json_encode([]));
    }
    
    // Read existing users
    $usersData = json_decode(file_get_contents($usersFile), true);
    if (!$usersData) {
        $usersData = [];
    }
    
    // Check if username already exists
    foreach ($usersData as $user) {
        if ($user['username'] === $username) {
            return false; // User already exists
        }
    }
    
    // Add new user
    $newUser = [
        'id' => count($usersData) + 1,
        'username' => $username,
        'password' => $password_hash,
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $usersData[] = $newUser;
    
    // Save back to file
    return file_put_contents($usersFile, json_encode($usersData, JSON_PRETTY_PRINT));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $passwordConfirm = $_POST['password_confirm'];

    if ($password !== $passwordConfirm) {
        echo "<script>alert('Passwörter stimmen nicht überein'); window.location.href='register.html';</script>";
        exit;
    }

    // Passwort hashen
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // Save to JSON file first
    $jsonSaved = saveUserToJson($username, $password_hash);
    
    if (!$jsonSaved) {
        echo "<script>alert('Benutzername bereits vergeben'); window.location.href='register.html';</script>";
        exit;
    }

    // Try to save to database as well (if available)
    $conn = new mysqli("localhost", "root", "", "air_german_app_v1");
    if (!$conn->connect_error) {
        // Prüfen, ob Benutzername schon existiert in DB
        $stmt = $conn->prepare("SELECT * FROM users WHERE username=?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if($result->num_rows == 0) {
            // Benutzer auch in DB speichern
            $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
            $stmt->bind_param("ss", $username, $password_hash);
            $stmt->execute();
            $stmt->close();
        }
        $conn->close();
    }

    echo "<script>alert('Registrierung erfolgreich! Bitte einloggen'); window.location.href='../login/login.html';</script>";
}
?>
