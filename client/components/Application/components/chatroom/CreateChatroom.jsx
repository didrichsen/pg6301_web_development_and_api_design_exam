import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiContext } from "../../../../context/ApiContext";
import { configureWebSocket } from "../../../../utils/webSocket";
import HandleError from "../../../ErrorHandling/HandleError";
import "./createChatroom.css";

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
    <div className="create-chatroom-container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="container-form">
          <div>
        <div className="input-field-container">
        <label htmlFor="title" className="create-room-label">
          Enter Chatroom Title
        </label>
          <input
              id = "title"
            type={"text"}
            value={chatroomTitle}
            name="title"
            onChange={(e) => handleChatroomTitleChange(e.target.value)}
              className="form-field-title"
          />
        </div>

        <div className="input-field-container">
        <label htmlFor="description" className="create-room-label">
          Enter Chatroom Description
        </label>
          <input
              id="description"
            value={description}
            name="chatroomDescription"
            onChange={(e) => setDescription(e.target.value)}
            className="form-field-description"
          />
        </div>

        <div className="input-field-container">
        <label className="create-room-label">
          Private Chatroom
        </label>
          <input
            type={"checkbox"}
            checked={isPrivate}
            name="isPrivate"
            onChange={(e) => setIsPrivate(e.target.checked)}
          />

        </div>
          </div>
          <div>
        {isPrivate ? (
          <>
            <div className="input-field-container">
            <label className="create-room-label">
              Select Participants
            </label>
              <select multiple={true} name="participants" className="select-style">
                {participants.map((participant) => (
                  <option
                    key={participant._id}
                    value={participant._id}
                    onClick={() => handleParticipantChange(participant._id)}
                    className="members-li"

                  >
                    {participant.name} ({participant.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="input-field-container ">
            <label className="create-room-label ">Participants selected</label>
            {selectedParticipants.map((participant) => (
              <div key={participant._id} className="selected-participants">
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
            </div>
          </>
        ) : null}
          </div>

        </div>

        <div className="button-container">
          <button className="submit-button" disabled={isChatroomTitleTaken}>Submit</button>
        </div>

      </form>
    </div>
  );
};

export default CreateChatroom;
