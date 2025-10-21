const fs = require('fs');
const path = require('path');

window.addEventListener('DOMContentLoaded', () => {
  const newsContainer = document.getElementById('newsContainer');
  const newsPath = path.join(__dirname, '../data/news.json');

  if (!fs.existsSync(newsPath)) {
    fs.writeFileSync(newsPath, JSON.stringify([]));
  }

  const newsData = JSON.parse(fs.readFileSync(newsPath));

  if (newsData.length === 0) {
    newsContainer.innerHTML = `<p class="no-news">No news available at the moment.</p>`;
    return;
  }

  newsData.forEach(news => {
    const card = document.createElement('div');
    card.classList.add('news-card');
    card.innerHTML = `
      <div class="news-content">
        <h3>${news.title}</h3>
        <p>${news.content.length > 100 ? news.content.substring(0, 100) + '...' : news.content}</p>
        <small>${news.date}</small>
<button class="read-more-btn">
  Mehr lesen <span class="arrow-icon">⟶</span>
</button>

      </div>
    `;
    newsContainer.appendChild(card);

    // Klick-Event für das Overlay
    const readMoreBtn = card.querySelector('.read-more-btn');
    readMoreBtn.addEventListener('click', () => {
      openOverlay(news.title, news.content, news.date);
    });
  });

  // Overlay-Referenzen
  const overlay = document.getElementById('newsOverlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayContent = document.getElementById('overlayContent');
  const overlayDate = document.getElementById('overlayDate');
  const closeBtn = document.getElementById('closeOverlay');

  function openOverlay(title, content, date) {
    overlayTitle.textContent = title;
    overlayContent.textContent = content;
    overlayDate.textContent = date;
    overlay.classList.add('active');
  }

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  // Optional: Klick außerhalb schließt Overlay
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
});
