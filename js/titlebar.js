const { ipcRenderer } = require("electron");

const minBtn = document.getElementById("min-btn");
const maxBtn = document.getElementById("max-btn");
const closeBtn = document.getElementById("close-btn");

minBtn.addEventListener("click", () => {
  ipcRenderer.send("minimize-window");
});

maxBtn.addEventListener("click", () => {
  ipcRenderer.send("maximize-window");
});

closeBtn.addEventListener("click", () => {
  ipcRenderer.send("close-window");
});
