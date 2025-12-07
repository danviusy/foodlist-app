CREATE TABLE external_recipe (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);


CREATE TABLE internal_recipe (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE recipe_step (
    id SERIAL PRIMARY KEY,
    recipe_id INT NOT NULL,
    step_number INT NOT NULL,
    instruction TEXT NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES internal_recipes(id) ON DELETE CASCADE
);

CREATE TABLE recipe_ingredient (
    id SERIAL PRIMARY KEY,
    recipe_id INT NOT NULL,
    ingredient_name VARCHAR(255) NOT NULL,
    quantity VARCHAR(100),
    FOREIGN KEY (recipe_id) REFERENCES internal_recipes(id) ON DELETE CASCADE
);

INSERT INTO external_recipe (id, name) VALUES
(53262, 'Adana kebab'),
(53231, 'Vietnamese lamb shanks with sweet potatoes');

SELECT * FROM external_recipe;