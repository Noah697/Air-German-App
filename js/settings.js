// Dark/White Mode Toggle
const toggle = document.getElementById('mode-toggle');
toggle.checked = (localStorage.getItem('mode') !== 'white');

toggle.addEventListener('change', (e) => {
  toggleMode(e.target.checked); // Funktion aus theme.js
});

// Save Button (z.B. Notifications)
document.getElementById('save-btn').addEventListener('click', () => {
  const notificationsEnabled = document.getElementById('notifications-toggle').checked;
  localStorage.setItem('notifications', notificationsEnabled);
  alert('Settings saved!');
});
