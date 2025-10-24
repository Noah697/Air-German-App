const forumContainer = document.getElementById('forum-container');

// Beispiel: threads.json im data-Ordner
fetch('../data/threads.json')
  .then(response => response.json())
  .then(threads => {
    forumContainer.innerHTML = ''; // Container leeren

    threads.forEach(thread => {
      // Thread-Card erstellen
      const card = document.createElement('div');
      card.classList.add('thread-card');

      const title = document.createElement('h3');
      title.textContent = thread.title;
      card.appendChild(title);

      const category = document.createElement('p');
      category.textContent = `Kategorie: ${thread.category}`;
      card.appendChild(category);

      const snippet = document.createElement('p');
      snippet.textContent = thread.content.length > 100
        ? thread.content.substring(0, 100) + '...'
        : thread.content;
      card.appendChild(snippet);

      if (thread.screenshot) {
        const img = document.createElement('img');
        img.src = thread.screenshot;
        card.appendChild(img);
      }

      // Read More Button
      const readMoreBtn = document.createElement('button');
      readMoreBtn.textContent = 'Read More';
      readMoreBtn.addEventListener('click', () => {
        window.location.href = `forum-view.html?id=${thread.id}`;
      });
      card.appendChild(readMoreBtn);

      forumContainer.appendChild(card);
    });
  })
  .catch(err => console.error('Fehler beim Laden der Threads:', err));
