const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'flights.json');

function loadFlights() {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

function saveFlights(flights) {
  fs.writeFileSync(filePath, JSON.stringify(flights, null, 2));
}

function addFlight(newFlight) {
  const flights = loadFlights();
  flights.push({ ...newFlight, Status: 'Available', BookedBy: '' });
  saveFlights(flights);
}

function bookFlight(flightNumber, pilotName) {
  const flights = loadFlights();
  const flight = flights.find(f => f.FlightNumber === flightNumber);
  if (flight && flight.Status === 'Available') {
    flight.Status = 'Booked';
    flight.BookedBy = pilotName;
    saveFlights(flights);
    return true;
  }
  return false;
}

module.exports = { loadFlights, saveFlights, addFlight, bookFlight };
