const { app, BrowserWindow } = require("electron");
const path = require("path");

// Express-Server starten
require("./api/server");

function createWindow() {
const win = new BrowserWindow({
  width: 1200,
  height: 800,
  minWidth: 800,
  minHeight: 600,
  show: false,
  backgroundColor: "#00000000", // transparent neutral oder Hex der Default-Farbe
  frame: false,
  autoHideMenuBar: true,
  icon: path.join(__dirname, "assets/details/Air German Logo Black Background.png"),
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
});


  // Lade Frontend
  win.loadFile("html/index.html");

  // Zeige Fenster erst, wenn alles geladen ist
  win.once("ready-to-show", () => win.show());

  // Fenster-Steuerung
  const { ipcMain } = require("electron");
  ipcMain.on("minimize-window", () => win.minimize());
  ipcMain.on("maximize-window", () => {
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  });
  ipcMain.on("close-window", () => win.close());
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

fetch("http://localhost:3001/status")
  .then(res => res.json())
  .then(data => console.log(data));
