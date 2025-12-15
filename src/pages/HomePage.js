import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [moftdSaved, setMoftdSaved] = useState(false);

  const getTodayString = () => {
    return new Date().toISOString().split("T")[0];
  };

  const checkMoftdSaved = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/externalRecipe/${id}`
      );
      const data = await response.json();
      console.log(data);
      setMoftdSaved(data ? true : false);
    } catch (error) {
      console.error("Error checking if recipe is saved:", error);
      setMoftdSaved(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      const data = await response.json();
      setMeal(data.meals[0]);
      localStorage.setItem(
        "mealOfTheDay",
        JSON.stringify({
          date: getTodayString(),
          meal: data.meals[0],
        })
      );
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

  const deleteExternalRecipe = async (id) => {
    try {
      await fetch(`http://localhost:5000/deleteRecipe/${id}`, {
        method: "DELETE",
      });
      console.log("Recipe deleted successfully");
      getSavedRecipes();
      checkMoftdSaved(id);
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
      getSavedRecipes();
      checkMoftdSaved(id);
      console.log("Rerendered saved recipes");
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const getSavedRecipes = async () => {
    try {
      const externalRes = await fetch("http://localhost:5000/recipes");
      const externalData = await externalRes.json();

      const externalRecipes = externalData.map((recipe) => ({
        ...recipe,
        external_recipe: true,
      }));

      const internalRes = await fetch("http://localhost:5000/internalRecipes");
      const internalData = await internalRes.json();

      const internalRecipes = internalData.map((recipe) => ({
        ...recipe,
        external_recipe: false,
      }));
      setSavedRecipes([...externalRecipes, ...internalRecipes]);
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await checkMoftdSaved(53166);
      getSavedRecipes();
      const stored = localStorage.getItem("mealOfTheDay");
      const today = getTodayString();

      if (stored) {
        const { date, meal } = JSON.parse(stored);

        if (date === today) {
          setMeal(meal);
          await checkMoftdSaved(meal.idMeal);
          return;
        }
      }
      await fetchData();
    };
    init();
  }, []);

  return (
    <div className="HomePage">
      <h1>Amandas kokebok!</h1>
      {!meal ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <div className="meal-container">
            <div className="meal-content">
              <h2>Meal of the Day</h2>
              <h2>{meal.strMeal}</h2>
              <img
                src={meal.strMealThumb}
                className="Food-image"
                alt="food-image"
              />
              {moftdSaved ? (
                <button
                  className="meal-action-btn"
                  onClick={() => deleteExternalRecipe(meal.idMeal)}
                >
                  Remove from favorites
                </button>
              ) : (
                <button
                  className="meal-action-btn"
                  onClick={() => saveRecipe(meal.idMeal, meal.strMeal)}
                >
                  Save Recipe
                </button>
              )}
            </div>
          </div>

          <div className="recipes-section">
            <h2>Saved Recipes</h2>
            {savedRecipes.length > 0 ? (
              <ul className="recipes-list">
                {savedRecipes.map((recipe) => (
                  <li
                    key={recipe.id}
                    className="recipe-item"
                    onClick={() =>
                      navigate(
                        recipe.external_recipe
                          ? `/externalMeal/${recipe.id}`
                          : `/internalMeal/${recipe.id}`
                      )
                    }
                  >
                    <span className="recipe-name">{recipe.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "#7f8c8d", fontStyle: "italic" }}>
                No saved recipes yet. Start by saving a recipe!
              </p>
            )}
          </div>

          <div className="action-buttons">
            <button
              className="icon-btn search-btn"
              onClick={() => navigate("/search")}
              title="Search Recipes"
            >
              🔍︎
            </button>
            <button
              className="icon-btn create-btn"
              onClick={() => navigate("/create")}
              title="Create Recipe"
            >
              +
            </button>
          </div>

          <div className="bottom-image-container">
            <img src="/mercy.png" alt="mercy" className="cursedmercy" />
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
