// theme.js
const body = document.body;
const savedMode = localStorage.getItem('mode') || 'dark';

if (savedMode === 'dark') {
  body.classList.add('dark-mode');
} else {
  body.classList.add('white-mode');
}

// Funktion, um Mode per Toggle zu ändern
function toggleMode(isDark) {
  if (isDark) {
    body.classList.remove('white-mode');
    body.classList.add('dark-mode');
    localStorage.setItem('mode', 'dark');
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('white-mode');
    localStorage.setItem('mode', 'white');
  }
}
