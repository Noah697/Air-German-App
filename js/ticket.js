document.addEventListener("DOMContentLoaded", async () => {
  const modal = document.getElementById("newTicketModal");
  const btn = document.getElementById("newTicketBtn");
  const closeModal = document.getElementById("closeModal");
  const form = document.getElementById("ticketForm");
  const list = document.getElementById("ticketList");
  const dynamicFields = document.getElementById("dynamicFields");

  // ---------- Benutzer aus localStorage laden ----------
  let user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.username) {
    window.location.href = "../auth/login/login.html";
    return;
  }

  // ---------- Username & Datum in Formular setzen ----------
  const usernameField = document.getElementById("ticketUser");
  const dateField = document.getElementById("ticketDate");

  if (usernameField) usernameField.value = user.username ?? "Pilot";
  if (dateField) dateField.value = new Date().toLocaleString();

  // ---------- Modal öffnen/schließen ----------
  btn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeModal.addEventListener("click", () => modal.classList.add("hidden"));

  // ---------- Dynamische Felder (z. B. Bug Screenshot) ----------
  document.getElementById("ticketSubject").addEventListener("change", (e) => {
    if (e.target.value === "bug") {
      dynamicFields.innerHTML = `
        <label>Datei/Screenshot:</label>
        <input type="file" id="ticketFile">
      `;
    } else {
      dynamicFields.innerHTML = "";
    }
  });

  // ---------- Funktion für AIRAC-ID ----------
  function generateTicketId() {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2); // "25"
    const month = String(now.getMonth() + 1).padStart(2, "0"); // "10"
    const baseId = `${year}${month}`; // "2510"

    // vorhandene Tickets laden
    const tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
    const sameMonthTickets = tickets.filter(t => t.id.toString().startsWith(baseId));

    const nextNum = sameMonthTickets.length + 1; // nächste Ticketnummer
    const paddedNum = String(nextNum).padStart(2, "0"); // z.B. "01", "02"
    return `${baseId}${paddedNum}`; // ergibt z.B. "251001"
  }

  // ---------- Neues Ticket erstellen ----------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const ticketId = generateTicketId();

    const newTicket = {
      id: ticketId,
      user: user.username,
      date: new Date().toLocaleString(),
      subject: form.ticketSubject.value,
      status: "waiting"
    };

    const tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
    tickets.push(newTicket);
    localStorage.setItem("tickets", JSON.stringify(tickets));

    // Erste Nachricht speichern
    const messages = JSON.parse(localStorage.getItem("messages") || "[]");
    messages.push({
      ticketId: ticketId,
      sender: user.username,
      text: form.ticketMessage.value,
      date: new Date().toLocaleString()
    });
    localStorage.setItem("messages", JSON.stringify(messages));

    form.reset();
    modal.classList.add("hidden");
    renderTickets();
  });

  // ---------- Tickets anzeigen ----------
  function renderTickets() {
    const tickets = JSON.parse(localStorage.getItem("tickets") || "[]")
      .filter(t => t.user === user.username);

    list.innerHTML = tickets.length
      ? tickets.map(t => `
            <tr>
              <td>${t.id}</td>
              <td>${t.date}</td>
              <td>${t.subject}</td>
              <td><span class="status ${t.status}">${statusText(t.status)}</span></td>
              <td><button onclick="openTicket('${t.id}')">Öffnen</button></td>
            </tr>
          `).join("")
      : `<tr><td colspan="5">Keine Tickets vorhanden.</td></tr>`;
  }

  function statusText(s) {
    switch (s) {
      case "waiting": return "Wartet auf Antwort";
      case "answered": return "Beantwortet";
      case "closed": return "Geschlossen";
      default: return s;
    }
  }

  window.openTicket = function(id) {
    window.location.href = `pilot-ticket-view.html?id=${id}`;
  };

  renderTickets();
});
