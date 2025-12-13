import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const getInternalRecipe = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/internalRecipe/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setName(data.name);
      setDesc(data.description);
      console.log("Fetched internal recipe data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching internal recipe:", error);
    }
  };

  const getIngredients = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/ingredients/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const newIngredients = data.map(({ ingredient_name, quantity }) => ({
        name: ingredient_name,
        quantity: quantity,
      }));
      setIngredients(newIngredients);
      console.log("Fetched ingredients data:", data);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  const getSteps = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/steps/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      data.sort((a, b) => a.step_number - b.step_number);
      const newSteps = data.map(({ instruction }) => instruction);
      setSteps(newSteps);
      console.log("Fetched steps data:", data);
    } catch (error) {
      console.error("Error fetching steps:", error);
    }
  };

  const updateRecipe = async (name, desc) => {
    try {
      await fetch(`http://localhost:5000/updateRecipe/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, desc }),
      });
      updateIngredients(id);
      updateSteps(id);
      console.log("Updated recipe with ID:", id);
      navigate("/");
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  const updateIngredients = async (id) => {
    try {
      await fetch(`http://localhost:5000/updateIngredients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
      });
    } catch (error) {
      console.error("Error updating ingredients:", error);
    }
  };

  const updateSteps = async (id) => {
    var formattedSteps = steps.filter((step) => step.trim() !== "");
    var instructions = [];
    formattedSteps.forEach((step, index) => {
      instructions.push({ step_number: index + 1, instruction: step });
    });
    try {
      await fetch(`http://localhost:5000/updateSteps/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ steps: instructions }),
      });
    } catch (error) {
      console.error("Error updating steps:", error);
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

  useEffect(() => {
    getInternalRecipe(id);
    getIngredients(id);
    getSteps(id);
  }, [id]);

  return (
    <div>
      <h2>Edit</h2>
      <form>
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
      <button onClick={() => updateRecipe(name, desc)}>Update Recipe</button>
      <button onClick={() => navigate("/")}>Home</button>
    </div>
  );
};

export default EditPage;
