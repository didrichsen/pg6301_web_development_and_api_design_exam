import { useContext, useEffect, useState } from "react";
import ListEntryChatrooms from "./ListEntryChatrooms";
import { ApiContext } from "../../context/ApiContext";
import { configureWebSocket } from "../../utils/webSocket";
import HandleError from "../ErrorHandling/HandleError";

const ListChatrooms = () => {
  const [message, setMessage] = useState([]);
  const { fetchChatrooms } = useContext(ApiContext);
  const [webSocket, setWebSocket] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadChatrooms = async () => {
    const result = await fetchChatrooms();

    if (result.error) {
      setErrorMessage(result.error.message);
    } else {
      setChatrooms(result.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadChatrooms();
  }, []);

  const handleNewChatroom = async (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "chatroomCreated") {
      const chatroomTitle = data.chatroomTitle;
      const description = data.description;

      const newMessage = `The chatroom ${chatroomTitle} with the description ${description} just got added!`;

      setMessage((oldMessage) => [...oldMessage, newMessage]);

      await loadChatrooms();
    }
  };

  useEffect(() => {
    const socket = configureWebSocket(handleNewChatroom);
    setWebSocket(socket);
  }, []);

  if (errorMessage) {
    return <HandleError errorMessage={errorMessage} />;
  }

  if (loading) {
    return <div className="center-content-container">loading ...</div>;
  }

  return (
    <>
      {chatrooms && chatrooms.length === 0 ? (
        <div className="center-content-container">
          No chatrooms to show. Create a room to start chatting!
        </div>
      ) : (
        <>
          <h2 style={{ textAlign: "center" }}>Chatrooms</h2>
          <h3 style={{ textAlign: "center", marginTop: "1em" }}>
            Join a green-room!
          </h3>
          <div className="chatroom-list">
            {chatrooms.map((c) => (
              <ListEntryChatrooms key={c._id} chatroom={c} />
            ))}
          </div>
          <p style={{ textAlign: "center" }}>Latest chatrooms created</p>
          {message.map((m, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              {m}
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default ListChatrooms;
