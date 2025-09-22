// settings.js
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
// Notifications + Save
// --------------------
const saveBtn = document.getElementById("save-btn");
const notificationsToggle = document.getElementById("notifications-toggle");
const folderInput = document.getElementById("community-folder-path");
const browseBtn = document.getElementById("browse-folder-btn");

saveBtn.addEventListener("click", async () => {
  // Notifications speichern
  localStorage.setItem("notifications", notificationsToggle.checked);

  // Community-Folder speichern
  if (folderInput?.value) {
    try {
      await ipcRenderer.invoke("save-community-folder", folderInput.value);
    } catch (err) {
      console.error("Fehler beim Speichern des Community-Folders:", err);
    }
  }

  alert("Settings saved!");
});

// --------------------
// Community Folder
// --------------------

// Browse-Button
if (browseBtn) {
  browseBtn.addEventListener("click", async () => {
    try {
      const folderPath = await ipcRenderer.invoke("open-folder-dialog");
      if (folderPath) folderInput.value = folderPath;
    } catch (err) {
      console.error("Fehler beim Öffnen des Folder-Dialogs:", err);
    }
  });
}

// Community-Folder beim Start laden
async function loadCommunityFolder() {
  try {
    const savedPath = await ipcRenderer.invoke("load-community-folder");
    folderInput.value = savedPath || "C:\\Users\\Username\\Documents\\AirGerman\\Community";
  } catch (err) {
    console.error("Fehler beim Laden des Community-Folders:", err);
  }
}

loadCommunityFolder();
