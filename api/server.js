const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.json());

app.get("/api/status", (req, res) => {
  res.json({ message: "Air German API läuft 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
