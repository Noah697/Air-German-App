// login.js
async function fetchCreatedAtFromUsersJson(user) {
  const tryPaths = [
    '/users.json',
    './users.json',
    '../users.json',
    '../../users.json',
    '../../../users.json'
  ];

  for (const path of tryPaths) {
    try {
      const resp = await fetch(path, {cache: "no-store"});
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
      // console.warn(`[fetchCreatedAt] couldn't load ${path}:`, err);
    }
  }

  return null;
}

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = loginForm.username.value.trim();
  const password = loginForm.password.value.trim();

  if (!username || !password) {
    alert("Bitte alle Felder ausfüllen!");
    return;
  }

  try {
    const resp = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const result = await resp.json();
    console.log('Login response from server:', result);

    if (result.success) {
      // result.user sollte idealerweise id, username, created_at enthalten
      const userData = {
        id: result.user?.id ?? null,
        username: result.user?.username ?? username,
        created_at: result.user?.created_at ?? null
      };

      // wenn created_at fehlt: versuche users.json zu lesen (Fallback)
      if (!userData.created_at) {
        const fallback = await fetchCreatedAtFromUsersJson(userData);
        if (fallback) {
          userData.created_at = fallback;
          console.log('Fetched created_at from users.json:', fallback);
        } else {
          console.warn('created_at not provided by server and not found in users.json.');
        }
      }

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('loggedIn', 'true');

      alert('Login erfolgreich!');
      // Weiterleitung — auf dein Index oder Pilot-Page nach Wahl
      window.location.href = '../../html/pilot-page.html';
    } else {
      alert(result.message || 'Fehler beim Login');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Fehler bei der Verbindung zum Server');
  }
});

// Direktes Weiterleiten, falls bereits eingeloggt
window.addEventListener('load', () => {
  const loggedIn = localStorage.getItem('loggedIn');
  if (loggedIn === 'true') {
    window.location.href = '../../html/pilot-page.html';
  }
});
