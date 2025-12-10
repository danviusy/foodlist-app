import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      const data = await response.json();
      setMeal(data.meals[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteAllRecipes = async () => {
    try {
      console.log("Deleting all recipes");
      await fetch("http://localhost:5000/deleteRecipes", {
        method: "DELETE",
      });
      getSavedRecipes();
    } catch (error) {
      console.error("Error deleting recipes:", error);
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
      getSavedRecipes();
      console.log("Rerendered saved recipes");
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const getSavedRecipes = async () => {
    try {
      const response = await fetch("http://localhost:5000/recipes");
      const data = await response.json();
      setSavedRecipes([...data]);
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
    }
  };

  useEffect(() => {
    fetchData();
    getSavedRecipes();
  }, []);

  return (
    <div className="HomePage">
      {!meal ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div>
            <button onClick={fetchData}>Get New Meal</button>
            <h2>Meal of the Day</h2>
            <h2>{meal.strMeal}</h2>
            <img
              src={meal.strMealThumb}
              className="Food-image"
              alt="food-image"
            />
            <button onClick={() => saveRecipe(meal.idMeal, meal.strMeal)}>
              Save Recipe
            </button>
          </div>
          <button onClick={deleteAllRecipes}>Delete All Recipes</button>

          <div>
            <h2>Saved Recipes</h2>
            <ul>
              {savedRecipes.map((recipe) => (
                <li key={recipe.id}>{recipe.name}</li>
              ))}
            </ul>
          </div>

          <button onClick={() => navigate("/search")}>Search Recipes</button>
          <button onClick={() => navigate("/create")}>
            Create your own recipe
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
