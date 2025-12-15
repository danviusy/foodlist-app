CREATE TABLE external_recipe (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE internal_recipe (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE recipe_step (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INT NOT NULL,
    step_number INT NOT NULL,
    instruction TEXT NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES internal_recipe(id) ON DELETE CASCADE
);

CREATE TABLE recipe_ingredient (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INT NOT NULL,
    ingredient_name VARCHAR(255) NOT NULL,
    quantity VARCHAR(100),
    FOREIGN KEY (recipe_id) REFERENCES internal_recipe(id) ON DELETE CASCADE
);

INSERT INTO external_recipe (id, name) VALUES
(53262, 'Adana kebab'),
(53231, 'Vietnamese lamb shanks with sweet potatoes');

SELECT * FROM external_recipe;

SELECT * FROM recipe_step;


DELETE FROM internal_recipe;
SELECT * FROM internal_recipe;

SELECT * FROM external_recipe;

SELECT * FROM external_recipe WHERE id = 53166;

SELECT * FROM recipe_ingredient;

INSERT INTO internal_recipe (name, description) VALUES
('Spaghetti Bolognese', 'A classic Italian pasta dish with rich meat sauce.'),
('Chicken Curry', 'A flavorful curry dish made with tender chicken pieces and aromatic spices.');