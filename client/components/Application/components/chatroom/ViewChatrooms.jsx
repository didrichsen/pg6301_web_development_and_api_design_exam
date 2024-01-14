import { useContext, useEffect, useState } from "react";
import ListEntryChatrooms from "../list/ListEntryChatrooms";
import { ApiContext } from "../../../../context/ApiContext";
import { configureWebSocket } from "../../../../utils/webSocket";
import HandleError from "../../../ErrorHandling/HandleError";
import './viewChatrooms.css';

const ViewChatrooms = () => {
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
      <div className="view-chatrooms-container">
        {chatrooms && chatrooms.length === 0 ? (
            <div className="chatroom-title">
              No chatrooms to show. Create a room to start chatting!
            </div>
        ) : (
            <>
              <div className="chatrooms-list">
                <h2 className="chatroom-title">Chatrooms</h2>
                <h3 className="chatroom-title">
                  You can join private rooms where you are a member, or a room that's open for everyone.
                </h3>
              </div>
              <div className="list-chatrooms-container">
                <div className="chatroom-list">
                  {chatrooms.map((c) => (
                      <ListEntryChatrooms key={c._id} chatroom={c} />
                  ))}
                </div>
                <p>Latest chatrooms created</p>
                {message.map((m, index) => (
                    <div key={index}>{m}</div>
                ))}
              </div>
            </>
        )}
      </div>
  );
};

export default ViewChatrooms;
