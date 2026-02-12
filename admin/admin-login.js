// admin-login.js

const bcrypt = require('bcryptjs'); // npm install bcryptjs

// 🔒 Admin-Login-System mit Rollenprüfung
const loginForm = document.getElementById('adminLoginForm');
const errorMessage = document.getElementById('error-message');

// Prüfen, ob das Formular vorhanden ist
if (!loginForm) {
  console.error("❌ Admin-Login-Formular wurde nicht gefunden!");
} else {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = loginForm.username.value.trim();
    const password = loginForm.password.value.trim();

    if (!username || !password) {
      errorMessage.textContent = "Bitte alle Felder ausfüllen!";
      errorMessage.style.display = "block";
      return;
    }

    try {
      // 👤 Userdaten laden
      const resp = await fetch('../users.json', { cache: 'no-store' });
      if (!resp.ok) throw new Error("users.json konnte nicht geladen werden");

      const users = await resp.json();
      const user = users.find(u => u.username === username);

      if (!user) {
        errorMessage.textContent = "Benutzer nicht gefunden!";
        errorMessage.style.display = "block";
        return;
      }

      // 🔑 Passwort prüfen mit bcrypt
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        errorMessage.textContent = "Falsches Passwort!";
        errorMessage.style.display = "block";
        return;
      }

      // 👮‍♂️ Admin-Rolle prüfen
      if (user.role !== "admin") {
        errorMessage.textContent = "Kein Admin-Zugang!";
        errorMessage.style.display = "block";
        return;
      }

      // ✅ Login erfolgreich
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminUser', JSON.stringify(user));

      alert(`Willkommen, ${user.username}!`);
      window.location.href = './dashboard.html';

    } catch (error) {
      console.error('Login error:', error);
      errorMessage.textContent = "Fehler beim Login oder Laden der Datei!";
      errorMessage.style.display = "block";
    }
  });
}

// ✅ Automatische Weiterleitung, wenn bereits eingeloggt
window.addEventListener('load', () => {
  const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  // Nur weiterleiten, wenn Admin wirklich admin ist
  if (loggedIn && adminUser.role === 'admin') {
    window.location.href = './dashboard.html';
  }
});
