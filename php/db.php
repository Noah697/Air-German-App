<?php
$servername = "localhost";
$username = "root";   // Standard bei XAMPP
$password = "";       // leer lassen, außer du hast ein Passwort vergeben
$dbname = "air german app v1"; // Der Name deiner Datenbank

$conn = new mysqli($servername, $username, $password, $dbname);

// Prüfen ob Verbindung klappt
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}
?>
