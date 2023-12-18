import { useParams } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  ApiContext,
  fetchChatRoomById,
  updateChatroom,
} from "../../context/ApiContext";
import { configureWebSocket } from "../../utils/webSocket";
import HandleError from "../ErrorHandling/HandleError";

const Chatroom = () => {
  const { id } = useParams();
  const [chatroom, setChatroom] = useState(null);
  const [newComment, setNewComment] = useState("");
  const { user, fetchChatrooms, addComment } = useContext(ApiContext);
  const [webSocket, setWebSocket] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [newChatroomTitle, setNewChatroomTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const isValidTitle = useMemo(() => {
    return newChatroomTitle.length === 0;
  }, [newChatroomTitle]);

  const isValidMessage = useMemo(() => {
    return newComment.length === 0;
  }, [newComment]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    const currentTime = new Date();
    const formattedDate = currentTime.toLocaleDateString("nb-NO");
    const formattedTime = currentTime.toLocaleTimeString("nb-NO", {
      hour: "numeric",
      minute: "numeric",
    });

    const craftedMessage = `"${newComment} " - ${user.name}(${user.email}), ${formattedDate} ${formattedTime}`;

    chatroom.comments.push(craftedMessage);

    const result = await addComment(craftedMessage, user, chatroom);

    if (result.error) {
      setErrorMessage(result.error.message);
    } else {
      webSocket.send(
        JSON.stringify({
          type: "comment",
          review: craftedMessage,
        }),
      );

      setNewComment("");
    }
  };

  const handleNewComment = async (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "comment") {
      await loadChatroom();
    }
  };

  const loadChatroom = async () => {
    const result = await fetchChatRoomById(id);

    if (result.error) {
      setErrorMessage(result.error.message);
    } else {
      const chatroom = result.data;
      setChatroom(chatroom);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChatroom();
  }, []);

  useEffect(() => {
    const socket = configureWebSocket(handleNewComment);
    setWebSocket(socket);
  }, []);

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };

  const handleUpdates = async () => {
    const result = await updateChatroom(newChatroomTitle, newDescription, id);

    if (result.error) {
      setErrorMessage(result.error.message);
    } else {
      setNewChatroomTitle("");
      setNewDescription("");
      setIsEditable(false);
      await loadChatroom();
    }
  };

  if (loading) {
    return <div>loading ...</div>;
  }

  if (errorMessage) {
    return <HandleError errorMessage={errorMessage} />;
  }

  return (
    <>
      <div className="details-container">
        <div className="chatroom-details-container">
          <h2>
            {isEditable ? (
              <>
                <label htmlFor="newChatroomTitle">New Chatroom Title:</label>
                <input
                  type="text"
                  id={"newChatroomTitle"}
                  value={newChatroomTitle}
                  onChange={(e) => setNewChatroomTitle(e.target.value)}
                />
              </>
            ) : (
              chatroom.chatroomTitle
            )}
          </h2>
          <p>
            <strong>Admin</strong>: {chatroom.admin}
          </p>
          <p>
            {isEditable ? (
              <>
                <label htmlFor="newDescription">New Description: </label>
                <input
                  type="text"
                  id="newDescription"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </>
            ) : (
              chatroom.description
            )}
          </p>
          {isEditable && (
            <button
              className="edit-and-save-button"
              onClick={handleUpdates}
              disabled={isValidTitle}
            >
              Save Changes
            </button>
          )}
          {user.email === chatroom.admin && (
            <button className="edit-and-save-button" onClick={handleEditToggle}>
              {isEditable ? "Cancel" : "Edit"}
            </button>
          )}

          <form onSubmit={handleSubmitComment}>
            <label>
              Write your Message:
              <input
                type={"text"}
                value={newComment}
                name="newComment"
                onChange={(e) => setNewComment(e.target.value)}
              />
            </label>
            <button disabled={isValidMessage}>Submit Message</button>
          </form>
        </div>

        <div className="message-container">
          {chatroom.comments.length === 0 && (
            <p>No comments yet in this chatroom. Be the first!</p>
          )}
          {chatroom.comments.map((comment, index) => (
            <div key={index} className="review">
              <p>{comment.comment}</p>
            </div>
          ))}
        </div>
      </div>
      )
    </>
  );
};

export default Chatroom;
