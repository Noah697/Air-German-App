document.addEventListener("DOMContentLoaded", () => {
  const ticketDetails = document.getElementById("ticketDetails");
  const chatMessages = document.getElementById("chatMessages");
  const userInput = document.getElementById("userMessage");
  const sendBtn = document.getElementById("sendMessageBtn");
  const backBtn = document.getElementById("backBtn");

  const params = new URLSearchParams(window.location.search);
  const ticketId = parseInt(params.get("id") || params.get("ticket"), 10);
  const username = localStorage.getItem("username") || "Pilot";

  const tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
  const ticket = tickets.find(t => t.id === ticketId && t.user === username);

  if (!ticket) {
    ticketDetails.innerHTML = `<p style="color:red;">Ticket nicht gefunden!</p>`;
    userInput.style.display = sendBtn.style.display = "none";
    return;
  }

  renderDetails();
  renderChat();
  checkStatus();

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
      <div class="message ${m.sender === username ? "user" : "admin"}">
        <strong>${m.sender}:</strong> ${m.text}<br>
        <small>${m.date}</small>
      </div>
    `).join("");
    chatMessages.scrollTop = chatMessages.scrollHeight;
    renderDetails();
    checkStatus();
  }

  function checkStatus() {
    // Wenn Ticket geschlossen → Nachricht senden deaktivieren
    if (ticket.status === "closed") {
      userInput.disabled = true;
      sendBtn.disabled = true;
      userInput.placeholder = "Dieses Ticket wurde geschlossen.";
    } else {
      userInput.disabled = false;
      sendBtn.disabled = false;
      userInput.placeholder = "Nachricht schreiben...";
    }
  }

  function sendMessage() {
    if (ticket.status === "closed") return;

    const text = userInput.value.trim();
    if (!text) return;

    const messages = JSON.parse(localStorage.getItem("messages") || "[]");
    messages.push({
      ticketId: ticket.id,
      sender: username,
      text,
      date: new Date().toLocaleString()
    });
    localStorage.setItem("messages", JSON.stringify(messages));

    const tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
    const tIndex = tickets.findIndex(t => t.id === ticket.id);
    tickets[tIndex].status = "waiting"; // Status zurück auf waiting
    localStorage.setItem("tickets", JSON.stringify(tickets));

    userInput.value = "";
    renderChat();
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
