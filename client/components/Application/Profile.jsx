import { useContext, useMemo, useState } from "react";
import { ApiContext, updateUser } from "../../context/ApiContext";
import HandleError from "../ErrorHandling/HandleError";

const Profile = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { user, loadUser } = useContext(ApiContext);

  const isValidCredentials = useMemo(() => {
    return newName.length === 0;
  }, [newName]);

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };

  const handleSaveChanges = async () => {
    const result = await updateUser(newName, newBio, user);

    if (result.error) {
      setErrorMessage(result.error.message);
    } else {
      await loadUser();
      setIsEditable(false);
    }
  };

  if (errorMessage) {
    return <HandleError errorMessage={errorMessage} />;
  }

  return (
    <div className="center-content-container">
      <div>
        <strong>Your profile</strong>
      </div>
      <div>
        Username:{" "}
        {isEditable ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        ) : (
          user.name
        )}
      </div>
      <div>Email: {user.email}</div>
      <div>
        Bio:{" "}
        {isEditable ? (
          <input
            type="text"
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
          />
        ) : (
          user.bio
        )}
      </div>
      {isEditable && (
        <button onClick={handleSaveChanges} disabled={isValidCredentials}>
          Save Changes
        </button>
      )}
      <button style={{ width: "10em" }} onClick={handleEditToggle}>
        {isEditable ? "Cancel" : "Edit"}
      </button>
    </div>
  );
};

export default Profile;
