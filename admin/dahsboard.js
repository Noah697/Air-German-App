// dashboard.js

window.addEventListener('DOMContentLoaded', () => {
  // 🔒 Zugriffsschutz: Prüfen ob Admin eingeloggt ist
  const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  const adminData = JSON.parse(localStorage.getItem('adminUser') || '{}');

  if (!loggedIn || adminData.role !== 'admin') {
    console.warn("❌ Kein Zugriff – weiterleiten zur Admin-Login-Seite");
    window.location.href = './admin-login.html';
    return;
  }

  // 👋 Begrüßung mit Admin-Namen
  const adminNameElem = document.getElementById("adminName");
  if (adminNameElem && adminData.username) {
    adminNameElem.textContent = adminData.username;
  }

  // 🚪 Logout-Overlay und Logik
  const logoutBtn = document.getElementById('logout-btn');
  const overlay = document.getElementById('logout-overlay');
  const confirmBtn = document.getElementById('confirm-logout');
  const cancelBtn = document.getElementById('cancel-logout');

  if (logoutBtn && overlay) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.style.display = 'flex';
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      // Alles löschen
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminUser');

      window.location.href = './admin-login.html';
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      overlay.style.display = 'none';
    });
  }

  // Debug-Info
  console.log(`[Admin Dashboard] Angemeldet als: ${adminData.username}`);
});
