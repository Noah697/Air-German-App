document.addEventListener("DOMContentLoaded", () => {
  const adminTicketList = document.getElementById("adminTicketList");
  let tickets = JSON.parse(localStorage.getItem("tickets") || "[]");

  renderTickets();

  function renderTickets() {
    adminTicketList.innerHTML = "";
    tickets.forEach(ticket => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>#${ticket.id}</td>
        <td>${ticket.user}</td>
        <td>${ticket.date}</td>
        <td>${ticket.subject}</td>
        <td><span class="status ${ticket.status}">${ticket.status}</span></td>
        <td>
          <button onclick="viewTicket(${ticket.id})">
            <img src="../../assets/Details/Ticket/eye-black.png" 
          </button>
          <button onclick="closeTicket(${ticket.id})">
            <img src="../../assets/Details/Ticket/close-black.png" 
          </button>
          <button onclick="openTicket(${ticket.id})">
            <img src="../../assets/Details/Ticket/open-black.png" />
          </button>
          <button onclick="deleteTicket(${ticket.id})">
            <img src="../../assets/Details/Ticket/trash-black.png" 
          </button>
        </td>
      `;
      adminTicketList.appendChild(tr);
    });
  }

  window.viewTicket = id => window.location.href = `admin-ticket-view.html?ticket=${id}`;

  window.closeTicket = id => {
    const tIndex = tickets.findIndex(t => t.id === id);
    if (tIndex > -1) {
      tickets[tIndex].status = "closed";
      localStorage.setItem("tickets", JSON.stringify(tickets));
      renderTickets();
    }
  };

window.openTicket = id => {
  const tIndex = tickets.findIndex(t => t.id === id);
  if (tIndex > -1) {
    tickets[tIndex].status = "open";
    localStorage.setItem("tickets", JSON.stringify(tickets));
    renderTickets();
  }
};


  window.deleteTicket = id => {
    if (confirm("Willst du dieses Ticket wirklich löschen?")) {
      tickets = tickets.filter(t => t.id !== id);
      localStorage.setItem("tickets", JSON.stringify(tickets));
      renderTickets();
    }
  };
});
