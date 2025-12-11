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
  return res.status(201).json({ message: "Recipe saved" });
});

app.delete("/deleteRecipes", (req, res) => {
  const stmt = db.prepare("DELETE FROM external_recipe");
  stmt.run();
  stmt.finalize();
  return res.status(200).json({ message: "All recipes deleted" });
});

app.post("/createRecipe", (req, res) => {
  const { name, desc } = req.body;
  const stmt = db.prepare(
    "INSERT INTO internal_recipe (name, description) VALUES (?, ?)"
  );
  const result = stmt.run(name, desc);
  const recipeId = result.lastInsertRowid;
  return res
    .status(201)
    .json({ message: "Recipe created", recipe_id: recipeId });
});

app.post("/addIngredients", (req, res) => {
  const { recipeId, ingredients } = req.body;
  ingredients.forEach(({ name, quantity }) => {
    const stmt = db.prepare(
      "INSERT INTO recipe_ingredient (recipe_id, ingredient_name, quantity) VALUES (?, ?, ?)"
    );
    stmt.run(recipeId, name, quantity);
  });
  return res.status(201).json({ message: "Ingredients added" });
});

app.post("/addSteps", (req, res) => {
  const { recipeId, steps } = req.body;
  steps.forEach(({ step_number, instruction }) => {
    const stmt = db.prepare(
      "INSERT INTO recipe_step (recipe_id, step_number, instruction) VALUES (?, ?, ?)"
    );
    stmt.run(recipeId, step_number, instruction);
  });
});

app.get("/recipes", (req, res) => {
  const stmt = db.prepare("SELECT * FROM external_recipe");
  const rows = stmt.all();
  return res.json(rows);
});

app.get("/internalRecipes", (req, res) => {
  const stmt = db.prepare("SELECT * FROM internal_recipe");
  const rows = stmt.all();
  return res.json(rows);
});

app.listen(5000, () => console.log("Backend running on port 5000"));
