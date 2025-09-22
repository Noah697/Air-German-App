<?php
// register.php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Passwort verschlüsseln
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // Verbindung zur DB
    $conn = new mysqli("localhost", "root", "", "air_german_app_v1");
    if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $password_hash);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo "Registration successful!";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Register</title>
<style>
/* Einfache Styles */
body { font-family: Arial; display: flex; justify-content: center; margin-top: 50px; }
form { display: flex; flex-direction: column; width: 300px; }
input { margin-bottom: 10px; padding: 8px; }
button { padding: 10px; background: blue; color: white; border: none; }
</style>
</head>
<body>
<form method="POST" action="">
    <input type="text" name="username" placeholder="Username" required>
    <input type="password" name="password" placeholder="Password" required>
    <button type="submit">Register</button>
</form>
</body>
</html>
