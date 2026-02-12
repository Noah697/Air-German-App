const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Benutzung: node api/addAdmin.js <username>");
  process.exit(1);
}

const username = args[0];
const usersFile = path.join(__dirname, "..", "users.json");

if (!fs.existsSync(usersFile)) {
  console.error("users.json nicht gefunden!");
  process.exit(1);
}

const users = JSON.parse(fs.readFileSync(usersFile, "utf8") || "[]");
const user = users.find(u => u.username === username);

if (!user) {
  console.error("Benutzer nicht gefunden.");
  process.exit(1);
}

user.roles = user.roles || [];
if (!user.roles.includes("admin")) {
  user.roles.push("admin");
  console.log(`✅ ${username} wurde zum Admin gemacht.`);
} else {
  console.log(`ℹ️ ${username} ist bereits Admin.`);
}

fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
console.log("Änderung gespeichert.");
