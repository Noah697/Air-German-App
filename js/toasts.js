function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.classList.add('toast', `toast-${type}`);
  toast.innerText = message;
  container.appendChild(toast);

  // Toast nach 3,5 Sekunden automatisch entfernen
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

// Flug erfolgreich gebucht
showToast('Flug erfolgreich gebucht!', 'success');

// Flug konnte nicht gebucht werden
showToast('Fehler: Flug konnte nicht gebucht werden', 'error');

// Info
showToast('Einstellungen gespeichert', 'info');
