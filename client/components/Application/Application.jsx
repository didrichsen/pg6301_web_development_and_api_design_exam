import { Route, Routes } from "react-router-dom";
import Navbar from "./NavBar";
import Logout from "../Authentication/Application/Logout";
import { useEffect, useState } from "react";
import Profile from "./Profile";
import ListChatrooms from "./ListChatrooms";
import CreateChatroom from "./CreateChatroom";
import Chatroom from "./Chatroom";
import {
  fetchChatrooms,
  fetchUser,
  createChatroom,
  addComment,
  fetchAllUsers,
  deleteChatroom,
    fetchChatRoomById,
    updateChatroom,
} from "../../context/ApiContext";
import { ApiContext } from "../../context/ApiContext";
import Homepage from "./Homepage";
import UserProfile from "./UserProfile";
import HandleError from "../ErrorHandling/HandleError";

const Application = () => {
  const [user, setUser] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  async function loadUser() {
    const response = await fetchUser();

    if (response.error) {
      setErrorMessage(response.error.message);
    } else {
      const data = response.data;
      setUser(data);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  if (!user.name) {
    return <div className="center-content-container">Loading...</div>;
  }

  if (errorMessage) {
    return <HandleError errorMessage={errorMessage} />;
  }

  return (
    <>
      <Navbar />
      <ApiContext.Provider
        value={{
          fetchChatrooms,
          addComment,
          createChatroom,
          fetchUser,
          fetchAllUsers,
          loadUser,
          user,
          deleteChatroom,
            fetchChatRoomById,
            updateChatroom,
        }}
      >
        <main>
          <Routes>
            <Route path={"/"} element={<Homepage />} />
            <Route path={"/chatroom/:id"} element={<Chatroom />} />
            <Route path={"/users"} element={<UserProfile />} />

            <Route path={"/chatrooms"} element={<ListChatrooms />} />
            <Route path={"/chatroom-create"} element={<CreateChatroom />} />

            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/logout"} element={<Logout />} />
            <Route path={"*"} element={<h2>Not Found</h2>} />
          </Routes>
        </main>
      </ApiContext.Provider>
      <footer>
        <div style={{ textAlign: "center", color: "white" }}>
          <p>© 2023 Exam Web- and Api Design</p>
          <p>Version 1.0.0</p>
        </div>
      </footer>
    </>
  );
};

export default Application;
