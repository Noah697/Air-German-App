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
