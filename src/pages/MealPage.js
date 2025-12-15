import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../style/MealPage.css";

const MealPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const pathname = location.pathname.toLowerCase();
  const isExternal = pathname.includes("externalmeal");
  const isNew = pathname.includes("new");

  const [meal, setMeal] = React.useState(null);
  const [ingredients, setIngredients] = React.useState([]);
  const [steps, setSteps] = React.useState([]);

  const deleteExternalRecipe = async (id) => {
    try {
      await fetch(`http://localhost:5000/deleteRecipe/${id}`, {
        method: "DELETE",
      });
      console.log("Recipe deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const saveRecipe = async (id, name) => {
    try {
      console.log("Saving recipe:", id, name);
      await fetch("http://localhost:5000/saveRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name }),
      });
      console.log("Recipe saved successfully");
      navigate(`/externalMeal/${id}`);
      console.log("Rerendered saved recipes");
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const deleteInternalRecipe = async (id) => {
    try {
      await fetch(`http://localhost:5000/deleteInternalRecipe/${id}`, {
        method: "DELETE",
      });
      console.log("Internal recipe deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting internal recipe:", error);
    }
  };

  const getExternalRecipe = async (id) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      setMeal(data.meals[0]);
      console.log(data.meals[0]);
      console.log("Fetched external recipe data:", data);
    } catch (error) {
      console.error("Error fetching external recipe:", error);
    }
  };

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
      setMeal(data);
      console.log("Fetched internal recipe data:", data);
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
      setIngredients(data);
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
      setSteps(data);
      console.log("Fetched steps data:", data);
    } catch (error) {
      console.error("Error fetching steps:", error);
    }
  };

  useEffect(() => {
    if (isExternal) {
      getExternalRecipe(id);
    } else {
      getInternalRecipe(id);
      getIngredients(id);
      getSteps(id);
    }
  }, [id, isExternal]);

  return (
    <div className="MealPage">
      {!meal ? (
        <p className="loading">Loading...</p>
      ) : isExternal ? (
        <div className="MealPage-container">
          <h1>{meal.strMeal}</h1>

          {meal.strMealThumb && (
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="meal-image"
            />
          )}

          {meal.strCategory && (
            <div className="meal-info">
              <p>
                <strong>Category:</strong> {meal.strCategory}
              </p>
              <p>
                <strong>Cuisine:</strong> {meal.strArea}
              </p>
            </div>
          )}

          {meal.strIngredient1 && (
            <div className="ingredients-section">
              <h2>Ingredients</h2>
              <ul className="ingredients-list">
                {Array.from({ length: 20 }, (_, i) => {
                  const ingredientKey = `strIngredient${i + 1}`;
                  const measureKey = `strMeasure${i + 1}`;
                  const ingredient = meal[ingredientKey];
                  const measure = meal[measureKey];

                  if (ingredient && ingredient.trim()) {
                    return (
                      <li key={i} className="ingredient-item">
                        <span className="ingredient-quantity">
                          {measure && measure.trim()}
                        </span>
                        <span className="ingredient-name">{ingredient}</span>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          )}

          {meal.strInstructions && (
            <div className="steps-section">
              <h2>Instructions</h2>
              <ul className="steps-list">
                {meal.strInstructions
                  .split(/\r\n|\n/)
                  .filter(
                    (step) => step.trim() && !/^step\s*\d+/i.test(step.trim())
                  )
                  .map((instruction, index) => (
                    <li key={index} className="step-item">
                      <span className="step-number">Step {index + 1}</span>
                      <p className="step-instruction">{instruction.trim()}</p>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <div className="meal-actions">
            {isNew ? (
              <button
                className="icon-btn save-btn"
                onClick={() => saveRecipe(id, meal.strMeal)}
                title="Save Recipe"
              >
                🗁
              </button>
            ) : (
              <button
                className="icon-btn delete-btn-icon"
                onClick={() => deleteExternalRecipe(id)}
                title="Delete Recipe"
              >
                🗑
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="MealPage-container">
          <h1>{meal.name}</h1>

          {meal.description && (
            <div className="description-section">
              <p>{meal.description}</p>
            </div>
          )}

          {ingredients.length > 0 && (
            <div className="ingredients-section">
              <h2>Ingredients</h2>
              <ul className="ingredients-list">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    <span className="ingredient-quantity">
                      {ingredient.quantity}
                    </span>
                    <span className="ingredient-name">
                      {ingredient.ingredient_name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {steps.length > 0 && (
            <div className="steps-section">
              <h2>Steps</h2>
              <ul className="steps-list">
                {steps.map((step, index) => (
                  <li key={index} className="step-item">
                    <span className="step-number">Step {step.step_number}</span>
                    <p className="step-instruction">{step.instruction}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="meal-actions">
            <button
              className="icon-btn edit-btn"
              onClick={() => navigate(`/edit/${id}`)}
              title="Edit Recipe"
            >
              ✎
            </button>
            <button
              className="icon-btn delete-btn-icon"
              onClick={() => deleteInternalRecipe(id)}
              title="Delete Recipe"
            >
              🗑
            </button>
          </div>
        </div>
      )}

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

export default MealPage;
