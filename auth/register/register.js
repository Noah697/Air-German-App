const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', (e) => {
  const username = registerForm.username.value.trim();
  const password = registerForm.password.value.trim();
  const passwordConfirm = registerForm.password_confirm.value.trim();

  if (!username || !password || !passwordConfirm) {
    e.preventDefault();
    alert("Bitte alle Felder ausfüllen!");
    return;
  }

  if (password !== passwordConfirm) {
    e.preventDefault();
    alert("Passwörter stimmen nicht überein!");
    return;
  }
});
