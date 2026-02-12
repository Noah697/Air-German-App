// -----------------------
// Imports
// -----------------------
const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const RPC = require("discord-rpc");

require("./api/server"); // Express-Server starten

// -----------------------
// Discord Rich Presence
// -----------------------
const clientId = "1419304036628299878";
const rpc = new RPC.Client({ transport: "ipc" });

rpc.on("ready", () => {
  rpc.setActivity({
    details: "Air German Dashboard offen",
    state: "Im HauptmenÃ¼",
    largeImageKey: "airgerman_logo",
    largeImageText: "Air German App",
    startTimestamp: new Date(),
    instance: false,
  });
});

rpc.login({ clientId }).catch(console.error);

// -----------------------
// Pfad fÃ¼r Einstellungen
// -----------------------
let settingsPath; // declare globally

app.whenReady().then(() => {
  settingsPath = path.join(app.getPath("userData"), "settings.json");
  console.log("Settings path:", settingsPath);
  createWindow(); // create window after app is ready and path is known
});

// -----------------------
// Einstellungen laden / speichern
// -----------------------
function loadSettings() {
  try {
    if (settingsPath && fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Fehler beim Laden der Einstellungen:", err);
  }
  return {};
}

function saveSettings(newSettings) {
  try {
    if (!settingsPath) {
      console.error("settingsPath ist noch nicht definiert!");
      return;
    }
    fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2));
  } catch (err) {
    console.error("Fehler beim Speichern der Einstellungen:", err);
  }
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
      contextIsolation: false,
    },
  });

  win.loadFile("html/index.html");
  win.once("ready-to-show", () => win.show());

  // Fenstersteuerung
  ipcMain.on("minimize-window", () => win.minimize());
  ipcMain.on("maximize-window", () => {
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  });
  ipcMain.on("close-window", () => win.close());

  // Ordner-Dialog
  ipcMain.handle("open-folder-dialog", async () => {
    const result = await dialog.showOpenDialog(win, { properties: ["openDirectory"] });
    if (!result.canceled && result.filePaths.length > 0) return result.filePaths[0];
    return null;
  });

  // Community Folder
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
// Neue Air German Settings
// -----------------------
ipcMain.handle("save-home-airport", (event, code) => {
  const settings = loadSettings();
  settings.homeAirport = code;
  saveSettings(settings);
});

ipcMain.handle("load-home-airport", () => {
  const settings = loadSettings();
  return settings.homeAirport || "";
});

// -----------------------
// IVAO/VATSIM Integration
// -----------------------
const VATSIM_CLIENT_ID = "DEIN_CLIENT_ID";
const VATSIM_CLIENT_SECRET = "DEIN_CLIENT_SECRET";
const VATSIM_REDIRECT_URI = "airgerman://vatsim";

ipcMain.handle("connect-network", async (event, network) => {
  if (network === "VATSIM") {
    return new Promise((resolve) => {
      const scope = "full_name vatsim_details";
      const authUrl = `https://auth.vatsim.net/oauth/authorize?client_id=${VATSIM_CLIENT_ID}&scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(VATSIM_REDIRECT_URI)}`;

      const authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: { nodeIntegration: false, contextIsolation: true },
      });

      authWindow.loadURL(authUrl);

      const handleRedirect = async (url) => {
        if (url.startsWith(VATSIM_REDIRECT_URI)) {
          const urlObj = new URL(url);
          const code = urlObj.searchParams.get("code");
          authWindow.close();

          try {
            const tokenResp = await axios.post("https://vatsim.dev/api/connect-api/get-token", {
              client_id: VATSIM_CLIENT_ID,
              client_secret: VATSIM_CLIENT_SECRET,
              code,
              grant_type: "authorization_code",
              redirect_uri: VATSIM_REDIRECT_URI,
            });

            const accessToken = tokenResp.data.access_token;

            const userResp = await axios.get("https://vatsim.dev/api/connect-api/get-user", {
              headers: { Authorization: `Bearer ${accessToken}` },
            });

            const settings = loadSettings();
            settings.vatsim = {
              token: accessToken,
              user: userResp.data,
            };
            saveSettings(settings);

            resolve(`VATSIM account connected: ${userResp.data.full_name}`);
          } catch (err) {
            console.error(err);
            resolve("Fehler beim Verbinden mit VATSIM!");
          }
        }
      };

      authWindow.webContents.on("will-redirect", (event, url) => handleRedirect(url));
      authWindow.on("closed", () => resolve("VATSIM Auth Fenster geschlossen!"));
    });
  }

  if (network === "IVAO") {
    return "IVAO Integration noch nicht implementiert";
  }
});

// -----------------------
// Feedback senden
// -----------------------
ipcMain.handle("send-feedback", () => {
  shell.openExternal("mailto:airgerman@outlook.de");
  return true;
});

// -----------------------
// App-Version + Changelog
// -----------------------
ipcMain.handle("get-app-version", () => app.getVersion());

ipcMain.handle("get-changelog", () => {
  const changelogPath = path.join(__dirname, "CHANGELOG.txt");
  if (fs.existsSync(changelogPath)) return fs.readFileSync(changelogPath, "utf8");
  return "No changelog found.";
});

// -----------------------
// App Lifecycle
// -----------------------
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// -----------------------
// Teste lokalen Server
// -----------------------
axios
  .get("http://5.230.70.197:6666/status")
  .then((res) => console.log(res.data))
  .catch((err) => console.error("Fehler beim Abrufen des Serverstatus:", err));

// -----------------------
// Benutzerregistrierung
// -----------------------
async function registerUser(username, email, password) {
  try {
    const response = await axios.post("http://localhost:4000/airgerman/register.php", {
      username,
      email,
      password,
    });
    console.log(response.data);
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
  }
}

// Beispiel-Aufruf
registerUser("testuser", "test@mail.com", "123456");
