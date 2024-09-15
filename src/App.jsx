import "./App.css";
import NavComponent from "./components/NavComponent";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
import Roles from "./pages/Roles";
import { useContext } from "react";
import { UserContext } from "./context/userContext";
function App() {
  return (
    <div className="App">
      {useContext(UserContext).user ? (
        <div>
          <NavComponent />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/roles" element={<Roles />} />
          </Routes>
        </div>
      ) : (
        <Login></Login>
      )}
    </div>
  );
}

export default App;
