import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UserProvider } from "./context/userContext.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <Router>
        <App></App>
      </Router>
    </UserProvider>
  </StrictMode>
);
