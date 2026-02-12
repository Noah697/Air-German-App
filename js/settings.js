const { ipcRenderer } = require("electron");

// --------------------
// Dark/White Mode
// --------------------
const toggle = document.getElementById("mode-toggle");
toggle.checked = (localStorage.getItem("mode") !== "white");
toggle.addEventListener("change", (e) => {
  toggleMode(e.target.checked); // Funktion aus theme.js
});

// --------------------
// Toast Funktion
// --------------------
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show " + type;

  setTimeout(() => {
    toast.className = "toast"; // slide wieder raus
  }, 3000);
}

// --------------------
// Notifications + Save
// --------------------
const saveBtn = document.getElementById("save-btn");
const notificationsToggle = document.getElementById("notifications-toggle");
const folderInput = document.getElementById("community-folder-path");
const browseBtn = document.getElementById("browse-folder-btn");

saveBtn.addEventListener("click", async () => {
  try {
    localStorage.setItem("notifications", notificationsToggle.checked);

    if (folderInput?.value) {
      await ipcRenderer.invoke("save-community-folder", folderInput.value);
    }

    showToast(
      currentLang === "de" ? "Einstellungen gespeichert!" : "Settings saved!",
      "success"
    );
  } catch (err) {
    console.error("Fehler beim Speichern des Community-Folders:", err);
    showToast(
      currentLang === "de" ? "Fehler beim Speichern!" : "Error saving settings!",
      "error"
    );
  }
});

// --------------------
// Community Folder
// --------------------
browseBtn?.addEventListener("click", async () => {
  try {
    const folderPath = await ipcRenderer.invoke("open-folder-dialog");
    if (folderPath) folderInput.value = folderPath;
  } catch (err) {
    console.error("Fehler beim Öffnen des Folder-Dialogs:", err);
  }
});

async function loadCommunityFolder() {
  try {
    const savedPath = await ipcRenderer.invoke("load-community-folder");
    folderInput.value = savedPath || "C:\\Users\\Username\\Documents\\AirGerman\\Community";
  } catch (err) {
    console.error("Fehler beim Laden des Community-Folders:", err);
  }
}

loadCommunityFolder();

// --------------------
// Language Switch
// --------------------
const flagDe = document.getElementById("flag-de");
const flagEn = document.getElementById("flag-en");

let currentLang = localStorage.getItem("language") || "en";
updateLanguageUI(currentLang);
applyLanguage(currentLang);

flagDe.addEventListener("click", () => setLanguage("de"));
flagEn.addEventListener("click", () => setLanguage("en"));

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("language", lang);
  updateLanguageUI(lang);
  applyLanguage(lang);
}

function updateLanguageUI(lang) {
  flagDe.classList.toggle("active", lang === "de");
  flagEn.classList.toggle("active", lang === "en");
}

function applyLanguage(lang) {
  const translations = {
    en: {
      "Settings": "Settings",
      "Dark Mode": "Dark Mode",
      "Enable Notifications": "Enable Notifications",
      "Save Settings": "Save Settings",
      "Community Folder": "Community Folder",
      "Path to Community Folder": "Path to Community Folder",
      "Browse": "Browse"
    },
    de: {
      "Settings": "Einstellungen",
      "Dark Mode": "Dunkelmodus",
      "Enable Notifications": "Benachrichtigungen aktivieren",
      "Save Settings": "Einstellungen speichern",
      "Community Folder": "Community-Ordner",
      "Path to Community Folder": "Pfad zum Community-Ordner",
      "Browse": "Durchsuchen"
    }
  };

  document.querySelectorAll(".setting-label, h1, button").forEach(el => {
    const text = el.textContent.trim();
    if (translations[lang][text]) el.textContent = translations[lang][text];
  });
}

// --------------------
// Home Airport
// --------------------
const homeInput = document.getElementById("home-airport-input");

async function loadHomeAirport() {
  try {
    const savedHome = await ipcRenderer.invoke("load-home-airport");
    if (savedHome) homeInput.value = savedHome;
  } catch (err) {
    console.error("Fehler beim Laden des Home Airports:", err);
  }
}

homeInput?.addEventListener("change", async () => {
  try {
    await ipcRenderer.invoke("save-home-airport", homeInput.value.toUpperCase());
    showToast(currentLang === "de" ? "Home Airport gespeichert!" : "Home Airport saved!", "success");
  } catch {
    showToast(currentLang === "de" ? "Fehler beim Speichern!" : "Error saving Home Airport!", "error");
  }
});

loadHomeAirport();

// --------------------
// IVAO / VATSIM Integration
// --------------------
document.getElementById("ivao-btn")?.addEventListener("click", async () => {
  const msg = await ipcRenderer.invoke("connect-network", "IVAO");
  showToast(msg, "success");
});

document.getElementById("vatsim-btn")?.addEventListener("click", async () => {
  const msg = await ipcRenderer.invoke("connect-network", "VATSIM");
  showToast(msg, "success");
});

// --------------------
// Feedback senden
// --------------------
document.getElementById("feedback-btn")?.addEventListener("click", async () => {
  await ipcRenderer.invoke("send-feedback");
  showToast(currentLang === "de" ? "Mail App wird geöffnet..." : "Opening mail app...", "success");
});

// --------------------
// App Version + Changelog direkt aus Electron
// --------------------
async function loadAppInfo() {
  try {
    const version = await ipcRenderer.invoke("get-app-version");
    const changelog = await ipcRenderer.invoke("get-changelog");

    document.getElementById("app-version").textContent = `v${version}`;
    document.getElementById("changelog-box").textContent = changelog;
  } catch (err) {
    console.error("Fehler beim Laden der App-Info:", err);
  }
}

loadAppInfo();
