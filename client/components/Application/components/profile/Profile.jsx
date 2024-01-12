import { useContext, useMemo, useState } from "react";
import { ApiContext, updateUser } from "../../../../context/ApiContext";
import HandleError from "../../../ErrorHandling/HandleError";
import "./profile.css";

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
    <div className="profile-container">

        {/*Username*/}
      <div className="input-username input-container">
          <div>Username</div>
        {isEditable ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new username"
            className="form-field-profile"
          />
        ) : (
            <div>{user.name}</div>
        )}
      </div>
        {/*Email*/}
      <div className="input-email input-container">
          <div>Email</div>
          <div>{user.email}</div>
      </div>
        {/*Email*/}
      <div className="input-bio input-container">
          <div>Bio</div>
        {isEditable ? (
          <input
            type="text"
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            className="form-field-profile"
            placeholder="Enter bio"
          />
        ) : (
            <div>{user.bio}</div>
        )}
      </div>
        {/*Buttons*/}
     <div className="edit-button">

      <button onClick={handleEditToggle}>
        {isEditable ? "Cancel" : "Edit"}
      </button>
         {isEditable && (
             <button onClick={handleSaveChanges} disabled={isValidCredentials}>
                 Save Changes
             </button>
         )}
     </div>

    </div>
  );
};

export default Profile;
