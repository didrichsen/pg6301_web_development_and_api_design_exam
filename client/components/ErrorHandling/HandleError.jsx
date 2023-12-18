import React from "react";
import { useNavigate } from "react-router-dom";

const HandleError = ({ errorMessage }) => {
  const navigate = useNavigate();

  const goToHomepage = () => {
    navigate("/");
  };

  return (
    <div className="error-message">
      <p>Error: {errorMessage}</p>
      <p>Go to homepage</p>
      <button onClick={goToHomepage}>Go to homepage</button>
    </div>
  );
};

export default HandleError;
