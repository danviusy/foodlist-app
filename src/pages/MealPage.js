import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const MealPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isExternal = location.pathname.includes("externalMeal");

  const getExternalRecipe = async (id) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      console.log("Fetched external recipe data:", data);
    } catch (error) {
      console.error("Error fetching external recipe:", error);
    }
  };

  useEffect(() => {
    if (isExternal) {
      getExternalRecipe(id);
    } else {
      // Fetch and display internal meal details using the id
      console.log("Displaying internal meal with ID:", id);
    }
  });

  return (
    <div>
      <p>This is not the page that you are looking for!</p>
      <button onClick={() => navigate("/")}>Home</button>
    </div>
  );
};

export default MealPage;
