import { ApiContext } from "../../../../context/ApiContext";
import { useContext } from "react";

const Homepage = () => {
  const { user } = useContext(ApiContext);

  return (
    <div className="center-content-container">
      <h1>
        Welcome, {user.name} ({user.email})
      </h1>
      <div className="container-welcome-message"></div>
    </div>
  );
};

export default Homepage;
