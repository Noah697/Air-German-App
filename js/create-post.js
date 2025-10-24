const fs = require('fs');
const path = require('path');

const form = document.getElementById('create-post-form');
const threadsFilePath = path.join(__dirname, '../data/threads.json');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const category = document.getElementById('category').value.trim();
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const screenshotFile = document.getElementById('screenshot').files[0];

  if (!category || !title || !content) {
    return alert('Bitte alle Pflichtfelder ausfüllen!');
  }

  const newPost = { category, title, content };

  if (screenshotFile) {
    const reader = new FileReader();
    reader.onload = function() {
      newPost.screenshot = reader.result;
      savePost(newPost);
    };
    reader.readAsDataURL(screenshotFile);
  } else {
    savePost(newPost);
  }
});

function savePost(post) {
  fs.readFile(threadsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Fehler beim Lesen von threads.json:', err);
      return alert('Fehler beim Speichern des Posts!');
    }

    let threads = [];
    try {
      threads = JSON.parse(data);
    } catch (e) {
      console.error('Fehler beim Parsen von threads.json:', e);
    }

    threads.push(post);

    fs.writeFile(threadsFilePath, JSON.stringify(threads, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Fehler beim Schreiben in threads.json:', err);
        return alert('Fehler beim Speichern des Posts!');
      }

      alert('Post erfolgreich erstellt!');
      window.location.href = 'forum.html';
    });
  });
}
