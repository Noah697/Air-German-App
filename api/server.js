const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 4000;

// -------------------------------------
// USER HANDLING (DEIN ORIGINAL-CODE)
// -------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..")));

function saveUserToJson(username, email, hashedPassword) {
    const usersFile = path.join(__dirname, "..", "users.json");
    
    try {
        if (!fs.existsSync(usersFile)) {
            fs.writeFileSync(usersFile, JSON.stringify([]));
        }
        
        const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '[]');
        
        for (const user of usersData) {
            if (user.username === username || (email && user.email === email)) {
                return { success: false, message: "Benutzername oder E-Mail bereits vergeben." };
            }
        }
        
        const newUser = {
            id: usersData.length + 1,
            username: username,
            password: hashedPassword,
            created_at: new Date().toISOString()
        };
        
        if (email) {
            newUser.email = email;
        }
        
        usersData.push(newUser);
        
        fs.writeFileSync(usersFile, JSON.stringify(usersData, null, 2));
        return { success: true, message: "Registrierung erfolgreich!" };
        
    } catch (error) {
        console.error("Error saving user:", error);
        return { success: false, message: "Fehler beim Speichern des Benutzers." };
    }
}

app.post("/api/register", async (req, res) => {
    const { username, email, password, password_confirm } = req.body;

    if (!username || !password) {
        return res.json({
            success: false,
            message: "Benutzername und Passwort sind erforderlich."
        });
    }
    
    if (password_confirm && password !== password_confirm) {
        return res.json({
            success: false,
            message: "Passwörter stimmen nicht überein."
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = saveUserToJson(username, email, hashedPassword);
        res.json(result);
        
    } catch (error) {
        console.error("Registration error:", error);
        res.json({
            success: false,
            message: "Fehler bei der Registrierung."
        });
    }
});

function findUserInJson(username) {
    const usersFile = path.join(__dirname, "..", "users.json");
    
    try {
        if (!fs.existsSync(usersFile)) {
            return null;
        }
        
        const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '[]');
        return usersData.find(user => user.username === username);
        
    } catch (error) {
        console.error("Error reading user data:", error);
        return null;
    }
}

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({
            success: false,
            message: "Benutzername und Passwort sind erforderlich."
        });
    }

    try {
        const user = findUserInJson(username);
        
        if (!user) {
            return res.json({
                success: false,
                message: "Benutzer nicht gefunden."
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (passwordMatch) {
            res.json({
                success: true,
                message: "Login erfolgreich!",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email || null
                }
            });
        } else {
            res.json({
                success: false,
                message: "Falsches Passwort."
            });
        }
        
    } catch (error) {
        console.error("Login error:", error);
        res.json({
            success: false,
            message: "Fehler beim Login."
        });
    }
});

app.get("/api/status", (req, res) => {
  res.json({ message: "Air German API läuft 🚀" });
});

// -------------------------------------
// ✈️ NEUER TEIL: FLIGHT API
// -------------------------------------

// Pfad zur Flights-JSON
const flightsFile = path.join(__dirname, "..", "json", "flights.json");

// Testflüge beim ersten Start erstellen
if (!fs.existsSync(flightsFile)) {
    const initialFlights = [
        {
            flightNumber: "AB123",
            callsign: "AB123",
            departure: "BER",
            arrival: "MUC",
            aircraft: "A320",
            flightLevel: "FL350",
            status: "Available"
        },
        {
            flightNumber: "CD456",
            callsign: "CD456",
            departure: "MUC",
            arrival: "HAM",
            aircraft: "B737",
            flightLevel: "FL360",
            status: "Available"
        }
    ];
    fs.writeFileSync(flightsFile, JSON.stringify(initialFlights, null, 2));
    console.log("Testflüge erstellt in flights.json");
}

// Flüge abrufen
app.get("/api/flights", (req, res) => {
    try {
        if (!fs.existsSync(flightsFile)) {
            fs.writeFileSync(flightsFile, JSON.stringify([], null, 2));
        }

        const flightsData = JSON.parse(fs.readFileSync(flightsFile, "utf8") || "[]");
        res.json(flightsData);
    } catch (err) {
        console.error("Fehler beim Lesen der flights.json:", err);
        res.status(500).json({ error: "Fehler beim Laden der Flugdaten." });
    }
});

// Flug hinzufügen (Admin)
app.post("/api/flights/add", (req, res) => {
    const { flightNumber, callsign, departure, arrival, aircraft, flightLevel, status } = req.body;

    if (!flightNumber || !callsign || !departure || !arrival || !aircraft) {
        return res.status(400).json({ error: "Fehlende Felder beim Hinzufügen eines Fluges." });
    }

    try {
        let flightsData = [];
        if (fs.existsSync(flightsFile)) {
            flightsData = JSON.parse(fs.readFileSync(flightsFile, "utf8") || "[]");
        }

        const newFlight = {
            id: flightsData.length + 1,
            flightNumber,
            callsign,
            departure,
            arrival,
            aircraft,
            flightLevel: flightLevel || "FL350",
            status: status || "Available"
        };

        flightsData.push(newFlight);
        fs.writeFileSync(flightsFile, JSON.stringify(flightsData, null, 2));
        res.json({ success: true, message: "Flug erfolgreich hinzugefügt!", flight: newFlight });
    } catch (err) {
        console.error("Fehler beim Hinzufügen des Fluges:", err);
        res.status(500).json({ error: "Fehler beim Hinzufügen des Fluges." });
    }
});

// Flug buchen
app.post("/api/flights/book", (req, res) => {
    const { flightNumber, pilotName } = req.body;

    if (!flightNumber || !pilotName) {
        return res.status(400).json({ success: false, message: "Flugnummer und Pilotname erforderlich." });
    }

    try {
        if (!fs.existsSync(flightsFile)) {
            fs.writeFileSync(flightsFile, JSON.stringify([], null, 2));
        }

        let flightsData = JSON.parse(fs.readFileSync(flightsFile, "utf8") || "[]");
        const flight = flightsData.find(f => f.flightNumber === flightNumber);

        if (!flight) {
            return res.status(404).json({ success: false, message: "Flug nicht gefunden." });
        }

        if ((flight.status || "").toUpperCase() !== "AVAILABLE") {
            return res.status(400).json({ success: false, message: "Flug nicht verfügbar." });
        }

        // Flug buchen
        flight.status = "Booked";
        flight.pilot = pilotName;

        fs.writeFileSync(flightsFile, JSON.stringify(flightsData, null, 2));

        res.json({ success: true, message: `Flug ${flightNumber} erfolgreich gebucht von ${pilotName}.` });
    } catch (err) {
        console.error("Fehler beim Buchen des Fluges:", err);
        res.status(500).json({ success: false, message: "Fehler beim Buchen des Fluges." });
    }
});

// -------------------------------------

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
