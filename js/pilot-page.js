const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", async () => {
  const uploadInput = document.getElementById("upload-img");
  const profileImg = document.getElementById("profile-img");
  const usernameElement = document.querySelector(".profile-info h1");

  // 🔹 Profilbild beim Laden abrufen
  ipcRenderer.invoke("get-profile-image").then((filePath) => {
    if (filePath) {
      profileImg.src = filePath;
    }
  });

  // 🔹 Neues Bild hochladen
  uploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      ipcRenderer.invoke("save-profile-image", file.path).then((savedPath) => {
        if (savedPath) {
          profileImg.src = savedPath;
        }
      });
    }
  });

  // 🔹 Benutzernamen aus users.json anzeigen
  const loggedUsername = localStorage.getItem("loggedUser"); // username nach Login speichern
  if (!loggedUsername) {
    usernameElement.textContent = "Max Mustermann"; // Fallback
    return;
  }

  try {
    const response = await fetch("../auth/users.json"); // Pfad anpassen
    const users = await response.json();
    const user = users.find((u) => u.username === loggedUsername);

    if (user) {
      usernameElement.textContent = user.username;
    } else {
      usernameElement.textContent = "Max Mustermann"; // Fallback
    }
  } catch (err) {
    console.error("Fehler beim Laden der Benutzer:", err);
    usernameElement.textContent = "Max Mustermann"; // Fallback
  }
});
