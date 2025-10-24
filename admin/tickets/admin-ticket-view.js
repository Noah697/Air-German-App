document.addEventListener("DOMContentLoaded", () => {
  const ticketDetails = document.getElementById("ticketDetails");
  const chatMessages = document.getElementById("chatMessages");
  const replyInput = document.getElementById("adminReply");
  const sendReplyBtn = document.getElementById("sendReplyBtn");
  const backBtn = document.getElementById("backBtn");
  const closeBtn = document.getElementById("closeTicketBtn");
  const reopenBtn = document.getElementById("reopenTicketBtn");

  const ticketId = parseInt(new URLSearchParams(window.location.search).get("ticket"), 10);
  let tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);
  const ticket = ticketIndex > -1 ? tickets[ticketIndex] : null;

  if (!ticket) {
    ticketDetails.innerHTML = `<p style="color:red;">Ticket nicht gefunden!</p>`;
    return;
  }

  renderDetails();
  renderChat();
  updateTicketButtons();

  function renderDetails() {
    const statusLabel = {waiting:"Wartet auf Antwort", answered:"Beantwortet", closed:"Geschlossen"}[ticket.status] || ticket.status;
    ticketDetails.innerHTML = `
      <p><strong>ID:</strong> #${ticket.id}</p>
      <p><strong>Benutzer:</strong> ${ticket.user}</p>
      <p><strong>Datum:</strong> ${ticket.date}</p>
      <p><strong>Betreff:</strong> ${ticket.subject}</p>
      <p><strong>Status:</strong> ${statusLabel}</p>
    `;
  }

  function renderChat() {
    const messages = JSON.parse(localStorage.getItem("messages") || "[]")
      .filter(m => m.ticketId === ticket.id);

    chatMessages.innerHTML = messages.map(m => `
      <div class="message ${m.sender === "admin" ? "admin" : "user"}">
        <strong>${m.sender}:</strong> ${m.text}<br>
        <small>${m.date}</small>
      </div>
    `).join("");

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function sendReply() {
    const text = replyInput.value.trim();
    if (!text) return;

    const messages = JSON.parse(localStorage.getItem("messages") || "[]");
    messages.push({ticketId: ticket.id, sender: "admin", text, date: new Date().toLocaleString()});
    localStorage.setItem("messages", JSON.stringify(messages));

    tickets[ticketIndex].status = "answered";
    localStorage.setItem("tickets", JSON.stringify(tickets));

    replyInput.value = "";
    renderChat();
    renderDetails();
    updateTicketButtons();
  }

  function updateTicketButtons() {
    if (ticket.status === "closed") {
      closeBtn.disabled = true;
      reopenBtn.disabled = false;
    } else {
      closeBtn.disabled = false;
      reopenBtn.disabled = true;
    }
  }

  closeBtn.addEventListener("click", () => {
    tickets[ticketIndex].status = "closed";
    localStorage.setItem("tickets", JSON.stringify(tickets));
    renderDetails();
    renderChat();
    updateTicketButtons();
    alert("Ticket geschlossen.");
  });

  reopenBtn.addEventListener("click", () => {
    tickets[ticketIndex].status = "open";
    localStorage.setItem("tickets", JSON.stringify(tickets));
    renderDetails();
    renderChat();
    updateTicketButtons();
    alert("Ticket wieder geöffnet.");
  });

  sendReplyBtn.addEventListener("click", sendReply);
  backBtn.addEventListener("click", () => window.history.back());
});
