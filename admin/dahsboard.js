window.addEventListener('DOMContentLoaded', () => {
  // ----------------- Admin Access -----------------
  const isAdmin = sessionStorage.getItem("isAdmin");
  const adminUser = sessionStorage.getItem("adminUser");

  if (isAdmin !== "true") {
    // Nicht angemeldet -> Admin-Login
    window.location.href = "admin.html";
    return;
  }

  // ----------------- Wenn angemeldet -----------------
  // Admin Name anzeigen
  const adminNameElem = document.getElementById("adminName");
  if (adminNameElem) {
    adminNameElem.textContent = adminUser || "Admin";
  }

  // ----------------- Logout System -----------------
  const logoutBtn = document.getElementById('logout-btn');
  const overlay = document.getElementById('logout-overlay');
  const confirmBtn = document.getElementById('confirm-logout');
  const cancelBtn = document.getElementById('cancel-logout');

  if (logoutBtn && overlay) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.style.display = 'flex'; // Overlay einblenden
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      // Session und LocalStorage löschen
      sessionStorage.removeItem('isAdmin');
      sessionStorage.removeItem('adminUser');
      localStorage.removeItem('user');
      localStorage.setItem('loggedIn', 'false');

      // Zur Admin-Login-Seite zurück
      window.location.href = '../auth/login/admin-login.html';
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      overlay.style.display = 'none'; // Overlay ausblenden
    });
  }

  // Optional: Hier kannst du direkt eine Begrüßung oder andere Dashboard-Elemente anzeigen
  console.log(`[Admin Dashboard] Angemeldet als: ${adminUser}`);
});
