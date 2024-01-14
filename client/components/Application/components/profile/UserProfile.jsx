import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../../../context/ApiContext";
import HandleError from "../../../ErrorHandling/HandleError";
import "./profile.css";

const UserProfile = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const { fetchAllUsers } = useContext(ApiContext);

  const loadUser = async () => {
    const result = await fetchAllUsers();

    if (result.error) {
      setErrorMessage(result.error.message);
    } else {
      const userData = result.data;
      setUsers(userData);
      setLoading(false);
    }
  };

  const nextUser = () => {
    setCurrentIndex((currentIndex) => (currentIndex + 1) % users.length);
  };

  const prevUser = () => {
    setCurrentIndex(
      (currentIndex) => (currentIndex - 1 + users.length) % users.length,
    );
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return <div className="center-content-container">loading...</div>;
  }

  if (errorMessage) {
    return <HandleError errorMessage={errorMessage} />;
  }

  return (
    <div className="profile-container">
      {users.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="input-username input-container">
            <div>Username</div>
            <div>{users[currentIndex].name}</div>
          </div>
          <div className="input-container input-bio-browse-users">
            <div>Bio</div>
            <div>{users[currentIndex].bio}</div>
          </div>
          <div className="edit-button">
            <button onClick={nextUser}>Next User</button>
            <button onClick={prevUser}>Previous User</button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
