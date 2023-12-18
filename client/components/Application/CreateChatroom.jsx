import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiContext } from "../../context/ApiContext";
import { configureWebSocket } from "../../utils/webSocket";
import HandleError from "../ErrorHandling/HandleError";

const CreateChatroom = () => {
  const [chatroomTitle, setChatroomTitle] = useState("");
  const [description, setDescription] = useState("");
  const [webSocket, setWebSocket] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isChatroomTitleTaken, setIsChatroomTitleTaken] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [existingChatrooms, setExistingChatrooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const { createChatroom, user, fetchAllUsers, fetchChatrooms } =
    useContext(ApiContext);
  //User shall be added to selectedParticipants by default
  const [selectedParticipants, setSelectedParticipants] = useState([user]);

  //user.email is filtered out. We don't want to invite ourselves to the chatroom.
  const loadUsersAndChatrooms = async () => {
    let result = await fetchAllUsers();

    if (result.error) {
      setErrorMessage(result.error.message);
    } else {
      const users = result.data;
      const usersToChooseFrom = users.filter((u) => u.email !== user.email);
      setParticipants(usersToChooseFrom);
    }

    //A list of chatroom titles is used to check if the chatroom title is taken.
    result = await fetchChatrooms();

    if (result.error) {
      setErrorMessage(result.error.message);
    } else {
      const chatrooms = result.data;
      const chatroomTitles = chatrooms.map(
        (chatroom) => chatroom.chatroomTitle,
      );
      setExistingChatrooms(chatroomTitles);
    }
  };

  useEffect(() => {
    loadUsersAndChatrooms();
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const chatRoom = {
      chatroomTitle: chatroomTitle,
      description: description,
      admin: user.email,
      participants: selectedParticipants,
      isPrivate: isPrivate,
    };

    const result = await createChatroom(chatRoom);

    if (result.error) {
      setErrorMessage(result.error.message);
    } else {
      webSocket.send(
        JSON.stringify({
          type: "chatroomCreated",
          chatroomTitle: chatroomTitle,
          description: description,
        }),
      );
      setChatroomTitle("");
      setDescription("");
      setIsPrivate(false);
      navigate("/chatrooms");
    }
  };

  //Move participant from participants to selectedParticipants
  const handleParticipantChange = (participantId) => {
    const selectedParticipant = participants.find(
      (participant) => participant._id === participantId,
    );

    setSelectedParticipants((prevSelected) => [
      ...prevSelected,
      selectedParticipant,
    ]);

    setParticipants((prevParticipants) =>
      prevParticipants.filter(
        (participant) => participant._id !== participantId,
      ),
    );
  };

  //Checking to see if the chatroom title is taken
  const handleChatroomTitleChange = (value) => {
    const trimmedTittle = value.trim();
    setChatroomTitle(value);
    if (existingChatrooms.includes(trimmedTittle)) {
      setIsChatroomTitleTaken(true);
    } else {
      setIsChatroomTitleTaken(false);
    }
  };

  //Move participant from selectedParticipants to participants
  const handleParticipantRemoval = (participantId) => {
    const removedParticipant = selectedParticipants.find(
      (participant) => participant._id === participantId,
    );

    setParticipants((prevParticipants) => [
      ...prevParticipants,
      removedParticipant,
    ]);

    setSelectedParticipants((prevSelected) =>
      prevSelected.filter((participant) => participant._id !== participantId),
    );
  };

  //Configure websocket to be used when chatroom is created
  useEffect(() => {
    const socket = configureWebSocket();
    setWebSocket(socket);
  }, []);

  //Priting error message to user if something occur when creating chatroom.
  if (errorMessage) {
    return <HandleError errorMessage={errorMessage} />;
  }

  return (
    <div className="center-content-container">
      <div style={{ marginBottom: "2em" }}>
        <h2 style={{ textAlign: "center", marginBottom: "0.5em" }}>
          Let's get you a room!
        </h2>
        <h3>
          Create a room. Either <span style={{ color: "red" }}>private</span> or{" "}
          <span style={{ color: "green" }}>public</span>!
        </h3>
      </div>
      <form className="add-chatroom-form" onSubmit={handleSubmit}>
        <label>
          Enter Chatroom Title:
          <input
            type={"text"}
            value={chatroomTitle}
            name="title"
            onChange={(e) => handleChatroomTitleChange(e.target.value)}
          />
        </label>
        <label>
          Enter Chatroom Description:
          <textarea
            value={description}
            name="chatroomDescription"
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            style={{ width: "50em", marginTop: "2em" }}
          />
        </label>
        <label>
          Private Chatroom:
          <input
            type={"checkbox"}
            checked={isPrivate}
            name="isPrivate"
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
        </label>
        {isPrivate ? (
          <>
            <label>
              Select Participants:
              <select multiple={true} name="participants">
                {participants.map((participant) => (
                  <option
                    key={participant._id}
                    value={participant._id}
                    onClick={() => handleParticipantChange(participant._id)}
                  >
                    {participant.name} ({participant.email})
                  </option>
                ))}
              </select>
            </label>
            <p>Participants selected:</p>
            {selectedParticipants.map((participant) => (
              <div key={participant._id}>
                {participant.name} ({participant.email})
                {participant.email === user.email ? (
                  "(You)"
                ) : (
                  <button
                    onClick={() => handleParticipantRemoval(participant._id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </>
        ) : null}
        <button disabled={isChatroomTitleTaken}>Submit</button>
      </form>
    </div>
  );
};

export default CreateChatroom;
