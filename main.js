const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const RPC = require("discord-rpc");

require("./api/server"); // Express-Server starten

// -----------------------
// Discord Rich Presence
// -----------------------
const clientId = '1419304036628299878';
const rpc = new RPC.Client({ transport: 'ipc' });

rpc.on('ready', () => {
  rpc.setActivity({
    details: 'Air German Dashboard offen',
    state: 'Im Hauptmenü',
    largeImageKey: 'airgerman_logo', // Name deines Logos im Discord Portal
    largeImageText: 'Air German App',
    startTimestamp: new Date(),
    instance: false
  });
});

rpc.login({ clientId }).catch(console.error);

// -----------------------
// Pfad für Einstellungen
// -----------------------
const settingsPath = path.join(app.getPath("userData"), "settings.json");

// Lade gespeicherte Einstellungen
function loadSettings() {
  if (fs.existsSync(settingsPath)) {
    const data = fs.readFileSync(settingsPath);
    return JSON.parse(data);
  }
  return {};
}

// Speichere Einstellungen
function saveSettings(newSettings) {
  fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2));
}

// -----------------------
// Fenster erstellen
// -----------------------
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    backgroundColor: "#00000000",
    frame: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "assets/details/Air German Logo Black Background.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile("html/index.html");
  win.once("ready-to-show", () => win.show());

  // -----------------------
  // Fenstersteuerung
  // -----------------------
  ipcMain.on("minimize-window", () => win.minimize());
  ipcMain.on("maximize-window", () => {
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  });
  ipcMain.on("close-window", () => win.close());

  // -----------------------
  // Ordner-Dialog für Community-Ordner
  // -----------------------
  ipcMain.handle('open-folder-dialog', async () => {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    });

    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    } else {
      return null;
    }
  });

  // -----------------------
  // IPC zum Speichern / Laden des Community-Folders
  // -----------------------
  ipcMain.handle("save-community-folder", (event, folderPath) => {
    const settings = loadSettings();
    settings.communityFolder = folderPath;
    saveSettings(settings);
  });

  ipcMain.handle("load-community-folder", () => {
    const settings = loadSettings();
    return settings.communityFolder || "";
  });
}

// -----------------------
// App Lifecycle
// -----------------------
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// -----------------------
// Teste lokalen Server
// -----------------------
axios.get("http://localhost:3001/status")
  .then(res => console.log(res.data))
  .catch(err => console.error("Fehler beim Abrufen des Serverstatus:", err));

// -----------------------
// Benutzerregistrierung
// -----------------------
async function registerUser(username, email, password) {
  try {
    const response = await axios.post("http://localhost/airgerman/register.php", {
      username: username,
      email: email,
      password: password
    });
    console.log(response.data); // { success: true/false, message: "..." }
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
  }
}

// Beispiel-Aufruf
registerUser("testuser", "test@mail.com", "123456");
