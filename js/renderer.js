const button = document.getElementById("checkApi");
const result = document.getElementById("apiResult");

button.addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:4000/api/status");
    const data = await res.json();
    result.textContent = data.message;
  } catch (err) {
    result.textContent = "API nicht erreichbar ❌";
  }
});

