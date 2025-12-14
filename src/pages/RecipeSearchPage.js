import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RecipeSearchPage = () => {
  const navigate = useNavigate();

  const [meals, setMeals] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [categories, setCategories] = React.useState([]);

  const [selectedIngredient, setSelectedIngredient] = React.useState("");
  const [ingredients, setIngredients] = React.useState([]);

  const [mealsByIngredient, setMealsByIngredient] = React.useState([]);
  const [mealsByCategory, setMealsByCategory] = React.useState([]);

  const [selectedArea, setSelectedArea] = React.useState("");
  const [areas, setAreas] = React.useState("");
  const [mealsByArea, setMealsByArea] = React.useState([]);

  const [filtersOn, setFiltersOn] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [mealsBySearch, setMealsBySearch] = React.useState([]);

  async function filterMeals(...arrays) {
    const allEmpty = arrays.every((arr) => !arr || arr.length === 0);
    if (allEmpty) {
      console.log("No filters");
      setFiltersOn(false);
      return;
    }

    setFiltersOn(true);
    const newArrays = arrays.filter((arr) => arr && arr.length > 0);

    console.log("Filtering meals..");
    newArrays.sort((a, b) => a.length - b.length);

    let intersection = newArrays[0];

    for (let i = 1; i < newArrays.length; i++) {
      const ids = new Set(newArrays[i].map((meal) => meal.idMeal));
      intersection = intersection.filter((meal) => ids.has(meal.idMeal));
    }
    console.log(intersection);
    setMeals(intersection);
  }

  async function filterBySearch(search) {
    if (!search) {
      setMealsBySearch([]);
      return;
    }
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
      );
      const data = await response.json();
      console.log(data.meals);
      setMealsBySearch(data.meals);
    } catch (error) {}
  }

  async function filterByIngredient(ingredient) {
    if (!ingredient) {
      setMealsByIngredient([]);
      return;
    }
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
      );
      const data = await response.json();

      setMealsByIngredient(data.meals);
      console.log(data.meals);
    } catch (error) {}
  }

  async function filterByArea(area) {
    if (!area) {
      setMealsByArea([]);
      return;
    }
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
      );
      const data = await response.json();
      console.log(data.meals);
      setMealsByArea(data.meals);
    } catch (error) {}
  }

  async function filterByCategory(category) {
    if (!category) {
      setMealsByCategory([]);
      return;
    }
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      const data = await response.json();
      console.log(data.meals);
      setMealsByCategory(data.meals);
    } catch (error) {
      console.error("Error fetching meals by category:", error);
    }
  }

  async function getAreas() {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
      );
      const data = await response.json();
      setAreas(data.meals);
    } catch (error) {}
  }

  async function getIngredients() {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
      );
      const data = await response.json();
      setIngredients(data.meals);
    } catch (error) {}
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
  useEffect(() => {
    filterBySearch(search);
  }, [search]);

  useEffect(() => {
    filterByCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    filterByIngredient(selectedIngredient);
  }, [selectedIngredient]);

  useEffect(() => {
    filterByArea(selectedArea);
  }, [selectedArea]);

  useEffect(() => {
    filterMeals(mealsByCategory, mealsByIngredient, mealsByArea, mealsBySearch);
    if (!filtersOn) {
      getRandomMeals();
    }
  }, [mealsByCategory, mealsByIngredient, mealsByArea, mealsBySearch]);

  return (
    <div>
      <input
        type="text"
        value={search}
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />
      {categories.length === 0 ? (
        <button onClick={() => getCategories()}>Load Categories</button>
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
      {ingredients.length === 0 ? (
        <button onClick={() => getIngredients()}>Load Ingredients</button>
      ) : (
        <div>
          <h2>Select an Ingredient:</h2>
          <select
            value={selectedIngredient}
            onChange={(e) => setSelectedIngredient(e.target.value)}
          >
            <option value="">--Choose an ingredient--</option>
            {ingredients.map((ingredient) => (
              <option
                key={ingredient.idIngredient}
                value={ingredient.strIngredient}
              >
                {ingredient.strIngredient}
              </option>
            ))}
          </select>
        </div>
      )}
      {areas.length === 0 ? (
        <button onClick={() => getAreas()}>Load Areas</button>
      ) : (
        <div>
          <h2>Select an Area:</h2>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="">--Choose an area--</option>
            {areas.map((area) => (
              <option key={area.strArea} value={area.strArea}>
                {area.strArea}
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
