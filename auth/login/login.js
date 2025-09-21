const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
  const username = loginForm.username.value.trim();
  const password = loginForm.password.value.trim();

  if (!username || !password) {
    e.preventDefault();
    alert("Bitte alle Felder ausfüllen!");
  }
});
