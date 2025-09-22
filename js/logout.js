// logout.js
document.getElementById('logout-btn').addEventListener('click', function() {
    // Session oder LocalStorage löschen (je nach Login-System)
    localStorage.removeItem('loggedIn'); // Beispiel
    alert('Du wurdest ausgeloggt!');
    window.location.href = '../auth/login/login.html'; // zurück zur Login-Seite
});
