// titlebar.js
document.addEventListener("DOMContentLoaded", () => {
  const { ipcRenderer } = require("electron");

  const minBtn = document.getElementById("min-btn");
  const maxBtn = document.getElementById("max-btn");
  const closeBtn = document.getElementById("close-btn");

  if (minBtn) minBtn.addEventListener("click", () => ipcRenderer.send("minimize-window"));
  if (maxBtn) maxBtn.addEventListener("click", () => ipcRenderer.send("maximize-window"));
  if (closeBtn) closeBtn.addEventListener("click", () => ipcRenderer.send("close-window"));
});
