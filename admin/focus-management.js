const fs = require('fs');
const path = require('path');

// Pfad zur JSON-Datei
const focusPath = path.join(__dirname, '../data/focus.airports.json');

// Elemente
const form = document.getElementById('focusForm');
const focusList = document.getElementById('focusList');

// Funktion: Focus Airports laden
function loadFocusAirports() {
  if (!fs.existsSync(focusPath)) {
    fs.writeFileSync(focusPath, JSON.stringify([]));
  }

  const data = JSON.parse(fs.readFileSync(focusPath));
  focusList.innerHTML = '';

  data.forEach((airport, index) => {
    const item = document.createElement('div');
    item.className = 'focus-item';
    item.innerHTML = `
      <h3>${airport.name} (${airport.icao})</h3>
      <p><strong>Bild:</strong> ${airport.image}</p>
      <div class="actions">
        <button onclick="deleteAirport(${index})" class="delete">Löschen</button>
      </div>
    `;
    focusList.appendChild(item);
  });
}

// Funktion: Focus Airport löschen
window.deleteAirport = (index) => {
  const data = JSON.parse(fs.readFileSync(focusPath));
  data.splice(index, 1);
  fs.writeFileSync(focusPath, JSON.stringify(data, null, 2));
  loadFocusAirports();
};

// Event: neuen Airport hinzufügen
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const icao = document.getElementById('icao').value.trim().toUpperCase();
  const image = document.getElementById('image').value.trim();

  if (!name || !icao || !image) return alert('⚠️ Bitte alle Felder ausfüllen.');

  const newAirport = { name, icao, image };

  const data = JSON.parse(fs.readFileSync(focusPath));
  data.push(newAirport);
  fs.writeFileSync(focusPath, JSON.stringify(data, null, 2));

  form.reset();
  loadFocusAirports();
});

// Lade Focus Airports beim Start
loadFocusAirports();
