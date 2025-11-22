import "./App.css";
import NavComponent from "./components/NavComponent";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
import Roles from "./pages/Roles";
import Choferes from "./pages/Choferes";
import Buses from "./pages/Buses";
import Viajes from "./pages/Viajes";
import Ventas from "./pages/Ventas";
import VentasNav from "./pages/Ventas/VentasNav";
import Oficinas from "./pages/Oficinas";
import ReporteVentas from "./pages/ReporteVentas";
import ReporteViajes from "./pages/ReporteViajes";
import ReporteUsuarios from "./pages/ReporteUsuarios";
import ClientesPage from "./pages/Clientes";
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
            <Route path="/choferes" element={<Choferes />} />
            <Route path="/buses" element={<Buses></Buses>} />
            <Route path="/viajes" element={<Viajes></Viajes>} />
            <Route path="/ventas" element={<VentasNav></VentasNav>} />
            <Route path="/ventas/:id" element={<Ventas></Ventas>} />
            <Route path="/oficinas" element={<Oficinas></Oficinas>} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route
              path="/reporte-ventas"
              element={<ReporteVentas></ReporteVentas>}
            />
            <Route
              path="/reporte-viajes"
              element={<ReporteViajes></ReporteViajes>}
            />
            <Route
              path="/reporte-usuarios"
              element={<ReporteUsuarios></ReporteUsuarios>}
            />
          </Routes>
        </div>
      ) : (
        <Login></Login>
      )}
    </div>
  );
}

export default App;
