// --- Login- & Admin-Check ---
async function checkAdminAccess() {
  try {
    const res = await fetch("/api/me");
    const user = await res.json();

    if (!user) {
      alert("❌ Du bist nicht eingeloggt!");
      window.location.href = "../auth/login/news.html";
      return;
    }

    if (!user.roles.includes("admin")) {
      alert("🚫 Keine Berechtigung für den Adminbereich.");
      window.location.href = "../html/admin.html";
      return;
    }
  } catch (err) {
    console.error("Auth Check Error:", err);
    window.location.href = "../html/news.html";
  }
}

checkAdminAccess();

// --- News erstellen ---
document.getElementById("add-news-btn").addEventListener("click", async () => {
  const title = document.getElementById("news-title").value.trim();
  const content = document.getElementById("news-content").value.trim();
  const status = document.getElementById("news-status");

  if (!title || !content) {
    status.textContent = "Bitte Titel und Inhalt ausfüllen.";
    status.style.color = "orange";
    return;
  }

  try {
    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      status.textContent = "✅ News erfolgreich veröffentlicht!";
      status.style.color = "#00ff9d";
      document.getElementById("news-title").value = "";
      document.getElementById("news-content").value = "";
    } else {
      status.textContent = "Fehler beim Hochladen.";
      status.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    status.textContent = "Serverfehler.";
    status.style.color = "red";
  }
});

// --- Benutzerübersicht ---
document.getElementById("load-users-btn").addEventListener("click", async () => {
  const list = document.getElementById("user-list");
  list.innerHTML = "<li>Lade Benutzer...</li>";

  try {
    const res = await fetch("/api/users");
    if (!res.ok) throw new Error();
    const users = await res.json();

    list.innerHTML = "";
    users.forEach((u) => {
      const li = document.createElement("li");
      li.textContent = `${u.username} (${u.roles.join(", ") || "User"})`;
      list.appendChild(li);
    });
  } catch (err) {
    list.innerHTML = "<li>Zugriff verweigert.</li>";
  }
});

// --- Systeminfo ---
document.getElementById("refresh-system").addEventListener("click", async () => {
  try {
    const res = await fetch("/api/users");
    const users = await res.json();

    document.getElementById("server-status").textContent = "Online";
    document.getElementById("user-count").textContent = users.length;
    document.getElementById("last-update").textContent = new Date().toLocaleString();
  } catch {
    document.getElementById("server-status").textContent = "Offline";
  }
});
