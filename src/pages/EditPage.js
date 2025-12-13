import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div>
      <p>This is not the page that you are looking for!</p>
      <button onClick={() => navigate("/")}>Home</button>
    </div>
  );
};

export default EditPage;
