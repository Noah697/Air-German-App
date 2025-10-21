const fs = require('fs');
const path = require('path');

// Pfad zur JSON-Datei
const newsPath = path.join(__dirname, '../data/news.json');

// Elemente
const form = document.getElementById('newsForm');
const newsList = document.getElementById('newsList');

// Funktion: lade News
function loadNews() {
  if (!fs.existsSync(newsPath)) {
    fs.writeFileSync(newsPath, JSON.stringify([]));
  }

  const data = JSON.parse(fs.readFileSync(newsPath));
  newsList.innerHTML = '';

  data.forEach((news, index) => {
    const item = document.createElement('div');
    item.className = 'news-item';
    item.innerHTML = `
      <h3>${news.title}</h3>
      <p>${news.content}</p>
      <small>${news.date}</small>
      <div class="actions">
        <button onclick="deleteNews(${index})" class="delete">Löschen</button>
      </div>
    `;
    newsList.appendChild(item);
  });
}

// Funktion: lösche News
window.deleteNews = (index) => {
  const data = JSON.parse(fs.readFileSync(newsPath));
  data.splice(index, 1);
  fs.writeFileSync(newsPath, JSON.stringify(data, null, 2));
  loadNews();
};

// Event: neue News hinzufügen
form.addEventListener('submit', (e) => {
  e.preventDefault(); // verhindert Reload

  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();

  if (!title || !content) return;

  const newNews = {
    title,
    content,
    date: new Date().toLocaleString()
  };

  const data = JSON.parse(fs.readFileSync(newsPath));
  data.unshift(newNews);
  fs.writeFileSync(newsPath, JSON.stringify(data, null, 2));

  form.reset();
  loadNews();
});

// lade News direkt beim Start
loadNews();
