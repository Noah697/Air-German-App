// pilot-page.js
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
      if (!found && user.username) found = arr.find(u => u.username === user.username);
      if (found && found.created_at) {
        console.log(`[pilot-page] found created_at in ${path}`);
        return found.created_at;
      }
    } catch (err) {
      // ignore & next
    }
  }
  return null;
}

window.addEventListener('DOMContentLoaded', async () => {
  let user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = '../auth/login/login.html';
    return;
  }

  // Falls created_at fehlt: versuche users.json (mehrere Pfade)
  if (!user.created_at) {
    console.log('[pilot-page] created_at missing in localStorage.user, trying users.json fallback...');
    const created = await fetchCreatedAtFromUsersJson(user);
    if (created) {
      user.created_at = created;
      localStorage.setItem('user', JSON.stringify(user));
      console.log('[pilot-page] updated localStorage.user with created_at:', created);
    } else {
      console.warn('[pilot-page] created_at not found anywhere — will show fallback "--"');
    }
  }

  // ----------------- User Info -----------------
  document.getElementById('pilot-username').textContent = user.username ?? 'Pilot';
  document.getElementById('pilot-id').textContent = (user.id !== undefined && user.id !== null) ? ("KRD-" + user.id) : '---';

  // Dummy-Daten (kannst du später dynamisch vom Server laden)
  document.getElementById('pilot-rank').textContent = "First Officer";
  document.getElementById('pilot-rank-card').textContent = "First Officer";
  document.getElementById('pilot-hours').textContent = "124h";
  document.getElementById('pilot-flights').textContent = "56";
  document.getElementById('pilot-distance').textContent = "85.200 km";
  document.getElementById('pilot-last-flight').textContent = "EDDB → EDDM (18.09.2025)";
  document.getElementById('pilot-award').textContent = "🏆 100h Award";

  // Beitrittsdatum: bevorzugt direct string-splitting (robust)
  const joinedElem = document.getElementById('pilot-joined');
  if (user.created_at && typeof user.created_at === 'string') {
    try {
      // falls ISO-format
      if (user.created_at.includes('T')) {
        const [year, month, day] = user.created_at.split('T')[0].split('-');
        if (day && month && year) joinedElem.textContent = `${day}.${month}.${year}`;
        else joinedElem.textContent = '--';
      } else {
        // fallback: versuche Date parsing
        const d = new Date(user.created_at);
        if (!isNaN(d)) {
          const day = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const year = d.getFullYear();
          joinedElem.textContent = `${day}.${month}.${year}`;
        } else {
          joinedElem.textContent = '--';
        }
      }
    } catch (e) {
      joinedElem.textContent = '--';
    }
  } else {
    joinedElem.textContent = '--';
  }

  // ----------------- Profilbild Upload -----------------
  const profileImg = document.getElementById('pilot-profile-img');
  const profileInput = document.getElementById('profile-img-input');
  const saveBtn = document.getElementById('save-profile-btn');

  const imgKey = `pilotProfileImg_${user.id}`;
  let tempImg = null; // Zwischenspeicher für Vorschau

  // Profilbild aus LocalStorage laden
  const savedImg = localStorage.getItem(imgKey);
  if (savedImg) profileImg.src = savedImg;

  // Klick auf Bild öffnet Datei-Dialog
  profileImg.addEventListener('click', () => profileInput.click());

  // Datei auswählen → Vorschau + Save-Button einblenden
  profileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      tempImg = reader.result;
      profileImg.src = tempImg;       // Vorschau anzeigen
      saveBtn.style.display = 'block'; // Button einblenden
    };
    reader.readAsDataURL(file);
  });

  // Klick auf "Profilbild speichern"
  saveBtn.addEventListener('click', () => {
    if (!tempImg) return;
    localStorage.setItem(imgKey, tempImg); // Jetzt speichern
    saveBtn.style.display = 'none';       // Button ausblenden
    alert('Profilbild gespeichert!');
  });

// ----------------- Logout -----------------
const logoutBtn = document.getElementById('logout-btn');
const overlay = document.getElementById('logout-overlay');
const confirmBtn = document.getElementById('confirm-logout');
const cancelBtn = document.getElementById('cancel-logout');

if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    overlay.style.display = 'flex'; // Overlay einblenden
  });
}

if (confirmBtn) {
  confirmBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    localStorage.setItem('loggedIn', 'false');
    window.location.href = '../auth/login/login.html';
  });
}

if (cancelBtn) {
  cancelBtn.addEventListener('click', () => {
    overlay.style.display = 'none'; // Overlay ausblenden
  });
}
})
