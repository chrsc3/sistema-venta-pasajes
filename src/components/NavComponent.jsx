import { useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
const LogOut = () => {
  const Usercontext = useContext(UserContext);
  const handleLogOut = () => {
    Usercontext.updateUser(null);
    window.localStorage.removeItem("user");
  };
  return (
    <NavLink href="/" onClick={handleLogOut} style={{ color: "white" }}>
      LogOut
    </NavLink>
  );
};

function NavComponent() {
  const [collapsed, setCollapsed] = useState(true);
  const Usercontext = useContext(UserContext);

  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <div>
      <Navbar color="success" dark container="fluid">
        <NavbarToggler onClick={toggleNavbar} className="me-2" />
        <NavbarBrand href="/" className="me-auto">
          {"Usuario: "} {Usercontext.user ? `${Usercontext.user}` : ""}
        </NavbarBrand>
        <LogOut />
        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink href="/">DashBoard</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/usuarios">Usuarios</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/choferes">Choferes</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/roles">Roles</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavComponent;
