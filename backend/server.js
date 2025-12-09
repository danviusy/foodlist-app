const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const db = new Database("./db/database.sqlite");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/recipes", (req, res) => {
  const rows = db.prepare("SELECT * FROM external_recipe").all();
  res.json(rows);
});

app.listen(5000, () => console.log("Backend running on port 5000"));
