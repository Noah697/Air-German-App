const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Always prevent default form submission
  
  const username = registerForm.username.value.trim();
  const password = registerForm.password.value.trim();
  const passwordConfirm = registerForm.password_confirm.value.trim();

  if (!username || !password || !passwordConfirm) {
    alert("Bitte alle Felder ausfüllen!");
    return;
  }

  if (password !== passwordConfirm) {
    alert("Passwörter stimmen nicht überein!");
    return;
  }

  try {
    // Send registration data to the Express server
    const response = await fetch('http://localhost:4000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        password_confirm: passwordConfirm
      })
    });

    const result = await response.json();

    if (result.success) {
      alert('Registrierung erfolgreich! Bitte einloggen');
      window.location.href = '../login/login.html';
    } else {
      alert(result.message || 'Fehler bei der Registrierung');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Fehler bei der Verbindung zum Server');
  }
});
