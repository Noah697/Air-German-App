// Alle Dropdown-Elemente per Klick öffnen
document.querySelectorAll(".navbar .dropdown > a").forEach(drop => {
  const menu = drop.nextElementSibling;

  drop.addEventListener("click", e => {
    e.preventDefault();  // Link nicht ausführen
    e.stopPropagation(); // Klick nicht nach außen weitergeben
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
  });
});

// Klick außerhalb schließt alle Dropdowns
window.addEventListener("click", () => {
  document.querySelectorAll(".dropdown-content").forEach(menu => {
    menu.style.display = "none";
  });
});

///////////////////Notification//////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const bell = document.getElementById("notification-bell");

  // Popup-Container erstellen
  const popup = document.createElement("div");
  popup.classList.add("notifications-popup");
  popup.innerHTML = `
    <div class="notification-header">Benachrichtigungen</div>
    <div class="notification-list" id="notification-list">
      <div class="notification-empty">Keine neuen Benachrichtigungen</div>
    </div>
  `;
  bell.appendChild(popup);

  // Öffnen/Schließen beim Klick
  bell.addEventListener("click", (e) => {
    e.stopPropagation();
    popup.classList.toggle("active");
  });

  // Schließt Popup bei Klick außerhalb
  document.addEventListener("click", (e) => {
    if (!bell.contains(e.target)) {
      popup.classList.remove("active");
    }
  });

  // Funktion zum späteren Hinzufügen von Notifications
  window.addNotification = function (text) {
    const list = document.getElementById("notification-list");
    const empty = list.querySelector(".notification-empty");
    if (empty) empty.remove();

    const item = document.createElement("div");
    item.classList.add("notification-item");
    item.textContent = text;
    list.prepend(item);
  };
});

