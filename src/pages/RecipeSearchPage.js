import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RecipeSearchPage = () => {
  const navigate = useNavigate();

  const [meals, setMeals] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [categories, setCategories] = React.useState([]);

  async function filterByIngredient(ingredient) {
    if (!ingredient) {
      setMeals([]);
      return;
    }
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
      );
      const data = await response.json();
      setMeals(data.meals);
    } catch (error) {}
  }

  async function filterByCategory(category) {
    if (!category) {
      setMeals([]);
      return;
    }
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      const data = await response.json();
      setMeals(data.meals);
    } catch (error) {
      console.error("Error fetching meals by category:", error);
    }
  }

  async function getCategories() {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async function getRandomMeals() {
    const tempMeals = [];
    try {
      for (let i = 0; i < 10; i++) {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/random.php"
        );
        const data = await response.json();
        tempMeals.push(data.meals[0]);
      }
      setMeals(tempMeals);
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  }

  useEffect(() => {}, []);

  return (
    <div>
      {categories.length === 0 ? (
        <button onClick={getCategories}>Load Categories</button>
      ) : (
        <div>
          <h2>Select a Category:</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">--Choose a category--</option>
            {categories.map((category) => (
              <option key={category.idCategory} value={category.strCategory}>
                {category.strCategory}
              </option>
            ))}
          </select>
        </div>
      )}

      {meals.length === 0 ? (
        <div>
          <h2>Welcome to the Recipe Search Page!</h2>
          <button onClick={getRandomMeals}>Get Random Meals</button>
        </div>
      ) : (
        <div>
          <h2>Here are some random meals for you:</h2>
          <ul>
            {meals.map((meal) => (
              <li key={meal.idMeal}>
                <h3>{meal.strMeal}</h3>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p>This is not the page that you are looking for!</p>
      <button onClick={() => navigate("/")}>Home</button>
    </div>
  );
};

export default RecipeSearchPage;
