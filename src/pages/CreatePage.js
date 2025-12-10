import React from "react";
import { useNavigate } from "react-router-dom";

const CreatePage = () => {
  const navigate = useNavigate();

  const sendIngredients = async (recipeId) => {
    try {
      await fetch("http://localhost:5000/addIngredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId, ingredients }),
      });
    } catch (error) {
      console.error("Error adding ingredients:", error);
    }
  };

  const createRecipe = async (name, desc) => {
    try {
      const res = await fetch("http://localhost:5000/createRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, desc }),
      });
      const data = await res.json();
      const recipeId = data.recipe_id;
      console.log("Created recipe with ID:", recipeId);
      sendIngredients(recipeId);
      sendIntructions(recipeId);
      navigate("/");
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  const sendIntructions = async (recipeId) => {
    var formattedSteps = steps.filter((step) => step.trim() !== "");
    var instructions = [];
    formattedSteps.forEach((step, index) => {
      instructions.push({ step_number: index + 1, instruction: step });
    });
    try {
      await fetch("http://localhost:5000/addSteps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId, steps: instructions }),
      });
    } catch (error) {
      console.error("Error adding steps:", error);
    }
  };

  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };
  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const [steps, setSteps] = React.useState([]);
  const [ingredients, setIngredients] = React.useState([]);
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  return (
    <div>
      <h2>Create a recipe</h2>
      <form onSubmit={() => createRecipe(name, desc)}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Description
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </label>
        <button type="submit">Create Recipe</button>
      </form>

      <div>
        Ingredients
        {ingredients.map((ingredient, index) => (
          <div>
            <input
              type="text"
              value={ingredient.name}
              placeholder="Ingredient"
              onChange={(e) => updateIngredient(index, "name", e.target.value)}
            />
            <input
              type="text"
              value={ingredient.quantity}
              placeholder="Quantity"
              onChange={(e) =>
                updateIngredient(index, "quantity", e.target.value)
              }
            />
            <button onClick={() => removeIngredient(index)}>Remove</button>
          </div>
        ))}
        <button onClick={() => handleAddIngredient()}>Add Ingredient</button>
      </div>
      <div>
        Instructions
        {steps.map((step, index) => (
          <div>
            <label>
              {index + 1}.
              <input
                type="text"
                value={step}
                placeholder="Quantity"
                onChange={(e) => updateStep(index, e.target.value)}
              />
              <button onClick={() => removeStep(index)}>Remove</button>
            </label>
          </div>
        ))}
        <button onClick={() => handleAddStep()}>Add step</button>
      </div>
      <button onClick={() => createRecipe(name, desc)}>Create Recipe</button>
      <button onClick={() => navigate("/")}>Home</button>
    </div>
  );
};

export default CreatePage;
