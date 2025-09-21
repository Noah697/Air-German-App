<?php
header("Content-Type: application/json; charset=UTF-8");
include 'db.php';

$response = [];

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

        $sql = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$hashedPassword')";

        if ($conn->query($sql) === TRUE) {
            $response = [
                "success" => true,
                "message" => "Registrierung erfolgreich!"
            ];
        } else {
            $response = [
                "success" => false,
                "message" => "Fehler: " . $conn->error
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
