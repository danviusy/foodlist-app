import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const MealPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isExternal = location.pathname.includes("externalMeal");

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
    <div>
      {!meal ? (
        <p>Loading...</p>
      ) : isExternal ? (
        <div>
          <h1>{meal.strMeal}</h1>
          <button onClick={() => deleteExternalRecipe(id)}>Delete</button>
        </div>
      ) : (
        <div>
          <h1>{meal.name}</h1>

          {!ingredients ? (
            <p>Loading ingredients...</p>
          ) : (
            <div>
              {ingredients.map((ingredient, index) => (
                <p key={index}>
                  {ingredient.quantity} - {ingredient.ingredient_name}
                </p>
              ))}
            </div>
          )}
          {!steps ? (
            <p>Loading steps...</p>
          ) : (
            <div>
              {steps.map((step, index) => (
                <p key={index}>
                  Step {step.step_number}: {step.instruction}
                </p>
              ))}
            </div>
          )}
          <button onClick={() => deleteInternalRecipe(id)}>Delete</button>
        </div>
      )}

      <p>This is not the page that you are looking for!</p>
      <button onClick={() => navigate("/")}>Home</button>
    </div>
  );
};

export default MealPage;
