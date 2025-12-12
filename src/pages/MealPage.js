import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const MealPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isExternal = location.pathname.includes("externalMeal");

  const [meal, setMeal] = React.useState(null);

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

  useEffect(() => {
    if (isExternal) {
      getExternalRecipe(id);
    } else {
      getInternalRecipe(id);
    }
  }, [id, isExternal]);

  return (
    <div>
      {!meal ? (
        <p>Loading...</p>
      ) : isExternal ? (
        <h1>{meal.strMeal}</h1>
      ) : (
        <h1>{meal.name}</h1>
      )}

      <p>This is not the page that you are looking for!</p>
      <button onClick={() => navigate("/")}>Home</button>
    </div>
  );
};

export default MealPage;
