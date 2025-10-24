const fs = require('fs');
const path = require('path');

// Pfade
const flightsPath = path.join(__dirname, '../data/flights.json');
const bookingsPath = path.join(__dirname, '../data/bookings.json');

// HTML-Elemente
const flightInfoDiv = document.getElementById('flightInfo');
const form = document.getElementById('finalBookingForm');

// FlightNumber aus URL holen
const params = new URLSearchParams(window.location.search);
const flightNumber = params.get('flight');

// Flugdaten laden
let flights = [];
if (fs.existsSync(flightsPath)) {
  flights = JSON.parse(fs.readFileSync(flightsPath));
}

// Gewählten Flug finden
const selectedFlight = flights.find(f => f.flightNumber === flightNumber);

if (selectedFlight) {
  flightInfoDiv.innerHTML = `
    <p><strong>${selectedFlight.flightNumber} - ${selectedFlight.callsign}</strong></p>
    <p>${selectedFlight.departure} → ${selectedFlight.arrival}</p>
    <p>Aircraft: ${selectedFlight.aircraft}</p>
    <p>Flight Time: ${selectedFlight.flightTime}</p>
  `;
} else {
  flightInfoDiv.innerHTML = `<p style="color:red;">Flug nicht gefunden!</p>`;
}

// Formular absenden
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Eingaben prüfen
  const reg = document.getElementById('registration').value.trim();
  const dep = document.getElementById('plannedDeparture').value;
  const arr = document.getElementById('plannedArrival').value;
  const simbrief = document.getElementById('simbriefPlan').value.trim();

  if (!reg || !dep || !arr || !simbrief) {
    showToast("Bitte alle Felder ausfüllen!", "error");
    return;
  }

  const booking = {
    flightNumber: selectedFlight.flightNumber,
    callsign: selectedFlight.callsign,
    departure: selectedFlight.departure,
    arrival: selectedFlight.arrival,
    aircraft: document.getElementById('aircraftType').value,
    registration: reg,
    plannedDeparture: dep,
    plannedArrival: arr,
    simbriefPlan: simbrief,
    bookedAt: new Date().toISOString()
  };

  // bookings.json laden oder erstellen
  let bookings = [];
  if (fs.existsSync(bookingsPath)) {
    bookings = JSON.parse(fs.readFileSync(bookingsPath));
  }

  // Neue Buchung hinzufügen
  bookings.push(booking);

  // Speichern
  fs.writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2));

  // ✅ Toast anzeigen
  showToast("Flug erfolgreich gebucht!", "success");

  // Weiterleitung nach 3,5 Sekunden (Toast sichtbar)
  setTimeout(() => {
    window.location.href = 'flight-list.html';
  }, 3500);
});
