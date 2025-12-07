const db = require("better-sqlite3")("database.sqlite");

const createExternalRecipeTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS external_recipe (
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
        )
        `;
  db.prepare(sql).run();
};

const insertExternalRecipe = (name, age) => {
  const sql = `
    INSERT INTO external_recipe (id, name) VALUES (?, ?)`;
  db.prepare(sql).run(name, age);
};

const getExternalRecipes = () => {
  const sql = `SELECT * FROM external_recipe`;
  const rows = db.prepare(sql).all();
  console.log(rows);
};

const getExternalRecipeById = (id) => {
  const sql = `SELECT * FROM external_recipe WHERE id = ?`;
  const row = db.prepare(sql).get(id);
  console.log(row);
};

getExternalRecipeById(53240);
