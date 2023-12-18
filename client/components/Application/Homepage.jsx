import { ApiContext } from "../../context/ApiContext";
import { useContext } from "react";

const Homepage = () => {
  const { user } = useContext(ApiContext);

  return (
    <div className="center-content-container">
      <h1>
        Welcome, {user.name} ({user.email})!
      </h1>
      <div className="container-welcome-message">
        <p>
          Explore and create chatrooms to connect with others who share your
          interests. Share thoughts, ideas, and engage in discussions on
          subjects that matter to you. Start by creating or joining a room and
          dive into meaningful conversations! You can create a chatroom by
          clicking on the "Create Chatroom" button in the navigation bar or you
          can browse through the list of chatrooms by clicking on the
          "Chatrooms" button.
        </p>
        <br></br>
        <p>
          Explore additional profiles to discover like-minded individuals who
          share your interests. Should you find a profile that resonates with
          your passions, take the next step by creating a chatroom and extending
          an invitation. Who knows, you might uncover more than just a shared
          interest — perhaps the beginning of a meaningful connection!
        </p>
      </div>
    </div>
  );
};

export default Homepage;
