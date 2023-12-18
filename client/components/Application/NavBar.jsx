import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="nav-container">
      <nav className="nav-bar">
        <div className="nav-elements">
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to={"/users"}>Browse Profiles</Link>
          <Link to="/chatroom-create">Create Chatroom</Link>
          <Link to="/chatrooms">Chatrooms</Link>
          <div className="divider"></div>
          <Link to={"/logout"}>Logout</Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
