// admin-login.js
async function fetchCreatedAtFromUsersJson(user) {
  const tryPaths = [
    '/users-admin.json',
    './users-admin.json',
    '../users-admin.json',
    '../../users-admin.json',
    '../../../users-admin.json'
  ];

  for (const path of tryPaths) {
    try {
      const resp = await fetch(path, { cache: "no-store" });
      if (!resp.ok) continue;
      const arr = await resp.json();
      if (!Array.isArray(arr)) continue;

      // suche nach id zuerst, dann username
      let found = arr.find(u => String(u.id) === String(user.id));
      if (!found && user.username) {
        found = arr.find(u => u.username === user.username);
      }
      if (found && found.created_at) {
        console.log(`[fetchCreatedAt] found created_at in ${path}`);
        return found.created_at;
      }
    } catch (err) {
      // ignore, try next path
    }
  }

  return null;
}

// ✅ Wichtig: richtige ID verwenden
const loginForm = document.getElementById('adminLoginForm');
const errorMessage = document.getElementById('error-message');

// Prüfen, ob Formular existiert
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
      // ✏️ Lokal aus JSON laden statt Server-API
      const resp = await fetch('../users-admin.json', { cache: 'no-store' });
      if (!resp.ok) throw new Error("users-admin.json konnte nicht geladen werden");
      const admins = await resp.json();

      const admin = admins.find(a => a.username === username && a.password === password);

      if (admin) {
        // Erfolg ✅
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUser', JSON.stringify(admin));

        alert(`Willkommen, ${admin.username}!`);
        window.location.href = './dashboard.html';
      } else {
        // Fehler ❌
        errorMessage.textContent = "Ungültiger Benutzername oder Passwort!";
        errorMessage.style.display = "block";
      }
    } catch (error) {
      console.error('Login error:', error);
      errorMessage.textContent = "Fehler beim Login oder Laden der Datei!";
      errorMessage.style.display = "block";
    }
  });
}

// ✅ Automatische Weiterleitung, wenn schon eingeloggt
window.addEventListener('load', () => {
  const loggedIn = localStorage.getItem('adminLoggedIn');
  if (loggedIn === 'true') {
    window.location.href = './dashboard.html';
  }
});
