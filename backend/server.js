const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const db = new Database("./db/database.sqlite");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/recipes", (req, res) => {
  const stmt = db.prepare("SELECT * FROM external_recipe");
  const rows = stmt.all();
  return res.json(rows);
});

app.post("/saveRecipe", (req, res) => {
  const { id, name } = req.body;
  const stmt = db.prepare(
    "INSERT INTO external_recipe (id, name) VALUES (?, ?)"
  );
  stmt.run(id, name);
  stmt.finalize();
  return res.status(201).json({ message: "Recipe saved" });
});

app.listen(5000, () => console.log("Backend running on port 5000"));
