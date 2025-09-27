document.addEventListener("DOMContentLoaded", () => {
  // Leaflet Map initialisieren
  const map = L.map('map').setView([51.1657, 10.4515], 6);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      maxZoom: 19
  }).addTo(map);

  // Gelbes Flugzeug-SVG Marker
  const planeIcon = L.divIcon({
    className: "custom-plane-icon",
    html: `<svg width="30" height="30" viewBox="0 0 24 24" fill="yellow" xmlns="http://www.w3.org/2000/svg">
             <path d="M21 16v-2l-8-5V3.5a.5.5 0 0 0-1 0V9l-8 5v2l8-2.5v5L8 20v1l4-1 4 1v-1l-3-3.5v-5l8 2.5z"/>
           </svg>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });

  // Dummy-Flüge
  const flights = [
    { flight: "AG123", from: "EDDB", to: "EDDH", coordsFrom: [52.52,13.405], coordsTo: [53.551,9.993], altitude: 10000, speed: 500, type: "A320" },
    { flight: "AG456", from: "EDDM", to: "EDDF", coordsFrom: [48.135,11.582], coordsTo: [50.1109,8.6821], altitude: 12000, speed: 450, type: "A350" }
  ];

  // Flugzeug Info Box Elemente
  const flightBox = document.getElementById("flight-info");
  const flightTitle = document.getElementById("flight-title");
  const planeImage = document.getElementById("plane-image");
  const infoTab = document.getElementById("info-tab");
  const planTab = document.getElementById("plan-tab");
  const tabButtons = document.querySelectorAll(".tab-btn");
  const closeBtn = document.getElementById("close-flight-info");
  const flightsList = document.getElementById("flights-list");

  // Tabs Klick
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if(btn.dataset.tab === "info") {
        infoTab.classList.remove("hidden");
        planTab.classList.add("hidden");
      } else {
        infoTab.classList.add("hidden");
        planTab.classList.remove("hidden");
      }
    });
  });

  // Close Button
  closeBtn.addEventListener("click", () => flightBox.classList.add("hidden"));

  // Marker und Aktive-Flüge-Liste
  flights.forEach(f => {
    f.marker = L.marker(f.coordsFrom, { icon: planeIcon }).addTo(map)
      .on("click", () => selectFlight(f));

    const li = document.createElement("li");
    li.textContent = `${f.flight}: ${f.from} → ${f.to}`;
    li.addEventListener("click", () => selectFlight(f));
    flightsList.appendChild(li);
  });

  // Flug auswählen und Box füllen
  function selectFlight(flight) {
    flightBox.classList.remove("hidden");
    flightTitle.textContent = flight.flight;

    // Bild basierend auf Flugzeugtyp
    if(flight.type === "A320") {
      planeImage.src = "../assets/pictures/Aircraft/A320/FlightSimulator 2025-08-31 20-02-33_009.png";
    } else if(flight.type === "A350") {
      planeImage.src = "../assets/pictures/Aircraft/A350/FlightSimulator 2025-08-12 22-15-58_724.png";
    } else {
      planeImage.src = "../assets/icons/plane-yellow.png"; // Fallback
    }

    infoTab.innerHTML = `
      <ul>
        <li>Departure: ${flight.from}</li>
        <li>Arrival: ${flight.to}</li>
        <li>Altitude: ${flight.altitude} ft</li>
        <li>Speed: ${flight.speed} kt</li>
      </ul>
    `;

    planTab.innerHTML = `
      <ul>
        <li>Squawk: 1000</li>
        <li>Notes: Vatsim</li>
        <li>Flightplan: EDDB/06R SUKIP3Z SUKIP M748 RARUP RARUP6A EDDH/05</li>
      </ul>
    `;
  }

  // Dummy-Flug Animation
  function moveFlights() {
    flights.forEach(f => {
      const [lat1, lng1] = [f.marker.getLatLng().lat, f.marker.getLatLng().lng];
      const [lat2, lng2] = f.coordsTo;
      const newLat = lat1 + (lat2 - lat1) * 0.0005;
      const newLng = lng1 + (lng2 - lng1) * 0.0005;
      f.marker.setLatLng([newLat, newLng]);
    });
  }
  setInterval(moveFlights, 50);
});
