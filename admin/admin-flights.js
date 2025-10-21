const fs = require('fs');
const path = require('path');

// Pfad zur JSON-Datei
const dataPath = path.join(__dirname, '../data/flights.json');

// Flüge laden
let flights = [];
if (fs.existsSync(dataPath)) {
  const rawData = fs.readFileSync(dataPath);
  flights = JSON.parse(rawData);
}

// Tabelle rendern
function renderFlights() {
  const tbody = document.querySelector('#flights-table tbody');
  tbody.innerHTML = '';
  flights.forEach((flight, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${flight.departure}</td>
      <td>${flight.arrival}</td>
      <td>${flight.alternate1}</td>
      <td>${flight.alternate2}</td>
      <td>${flight.flightTime}</td>
      <td>${flight.aircraft}</td>
      <td>${flight.flightNumber}</td>
      <td>${flight.callsign}</td>
      <td><button onclick="deleteFlight(${index})">Löschen</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// Flug löschen
window.deleteFlight = function(index) {
  flights.splice(index, 1);
  saveFlights();
  renderFlights();
}

// Flug hinzufügen
document.getElementById('add-flight-btn').addEventListener('click', () => {
  const newFlight = {
    departure: document.getElementById('departure').value,
    arrival: document.getElementById('arrival').value,
    alternate1: document.getElementById('alternate1').value,
    alternate2: document.getElementById('alternate2').value,
    flightTime: document.getElementById('flightTime').value,
    aircraft: document.getElementById('aircraft').value,
    flightNumber: document.getElementById('flightNumber').value,
    callsign: document.getElementById('callsign').value
  };

  if (!newFlight.departure || !newFlight.arrival || !newFlight.flightNumber) {
    alert('Bitte mindestens Departure, Arrival und Flight Number eingeben!');
    return;
  }

  flights.push(newFlight);
  saveFlights();
  renderFlights();

  document.querySelectorAll('.flight-form input').forEach(input => input.value = '');
});

// Flüge speichern
function saveFlights() {
  fs.writeFileSync(dataPath, JSON.stringify(flights, null, 2));
}

// Tabelle initial rendern
renderFlights();
