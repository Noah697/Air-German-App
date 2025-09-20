// simbridge/index.js
const WebSocket = require("ws");
const express = require("express");
const { apiPort, wsPort } = require("./config"); // Ports aus Config importieren
const { getDummyFlights } = require("./utils"); // Hilfsfunktion für Dummy-Flüge

const app = express();

// =======================
// Express-Server
// =======================
app.get("/status", (req, res) => {
  res.json({ status: "SimBridge läuft!" });
});

// Start Express Server
app.listen(apiPort, () =>
  console.log(`SimBridge API läuft auf http://localhost:${apiPort}`)
);

// =======================
// WebSocket Server
// =======================
const wss = new WebSocket.Server({ port: wsPort });

wss.on("connection", ws => {
  console.log("Client verbunden");
  ws.send(JSON.stringify({ msg: "Willkommen beim SimBridge WS Server" }));

  // Intervall zum periodischen Senden von Dummy-Flügen
  const interval = setInterval(() => {
    const flights = getDummyFlights(); // Array von Dummy-Flügen
    ws.send(JSON.stringify({ type: "flight-update", data: flights }));
  }, 2000);

  ws.on("message", message => {
    console.log("Empfangen:", message);
    // Hier kannst du z.B. Client-Anfragen auswerten
  });

  ws.on("close", () => {
    console.log("Client getrennt");
    clearInterval(interval);
  });
});
