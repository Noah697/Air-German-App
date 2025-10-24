// === Toast Notification System ===
// Beispiel: showToast("Flug erfolgreich gebucht!", "success");

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");

  // Falls Container nicht existiert, abbrechen
  if (!container) {
    console.error("❌ Kein #toastContainer im Dokument gefunden!");
    return;
  }

  // Toast-Element erstellen
  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.innerHTML = `
    <span class="toast-message">${message}</span>
    <button class="toast-close">×</button>
  `;

  // Toast anzeigen
  container.appendChild(toast);

  // Entfernen-Button
  toast.querySelector(".toast-close").addEventListener("click", () => {
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 300);
  });

  // Automatisches Entfernen nach 4 Sekunden
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add("hide");
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}

// Beispielverwendung:
// showToast("Flug erfolgreich gebucht!", "success");
// showToast("Einstellungen gespeichert.", "info");
// showToast("Fehler beim Laden der Daten!", "error");
