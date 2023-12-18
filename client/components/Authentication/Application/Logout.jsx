import { useEffect } from "react";

const Logout = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to log out " + response.statusText);
      }
    } catch (error) {
      throw new Error("Failed logout");
    }

    //Using window.location to trigger a full page reload on logout.
    window.location.pathname = "/";
  };

  useEffect(() => {
    handleLogout();
  }, []);
};

export default Logout;
