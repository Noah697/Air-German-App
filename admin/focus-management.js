// 🌍 API-Endpunkt
const API_URL = "http://5.230.70.197:8080/api/focus-airports";

// 🔹 HTML-Elemente
const form = document.getElementById("focusForm");
const focusList = document.getElementById("focusList");

// 🧭 Focus Airports laden
async function loadFocusAirports() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Fehler beim Laden der Focus Airports.");

    const data = await res.json();
    focusList.innerHTML = "";

    if (data.length === 0) {
      focusList.innerHTML = `<p class="empty">Keine Focus Airports vorhanden.</p>`;
      return;
    }

    data.forEach((airport) => {
      const item = document.createElement("div");
      item.className = "focus-item";
      item.innerHTML = `
        <h3>${airport.name} (${airport.icao})</h3>
        <img src="${airport.image}" alt="${airport.name}" class="focus-image" />
        <div class="actions">
          <button class="delete" data-id="${airport._id}">🗑️ Löschen</button>
        </div>
      `;
      focusList.appendChild(item);
    });

    // Löschen-Buttons aktivieren
    document.querySelectorAll(".delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        await deleteAirport(id);
      });
    });

  } catch (error) {
    console.error(error);
    focusList.innerHTML = `<p class="error">❌ Fehler beim Laden der Focus Airports.</p>`;
  }
}

// ➕ Focus Airport hinzufügen
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const icao = document.getElementById("icao").value.trim().toUpperCase();
  const image = document.getElementById("image").value.trim();

  if (!name || !icao || !image) {
    alert("⚠️ Bitte alle Felder ausfüllen.");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, icao, image }),
    });

    const result = await res.json();

    if (!res.ok || result.error) {
      alert("❌ Fehler: " + (result.error || "Unbekannter Fehler."));
      return;
    }

    form.reset();
    await loadFocusAirports();
    alert("✅ Focus Airport hinzugefügt!");
  } catch (error) {
    console.error("Fehler beim Hinzufügen:", error);
    alert("❌ Fehler beim Hinzufügen des Focus Airports.");
  }
});

// ❌ Focus Airport löschen
async function deleteAirport(id) {
  if (!confirm("Möchtest du diesen Focus Airport wirklich löschen?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (!res.ok || result.error) {
      alert("❌ Fehler: " + (result.error || "Unbekannter Fehler."));
      return;
    }

    await loadFocusAirports();
    alert("🗑️ Focus Airport gelöscht.");
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    alert("❌ Fehler beim Löschen des Focus Airports.");
  }
}

// 🚀 Seite initialisieren
loadFocusAirports();
