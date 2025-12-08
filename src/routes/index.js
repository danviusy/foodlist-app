import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage.js";
import RecipeSearchPage from "../pages/RecipeSearchPage.js";

const AppRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route path="/search" element={<RecipeSearchPage />} />
    </Routes>
  );
};

export default AppRoutes;
