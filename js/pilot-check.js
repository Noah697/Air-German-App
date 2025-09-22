document.querySelectorAll('.icon-link').forEach(link => {
  if(link.title === 'Pilot') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const loggedIn = localStorage.getItem('loggedIn');
      if(loggedIn === 'true') {
        window.location.href = '../html/pilot-page.html';
      } else {
        window.location.href = '../auth/login/login.html';
      }
    });
  }
});
