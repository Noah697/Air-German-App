// Beispiel: Dummy-Flugdaten generieren
function getDummyFlights() {
  return [
    { lat: 52.5200, lng: 13.4050, flight: "AG123", from: "Berlin", to: "Hamburg" },
    { lat: 48.1351, lng: 11.5820, flight: "AG456", from: "Munich", to: "Frankfurt" }
  ];
}

module.exports = {
  getDummyFlights
};
