<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $conn = new mysqli("localhost", "root", "", "air_german_app_v1");
    if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

    $stmt = $conn->prepare("SELECT * FROM users WHERE username=?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        if(password_verify($password, $row['password'])) {
            $_SESSION['username'] = $username;
            echo "<script>alert('Login erfolgreich!'); window.location.href='../../html/index.html';</script>";
            exit;
        } else {
            echo "<script>alert('Falsches Passwort'); window.location.href='login.html';</script>";
            exit;
        }
    } else {
        echo "<script>alert('Benutzer nicht gefunden'); window.location.href='login.html';</script>";
        exit;
    }
}
?>
