const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const app = express();
const PORT = 4000;

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

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
