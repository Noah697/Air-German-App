const fs = require('fs');
const path = require('path');

const tbody = document.querySelector('.user-table tbody');
const modal = document.getElementById('user-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

modalClose.addEventListener('click', () => modal.style.display = 'none');
modal.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});

// ---- JSON Pfad ----
const usersJsonPath = path.join(__dirname, '../users.json');

// ---- Lade Benutzer ----
function loadUsers() {
  try {
    const data = fs.readFileSync(usersJsonPath, 'utf-8');
    const users = JSON.parse(data);
    window.usersCache = users;
    renderTable(users);
  } catch (err) {
    console.error('[admin-userlist] Fehler beim Laden der JSON:', err);
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:#ff5555;">Fehler beim Laden der Benutzerliste</td></tr>`;
  }
}

// ---- Tabelle rendern ----
function renderTable(users) {
  tbody.innerHTML = '';
  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>KRD${String(user.id).padStart(3,'0')}</td>
      <td>${user.username}</td>
      <td>${user.rank ?? 'Pilot'}</td>
      <td>${user.created_at ? new Date(user.created_at).toLocaleDateString() : '--'}</td>
      <td>${user.last_activity ?? '--'}</td>
      <td>${user.flights ?? 0}</td>
      <td>${user.hours ?? 0}h</td>
      <td><span class="status ${user.status === 'Aktiv' ? 'active' : 'inactive'}">${user.status ?? 'Inaktiv'}</span></td>
      <td>
        <button class="btn-view">Details</button>
        <button class="btn-edit">Bearbeiten</button>
        <button class="btn-delete">Löschen</button>
      </td>
    `;
    tbody.appendChild(tr);

    tr.querySelector('.btn-view').addEventListener('click', () => showDetails(user));
    tr.querySelector('.btn-edit').addEventListener('click', () => showEditModal(user));
    tr.querySelector('.btn-delete').addEventListener('click', () => confirmDelete(user, deleteUser));
  });
}

// ---- Details ----
function showDetails(user) {
  modalTitle.textContent = `Details von ${user.username}`;
  modalBody.innerHTML = `
    <p><strong>ID:</strong> AG${String(user.id).padStart(3,'0')}</p>
    <p><strong>Username:</strong> ${user.username}</p>
    <p><strong>Rang:</strong> ${user.rank ?? '-'}</p>
    <p><strong>Erstellt am:</strong> ${user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</p>
    <p><strong>Status:</strong> ${user.status ?? '-'}</p>
  `;
  modal.style.display = 'flex';
}

// ---- Bearbeiten ----
function showEditModal(user) {
  modalTitle.textContent = `Bearbeite ${user.username}`;
  modalBody.innerHTML = `
    <p><strong>Username:</strong><br><input type="text" id="edit-username" value="${user.username}"></p>
    <p><strong>Rang:</strong><br><input type="text" id="edit-rank" value="${user.rank ?? ''}"></p>
    <p><strong>Status:</strong><br>
      <select id="edit-status">
        <option value="Aktiv" ${user.status === 'Aktiv' ? 'selected' : ''}>Aktiv</option>
        <option value="Inaktiv" ${user.status === 'Inaktiv' ? 'selected' : ''}>Inaktiv</option>
      </select>
    </p>
    <div class="modal-actions">
      <button id="save-edit">Speichern</button>
      <button id="cancel-edit">Abbrechen</button>
    </div>
  `;
  modal.style.display = 'flex';

  document.getElementById('save-edit').addEventListener('click', () => {
    user.username = document.getElementById('edit-username').value.trim();
    user.rank = document.getElementById('edit-rank').value.trim();
    user.status = document.getElementById('edit-status').value;

    saveUsersJson(window.usersCache);
    renderTable(window.usersCache);
    modal.style.display = 'none';
  });

  document.getElementById('cancel-edit').addEventListener('click', () => modal.style.display = 'none');
}

// ---- Löschen ----
function confirmDelete(user, onDelete) {
  modalTitle.textContent = `Benutzer löschen`;
  modalBody.innerHTML = `
    <p>Bist du sicher, dass du <strong>${user.username}</strong> löschen willst?</p>
    <div class="modal-actions">
      <button id="confirm-delete">Ja, löschen</button>
      <button id="cancel-delete">Abbrechen</button>
    </div>
  `;
  modal.style.display = 'flex';

  document.getElementById('confirm-delete').addEventListener('click', () => {
    onDelete(user.id);
    modal.style.display = 'none';
  });

  document.getElementById('cancel-delete').addEventListener('click', () => modal.style.display = 'none');
}

function deleteUser(id) {
  window.usersCache = window.usersCache.filter(u => u.id !== id);
  saveUsersJson(window.usersCache);
  renderTable(window.usersCache);
}

// ---- JSON speichern ----
function saveUsersJson(users) {
  try {
    fs.writeFileSync(usersJsonPath, JSON.stringify(users, null, 2), 'utf-8');
    console.log('[admin-userlist] users.json updated');
  } catch (err) {
    console.error('[admin-userlist] Fehler beim Speichern der JSON:', err);
  }
}

// ---- Init ----
window.addEventListener('DOMContentLoaded', () => {
  loadUsers();
});
