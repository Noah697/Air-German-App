const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Always prevent default form submission
  
  const username = loginForm.username.value.trim();
  const password = loginForm.password.value.trim();

  if (!username || !password) {
    alert("Bitte alle Felder ausfüllen!");
    return;
  }

  try {
    // Send login data to the Express server
    const response = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    const result = await response.json();

    if (result.success) {
      // Store user info in localStorage for session management
      localStorage.setItem('user', JSON.stringify(result.user));
      
      alert('Login erfolgreich!');
      window.location.href = '../../html/index.html';
    } else {
      alert(result.message || 'Fehler beim Login');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Fehler bei der Verbindung zum Server');
  }
});
