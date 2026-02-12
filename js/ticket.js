import { db } from "../firebase.js";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", async () => {
  const modal = document.getElementById("newTicketModal");
  const btn = document.getElementById("newTicketBtn");
  const closeModal = document.getElementById("closeModal");
  const form = document.getElementById("ticketForm");
  const list = document.getElementById("ticketList");
  const dynamicFields = document.getElementById("dynamicFields");

  // ---------- Benutzer laden ----------
  let user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.username) {
    window.location.href = "../auth/login/login.html";
    return;
  }

  // ---------- Username & Datum ----------
  const usernameField = document.getElementById("ticketUser");
  const dateField = document.getElementById("ticketDate");
  if (usernameField) usernameField.value = user.username;
  if (dateField) dateField.value = new Date().toLocaleString();

  // ---------- Modal ----------
  btn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeModal.addEventListener("click", () => modal.classList.add("hidden"));

  // ---------- Dynamische Felder ----------
  document.getElementById("ticketSubject").addEventListener("change", (e) => {
    dynamicFields.innerHTML = e.target.value === "bug"
      ? `<label>Datei/Screenshot:</label><input type="file" id="ticketFile">`
      : "";
  });

  // ---------- AIRAC-ID ----------
  function generateTicketId() {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}${month}${Math.floor(Math.random() * 90 + 10)}`; // z. B. 251006
  }

  // ---------- Neues Ticket erstellen ----------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ticketId = generateTicketId();

    try {
      // Neues Ticket speichern
      await addDoc(collection(db, "tickets"), {
        id: ticketId,
        user: user.username,
        date: new Date().toLocaleString(),
        subject: form.ticketSubject.value,
        status: "waiting"
      });

      // Erste Nachricht speichern
      await addDoc(collection(db, `tickets/${ticketId}/messages`), {
        sender: user.username,
        text: form.ticketMessage.value,
        date: new Date().toLocaleString()
      });

      form.reset();
      modal.classList.add("hidden");
      await renderTickets();
    } catch (err) {
      console.error("Fehler beim Erstellen:", err);
    }
  });

  // ---------- Tickets laden ----------
  async function renderTickets() {
    const q = query(
      collection(db, "tickets"),
      where("user", "==", user.username),
      orderBy("date", "desc")
    );
    const querySnap = await getDocs(q);
    const tickets = querySnap.docs.map(doc => doc.data());

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
