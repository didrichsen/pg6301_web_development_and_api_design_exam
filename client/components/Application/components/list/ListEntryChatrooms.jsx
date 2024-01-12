import { Link } from "react-router-dom";
import { useContext } from "react";
import { ApiContext } from "../../../../context/ApiContext";

const ListEntryChatrooms = ({ chatroom }) => {
  const { _id, chatroomTitle, description, admin, isPrivate, participants } =
    chatroom;

  const { user } = useContext(ApiContext);

  const userIsParticipant = participants.some((p) => p.email === user.email);

  return (
    <div className="list-entry">
      {userIsParticipant || !isPrivate ? (
        <Link to={`/chatroom/${_id}`} className="custom-link">
          <h3 style={{ color: "green" }}>{chatroomTitle}</h3>
        </Link>
      ) : (
        <h3 style={{ color: "red" }}>{chatroomTitle}</h3>
      )}
      <p>
        <strong>Description:</strong>
        {description}
      </p>
      <p>
        <strong>Added by:</strong>
        {admin}
      </p>
      <p>
        <strong>Status:</strong>
        {isPrivate ? "Private" : "Open for everyone"}
      </p>
    </div>
  );
};

export default ListEntryChatrooms;
