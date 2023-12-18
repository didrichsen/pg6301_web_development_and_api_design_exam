import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../context/ApiContext";
import HandleError from "../ErrorHandling/HandleError";

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
    <div className="center-content-container" style={{ gap: "2em" }}>
      {users.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          <div>Username: {users[currentIndex].name}</div>
          <div>Email: {users[currentIndex].email}</div>
          <div>Bio: {users[currentIndex].bio}</div>
          <div className="container-next-and-previous" style={{ gap: "0.7em" }}>
            <button onClick={prevUser}>Previous User</button>
            <button onClick={nextUser}>Next User</button>
          </div>
        </>
      )}
      <Link to={`/profile`}>
        <button>To your profile</button>
      </Link>
    </div>
  );
};

export default UserProfile;
