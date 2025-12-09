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

  useEffect(() => {
    fetchData();
    fetch("http://localhost:5000/recipes")
      .then((res) => res.json())
      .then((data) => setSavedRecipes(data))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  return (
    <div className="HomePage">
      {!meal ? (
        <p>Loading...</p>
      ) : (
        <div>
          <button onClick={fetchData}>Get New Meal</button>
          <h2>Meal of the Day</h2>
          <div>
            <h2>{meal.strMeal}</h2>
            <img
              src={meal.strMealThumb}
              className="Food-image"
              alt="food-image"
            />
          </div>
          <div>
            <ul>
              {savedRecipes.map((recipe) => (
                <li key={recipe.id}>{recipe.name}</li>
              ))}
            </ul>
          </div>
          <button onClick={() => navigate("/search")}>Search Recipes</button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
