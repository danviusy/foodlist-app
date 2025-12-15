import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/CreatePage.css";

const CreatePage = () => {
  const navigate = useNavigate();

  const sendIngredients = async (recipeId) => {
    try {
      await fetch("https://foodlist-app-backend.onrender.com/addIngredients", {
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
      const res = await fetch(
        "https://foodlist-app-backend.onrender.com/createRecipe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, desc }),
        }
      );
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
      await fetch("https://foodlist-app-backend.onrender.com/addSteps", {
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
    <div className="CreatePage">
      <h1>mangososilly lager en ny oppskrift</h1>

      <div className="form-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createRecipe(name, desc);
          }}
        >
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              placeholder="Enter name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={desc}
              placeholder="min super kule low effort natt mat"
              onChange={(e) => setDesc(e.target.value)}
              className="textarea-input"
              required
            />
          </div>
        </form>
      </div>

      <div className="recipe-section">
        <h2>Ingredients</h2>
        <div className="ingredients-container">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-input-group">
              <input
                type="text"
                value={ingredient.name}
                placeholder="Ingredient"
                onChange={(e) =>
                  updateIngredient(index, "name", e.target.value)
                }
              />
              <input
                type="text"
                value={ingredient.quantity}
                placeholder="Quantity"
                onChange={(e) =>
                  updateIngredient(index, "quantity", e.target.value)
                }
              />
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeIngredient(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn-add btn-add-ingredient"
          onClick={handleAddIngredient}
        >
          +
        </button>
      </div>

      <div className="recipe-section">
        <h2>Instructions</h2>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-input-group">
              <span className="step-number">{index + 1}.</span>
              <input
                type="text"
                value={step}
                placeholder="Enter instruction step"
                onChange={(e) => updateStep(index, e.target.value)}
                className="textarea-input"
              />
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeStep(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn-add btn-add-step"
          onClick={handleAddStep}
        >
          +
        </button>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-submit"
          onClick={() => createRecipe(name, desc)}
        >
          Create
        </button>
      </div>

      <div className="back-button-container">
        <button
          className="icon-btn back-btn"
          onClick={() => navigate("/")}
          title="Back to Home"
        >
          ←
        </button>
      </div>
    </div>
  );
};

export default CreatePage;
