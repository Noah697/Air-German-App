<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $passwordConfirm = $_POST['password_confirm'];

    if ($password !== $passwordConfirm) {
        echo "<script>alert('Passwörter stimmen nicht überein'); window.location.href='register.html';</script>";
        exit;
    }

    $conn = new mysqli("localhost", "root", "", "air_german_app_v1"); // <-- Datenbankname anpassen
    if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

    // Prüfen, ob Benutzername schon existiert
    $stmt = $conn->prepare("SELECT * FROM users WHERE username=?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if($result->num_rows > 0) {
        echo "<script>alert('Benutzername bereits vergeben'); window.location.href='register.html';</script>";
        exit;
    }

    // Passwort hashen
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // Benutzer speichern
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $password_hash);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo "<script>alert('Registrierung erfolgreich! Bitte einloggen'); window.location.href='../login/login.html';</script>";
}
?>
