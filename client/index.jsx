import React from "react";
import ReactDOM from "react-dom/client";

import "./components/Application.css";
import Authenticator from "./components/Application/components/authentication/Application/Authenticator";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Authenticator />);
