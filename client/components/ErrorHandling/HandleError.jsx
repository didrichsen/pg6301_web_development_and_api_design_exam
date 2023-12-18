import React from "react";

const HandleError = ({ errorMessage }) => (
  <div className="error-message">
    <p>Error: {errorMessage}</p>
    <p>Try again!</p>
    <button onClick={() => window.location.reload()}>Refresh Page</button>
  </div>
);

export default HandleError;
