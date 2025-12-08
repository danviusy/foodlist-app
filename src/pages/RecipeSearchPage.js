import React from "react";
import { useNavigate } from "react-router-dom";

const RecipeSearchPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <p>This is not the page that you are looking for!</p>
      <button onClick={() => navigate("/")}>Home</button>
    </div>
  );
};

export default RecipeSearchPage;
