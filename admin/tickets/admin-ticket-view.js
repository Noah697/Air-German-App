import { db } from "../firebase.js";
import { doc, getDoc, addDoc, collection, onSnapshot, updateDoc } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", async () => {
  const ticketDetails = document.getElementById("ticketDetails");
  const chatMessages = document.getElementById("chatMessages");
  const replyInput = document.getElementById("adminReply");
  const sendReplyBtn = document.getElementById("sendReplyBtn");
  const backBtn = document.getElementById("backBtn");
  const closeBtn = document.getElementById("closeTicketBtn");
  const reopenBtn = document.getElementById("reopenTicketBtn");

  const ticketId = new URLSearchParams(window.location.search).get("ticket");
  if (!ticketId) return alert("Kein Ticket angegeben!");

  const ticketRef = doc(db, "tickets", ticketId);
  const ticketSnap = await getDoc(ticketRef);

  if (!ticketSnap.exists()) {
    ticketDetails.innerHTML = `<p style="color:red;">Ticket nicht gefunden!</p>`;
    return;
  }

  const ticket = ticketSnap.data();
  renderDetails(ticket);
  updateTicketButtons(ticket.status);

  // ---------- Chat live laden ----------
  const messagesRef = collection(db, `tickets/${ticketId}/messages`);
  onSnapshot(messagesRef, (snapshot) => {
    const messages = snapshot.docs.map(doc => doc.data());
    chatMessages.innerHTML = messages.map(m => `
      <div class="message ${m.sender === "admin" ? "admin" : "user"}">
        <strong>${m.sender}:</strong> ${m.text}<br>
        <small>${m.date}</small>
      </div>
    `).join("");
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  // ---------- Nachricht senden ----------
  sendReplyBtn.addEventListener("click", async () => {
    const text = replyInput.value.trim();
    if (!text) return;

    await addDoc(messagesRef, {
      sender: "admin",
      text,
      date: new Date().toLocaleString()
    });

    await updateDoc(ticketRef, { status: "answered" });
    replyInput.value = "";
  });

  // ---------- Ticket schließen ----------
  closeBtn.addEventListener("click", async () => {
    await updateDoc(ticketRef, { status: "closed" });
    updateTicketButtons("closed");
    alert("Ticket geschlossen.");
  });

  // ---------- Ticket wieder öffnen ----------
  reopenBtn.addEventListener("click", async () => {
    await updateDoc(ticketRef, { status: "open" });
    updateTicketButtons("open");
    alert("Ticket wieder geöffnet.");
  });

  backBtn.addEventListener("click", () => window.history.back());

  function renderDetails(ticket) {
    const statusLabel = {
      waiting: "Wartet auf Antwort",
      answered: "Beantwortet",
      closed: "Geschlossen",
      open: "Offen"
    }[ticket.status] || ticket.status;

    ticketDetails.innerHTML = `
      <p><strong>ID:</strong> #${ticket.id}</p>
      <p><strong>Benutzer:</strong> ${ticket.user}</p>
      <p><strong>Datum:</strong> ${ticket.date}</p>
      <p><strong>Betreff:</strong> ${ticket.subject}</p>
      <p><strong>Status:</strong> ${statusLabel}</p>
    `;
  }

  function updateTicketButtons(status) {
    if (status === "closed") {
      closeBtn.disabled = true;
      reopenBtn.disabled = false;
    } else {
      closeBtn.disabled = false;
      reopenBtn.disabled = true;
    }
  }
});
