import { db } from "../firebase.js";
import { collection, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", () => {
  const adminTicketList = document.getElementById("adminTicketList");

  // ---------- Tickets live laden ----------
  const ticketsRef = collection(db, "tickets");
  onSnapshot(ticketsRef, (snapshot) => {
    const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderTickets(tickets);
  });

  function renderTickets(tickets) {
    adminTicketList.innerHTML = "";
    tickets.forEach(ticket => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>#${ticket.id}</td>
        <td>${ticket.user}</td>
        <td>${ticket.date}</td>
        <td>${ticket.subject}</td>
        <td><span class="status ${ticket.status}">${statusText(ticket.status)}</span></td>
        <td>
          <button onclick="viewTicket('${ticket.id}')">
            <img src="../../assets/Details/Ticket/eye-black.png" />
          </button>
          <button onclick="closeTicket('${ticket.id}')">
            <img src="../../assets/Details/Ticket/close-black.png" />
          </button>
          <button onclick="openTicket('${ticket.id}')">
            <img src="../../assets/Details/Ticket/open-black.png" />
          </button>
          <button onclick="deleteTicket('${ticket.id}')">
            <img src="../../assets/Details/Ticket/trash-black.png" />
          </button>
        </td>
      `;
      adminTicketList.appendChild(tr);
    });
  }

  function statusText(s) {
    switch (s) {
      case "waiting": return "Wartet auf Antwort";
      case "answered": return "Beantwortet";
      case "closed": return "Geschlossen";
      case "open": return "Offen";
      default: return s;
    }
  }

  // ---------- Globale Funktionen ----------
  window.viewTicket = id => window.location.href = `admin-ticket-view.html?ticket=${id}`;

  window.closeTicket = async id => {
    await updateDoc(doc(db, "tickets", id), { status: "closed" });
    alert("Ticket geschlossen.");
  };

  window.openTicket = async id => {
    await updateDoc(doc(db, "tickets", id), { status: "open" });
    alert("Ticket wieder geöffnet.");
  };

  window.deleteTicket = async id => {
    if (confirm("Willst du dieses Ticket wirklich löschen?")) {
      await deleteDoc(doc(db, "tickets", id));
      alert("Ticket gelöscht.");
    }
  };
});
