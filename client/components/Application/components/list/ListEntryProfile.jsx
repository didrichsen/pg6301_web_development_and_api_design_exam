import { Link } from "react-router-dom";

const ListEntryProfile = ({ profile }) => {
  const { name, email, bio } = profile;

  return (
    <div className="list-entry">
      <Link to={`/users`} className="custom-link">
        <h3>{name}</h3>
      </Link>
      <p>
        <strong>Email:</strong>
        {email}
      </p>
      <p>
        <strong>Bio:</strong>
        {bio}
      </p>
    </div>
  );
};

export default ListEntryProfile;
