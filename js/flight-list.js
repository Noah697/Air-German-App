const fs = require('fs');
const path = require('path');

// Pfad zur flights.json
const dataPath = path.join(__dirname, '../data/flights.json');

// HTML-Elemente
const flightTableBody = document.getElementById('flightTableBody');
const depInput = document.getElementById('dep');
const arrInput = document.getElementById('arr');
const searchBtn = document.getElementById('searchFlights');

let flights = [];

// JSON-Datei laden
function loadFlights() {
  if (fs.existsSync(dataPath)) {
    const rawData = fs.readFileSync(dataPath);
    flights = JSON.parse(rawData);
  } else {
    flights = [];
  }
  renderFlights(flights);
}

// Tabelle rendern
function renderFlights(list) {
  flightTableBody.innerHTML = '';

  if (list.length === 0) {
    flightTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Keine Flüge gefunden</td></tr>`;
    return;
  }

  list.forEach(flight => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${flight.flightNumber}</td>
      <td>${flight.callsign}</td>
      <td>${flight.departure}</td>
      <td>${flight.arrival}</td>
      <td>${flight.aircraft}</td>
      <td>${flight.flightTime}</td>
      <td>${flight.status || 'Scheduled'}</td>
      <td style="cursor:pointer; font-size:1.5em;">
        <a href="flight-book.html?flight=${encodeURIComponent(flight.flightNumber)}">✈️</a>
      </td>
    `;
    flightTableBody.appendChild(tr);
  });
}

// Suche nach Departure/Arrival
function searchFlights() {
  const dep = depInput.value.toLowerCase();
  const arr = arrInput.value.toLowerCase();

  const filtered = flights.filter(f =>
    f.departure.toLowerCase().includes(dep) &&
    f.arrival.toLowerCase().includes(arr)
  );

  renderFlights(filtered);
}

// Events
searchBtn.addEventListener('click', searchFlights);
depInput.addEventListener('input', searchFlights);
arrInput.addEventListener('input', searchFlights);

// Initial laden
loadFlights();
