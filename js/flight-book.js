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

  const booking = {
    flightNumber: selectedFlight.flightNumber,
    callsign: selectedFlight.callsign,
    departure: selectedFlight.departure,
    arrival: selectedFlight.arrival,
    aircraft: document.getElementById('aircraftType').value,
    registration: document.getElementById('registration').value,
    plannedDeparture: document.getElementById('plannedDeparture').value,
    plannedArrival: document.getElementById('plannedArrival').value,
    simbriefPlan: document.getElementById('simbriefPlan').value,
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

  alert('Flug erfolgreich gebucht!');
  window.location.href = 'flight-list.html';
});
