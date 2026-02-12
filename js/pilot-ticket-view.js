import { db } from "../firebase.js";
import { doc, getDoc, addDoc, collection, onSnapshot } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", async () => {
  const ticketDetails = document.getElementById("ticketDetails");
  const chatMessages = document.getElementById("chatMessages");
  const userInput = document.getElementById("userMessage");
  const sendBtn = document.getElementById("sendMessageBtn");
  const backBtn = document.getElementById("backBtn");

  const params = new URLSearchParams(window.location.search);
  const ticketId = params.get("id");

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const username = userData.username || "Pilot";

  // ---------- Ticket laden ----------
  const ticketRef = doc(db, "tickets", ticketId);
  const ticketSnap = await getDoc(ticketRef);
  if (!ticketSnap.exists()) {
    ticketDetails.innerHTML = `<p style="color:red;">Ticket nicht gefunden!</p>`;
    userInput.style.display = sendBtn.style.display = "none";
    return;
  }

  const ticket = ticketSnap.data();

  renderDetails(ticket);
  listenToMessages(ticketId);

  // ---------- Nachrichten anzeigen ----------
  function listenToMessages(ticketId) {
    const messagesRef = collection(db, `tickets/${ticketId}/messages`);
    onSnapshot(messagesRef, (snapshot) => {
      const messages = snapshot.docs.map(doc => doc.data());
      chatMessages.innerHTML = messages.map(m => `
        <div class="message ${m.sender === username ? "user" : "admin"}">
          <strong>${m.sender}:</strong> ${m.text}<br>
          <small>${m.date}</small>
        </div>
      `).join("");
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }

  function renderDetails(ticket) {
    const statusLabel = {waiting:"Wartet auf Antwort", answered:"Beantwortet", closed:"Geschlossen"}[ticket.status] || ticket.status;
    ticketDetails.innerHTML = `
      <p><strong>ID:</strong> #${ticket.id}</p>
      <p><strong>Benutzer:</strong> ${ticket.user}</p>
      <p><strong>Datum:</strong> ${ticket.date}</p>
      <p><strong>Betreff:</strong> ${ticket.subject}</p>
      <p><strong>Status:</strong> ${statusLabel}</p>
    `;
  }

  // ---------- Nachricht senden ----------
  async function sendMessage() {
    if (!userInput.value.trim()) return;
    await addDoc(collection(db, `tickets/${ticketId}/messages`), {
      sender: username,
      text: userInput.value.trim(),
      date: new Date().toLocaleString()
    });
    userInput.value = "";
  }

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  backBtn.addEventListener("click", () => window.history.back());
});
