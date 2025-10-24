const { shell } = require('electron'); // Electron shell import

// Alle Links mit Klasse "external-link" abfangen
document.querySelectorAll('.footer .external-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();          // normales Link-Verhalten verhindern
    const url = link.getAttribute('href');
    shell.openExternal(url);     // öffnet im Standard-Browser
  });
});


function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2,'0');
  const minutes = String(now.getMinutes()).padStart(2,'0');
  const seconds = String(now.getSeconds()).padStart(2,'0');
  const dateStr = now.toLocaleDateString();
  document.getElementById('localClock').textContent = `${dateStr} ${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock();
