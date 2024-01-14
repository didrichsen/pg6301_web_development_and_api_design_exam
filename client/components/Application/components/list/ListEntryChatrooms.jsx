import { Link } from "react-router-dom";
import { useContext } from "react";
import { ApiContext } from "../../../../context/ApiContext";
import "../chatroom/viewChatrooms.css";

const ListEntryChatrooms = ({ chatroom }) => {
    const { _id, chatroomTitle, description, admin, isPrivate, participants } =
        chatroom;

    const { user } = useContext(ApiContext);

    const userIsParticipant = participants.some((p) => p.email === user.email);

    return (
        <div className={`list-entry ${userIsParticipant ? 'user-participant' : ''}`}>
            {userIsParticipant || !isPrivate ? (
                <Link to={`/chatroom/${_id}`} className="custom-link">
                    <h3 className="chatroom-title">{chatroomTitle}</h3>
                </Link>
            ) : (
                <h3 className="private-chatroom">{chatroomTitle}</h3>
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
