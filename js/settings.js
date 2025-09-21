const { ipcRenderer } = require('electron');

// --- Dark/White Mode ---
const toggle = document.getElementById('mode-toggle');
toggle.checked = (localStorage.getItem('mode') !== 'white');
if (toggle.checked) document.body.classList.add('dark-mode');
else document.body.classList.add('white-mode');

toggle.addEventListener('change', (e) => {
  const isDark = e.target.checked;
  if (isDark) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('white-mode');
    localStorage.setItem('mode', 'dark');
  } else {
    document.body.classList.add('white-mode');
    document.body.classList.remove('dark-mode');
    localStorage.setItem('mode', 'white');
  }
});

// --- Notifications & Community Folder ---
const saveBtn = document.getElementById('save-btn');
const notificationsToggle = document.getElementById('notifications-toggle');
const browseBtn = document.getElementById('browse-folder-btn');
const folderInput = document.getElementById('community-folder-path');

(async () => {
  const savedPath = await ipcRenderer.invoke('load-community-folder');
  folderInput.value = savedPath || "C:\\Users\\Username\\Documents\\AirGerman\\Community";
  notificationsToggle.checked = (localStorage.getItem('notifications') === 'true');
})();

browseBtn.addEventListener('click', async () => {
  const folderPath = await ipcRenderer.invoke('open-folder-dialog');
  if (folderPath) folderInput.value = folderPath;
});

saveBtn.addEventListener('click', async () => {
  localStorage.setItem('notifications', notificationsToggle.checked);
  if (folderInput.value) await ipcRenderer.invoke('save-community-folder', folderInput.value);
  alert('Settings saved!');
});
