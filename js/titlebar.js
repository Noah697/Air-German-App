const { ipcRenderer } = require("electron");

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log("Titlebar script loaded");
  
  const minBtn = document.getElementById("min-btn");
  const maxBtn = document.getElementById("max-btn");
  const closeBtn = document.getElementById("close-btn");

  console.log("Button elements:", { minBtn, maxBtn, closeBtn });

  if (minBtn) {
    minBtn.addEventListener("click", () => {
      console.log("Minimize button clicked");
      ipcRenderer.send("minimize-window");
    });
  } else {
    console.error("Minimize button not found!");
  }

  if (maxBtn) {
    maxBtn.addEventListener("click", () => {
      console.log("Maximize button clicked");
      ipcRenderer.send("maximize-window");
    });
  } else {
    console.error("Maximize button not found!");
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      console.log("Close button clicked");
      ipcRenderer.send("close-window");
    });
  } else {
    console.error("Close button not found!");
  }
});

// Fallback if DOM is already loaded
if (document.readyState === 'loading') {
  // Document still loading, event listener will handle it
} else {
  // Document already loaded, run immediately
  const minBtn = document.getElementById("min-btn");
  const maxBtn = document.getElementById("max-btn");
  const closeBtn = document.getElementById("close-btn");

  console.log("Titlebar script loaded (fallback)");
  console.log("Button elements (fallback):", { minBtn, maxBtn, closeBtn });

  if (minBtn && !minBtn.hasAttribute('data-listener-added')) {
    minBtn.setAttribute('data-listener-added', 'true');
    minBtn.addEventListener("click", () => {
      console.log("Minimize button clicked (fallback)");
      ipcRenderer.send("minimize-window");
    });
  }

  if (maxBtn && !maxBtn.hasAttribute('data-listener-added')) {
    maxBtn.setAttribute('data-listener-added', 'true');
    maxBtn.addEventListener("click", () => {
      console.log("Maximize button clicked (fallback)");
      ipcRenderer.send("maximize-window");
    });
  }

  if (closeBtn && !closeBtn.hasAttribute('data-listener-added')) {
    closeBtn.setAttribute('data-listener-added', 'true');
    closeBtn.addEventListener("click", () => {
      console.log("Close button clicked (fallback)");
      ipcRenderer.send("close-window");
    });
  }
}
