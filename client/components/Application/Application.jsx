import { Route, Routes } from "react-router-dom";
import Navbar from "./components/nav/NavBar";
import Logout from "./components/authentication/Application/Logout";
import { useEffect, useState } from "react";
import Profile from "./components/profile/Profile";
import ViewChatrooms from "./components/chatroom/ViewChatrooms";
import CreateChatroom from "./components/chatroom/CreateChatroom";
import Chatroom from "./components/chatroom/Chatroom";
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
import Homepage from "./components/home/Homepage";
import UserProfile from "./components/profile/UserProfile";
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

            <Route path={"/chatrooms"} element={<ViewChatrooms />} />
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
