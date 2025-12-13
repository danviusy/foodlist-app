import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage.js";
import RecipeSearchPage from "../pages/RecipeSearchPage.js";
import CreatePage from "../pages/CreatePage.js";
import MealPage from "../pages/MealPage.js";
import EditPage from "../pages/EditPage.js";

const AppRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route path="/search" element={<RecipeSearchPage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/externalMeal/:id" element={<MealPage />} />
      <Route path="/internalMeal/:id" element={<MealPage />} />
      <Route path="/edit/:id" element={<EditPage />} />
    </Routes>
  );
};

export default AppRoutes;
