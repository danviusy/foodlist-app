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

app.delete("/deleteRecipe/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM external_recipe WHERE id = ?");
  stmt.run(id);
  return res.status(200).json({ message: "Recipe deleted" });
});

app.delete("/deleteInternalRecipe/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM internal_recipe WHERE id = ?");
  stmt.run(id);
  return res.status(200).json({ message: "Internal recipe deleted" });
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

app.get("/internalRecipe/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("SELECT * FROM internal_recipe WHERE id = ?");
  const row = stmt.get(id);
  return res.json(row);
});

app.get("/ingredients/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare(
    "SELECT * FROM recipe_ingredient WHERE recipe_id = ?"
  );
  const rows = stmt.all(id);
  return res.json(rows);
});

app.get("/steps/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("SELECT * FROM recipe_step WHERE recipe_id = ?");
  const rows = stmt.all(id);
  return res.json(rows);
});

app.put("/updateRecipe/:id", (req, res) => {
  const { id } = req.params;
  const { name, desc } = req.body;
  const stmt = db.prepare(
    "UPDATE internal_recipe SET name = ?, description = ? WHERE id = ?"
  );
  stmt.run(name, desc, id);
  return res.status(200).json({ message: "Recipe updated" });
});

app.put("/updateIngredients/:id", (req, res) => {
  const { id } = req.params;
  const { ingredients } = req.body;
  const deleteStmt = db.prepare(
    "DELETE FROM recipe_ingredient WHERE recipe_id = ?"
  );
  deleteStmt.run(id);
  ingredients.forEach(({ name, quantity }) => {
    const insertStmt = db.prepare(
      "INSERT INTO recipe_ingredient (recipe_id, ingredient_name, quantity) VALUES (?, ?, ?)"
    );
    insertStmt.run(id, name, quantity);
  });
  return res.status(200).json({ message: "Ingredients updated" });
});

app.put("/updateSteps/:id", (req, res) => {
  const { id } = req.params;
  const { steps } = req.body;
  const deleteStmt = db.prepare("DELETE FROM recipe_step WHERE recipe_id = ?");
  deleteStmt.run(id);
  steps.forEach(({ step_number, instruction }) => {
    const insertStmt = db.prepare(
      "INSERT INTO recipe_step (recipe_id, step_number, instruction) VALUES (?, ?, ?)"
    );
    insertStmt.run(id, step_number, instruction);
  });
  return res.status(200).json({ message: "Steps updated" });
});

app.listen(5000, () => console.log("Backend running on port 5000"));
