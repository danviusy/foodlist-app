import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [meal, setMeal] = useState(null);

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
  }, []);

  return (
    <div className="App">
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
        </div>
      )}
    </div>
  );
}

export default App;
