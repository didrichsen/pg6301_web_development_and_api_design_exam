import { useEffect, useState } from "react";
import LoginCallback from "../Authentication/OpenIdConnect/Callback/LoginCallback";
import LoginPage from "./LoginPage";
import Application from "./Application";
import { BrowserRouter, Link } from "react-router-dom";

const Authenticator = () => {
  async function loadConfig() {
    const response = await fetch("/api/auth/config");
    if (!response.ok) {
      throw new Error(`Failed to fetch config:${response.status}`);
    }

    const config = await response.json();
    setApplicationConfig(config);
  }

  async function onLogin() {
    await loadConfig();
    window.location = "/";
  }

  const [applicationConfig, setApplicationConfig] = useState();

  useEffect(() => {
    loadConfig();
  }, []);

  if (!applicationConfig) {
    return <div>Loading...</div>;
  }

  if (window.location.pathname === "/login/callback") {
    return (
      <LoginCallback applicationConfig={applicationConfig} onLogin={onLogin} />
    );
  }

  if (!applicationConfig.user) {
    return (
      <>
        <div className="nav-container">
          <nav className="nav-bar">
            <div style={{ textAlign: "center", color: "white" }}>
              Welcome, Log in to create rooms and chat!
            </div>
          </nav>
        </div>
        <LoginPage applicationConfig={applicationConfig} />
        <footer>
          <div style={{ textAlign: "center", color: "white" }}>
            <p>© 2023 Exam Web- and Api Design</p>
            <p>Version 1.0.0</p>
          </div>
        </footer>
      </>
    );
  }

  return (
    <BrowserRouter>
      <Application />
    </BrowserRouter>
  );
};

export default Authenticator;
