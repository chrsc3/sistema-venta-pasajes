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
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
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
  const User = useContext(UserContext);

  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <div>
      <Navbar color="success" dark expand="md" container="fluid">
        <NavbarToggler onClick={toggleNavbar} className="me-2" />
        <NavbarBrand href="/" className="me-auto">
          {"Usuario: "} {User.user.name ? User.user.name : ""}
        </NavbarBrand>

        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar className="ms-auto">
            <NavItem>
              <NavLink href="/">DashBoard</NavLink>
            </NavItem>

            {/* Dropdown para Usuarios */}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Usuarios
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem href="/usuarios">Usuarios</DropdownItem>
                <DropdownItem href="/roles">Roles</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            {/* Dropdown para Transporte */}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Transporte
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem href="/choferes">Choferes</DropdownItem>
                <DropdownItem href="/buses">Buses</DropdownItem>
                <DropdownItem href="/viajes">Viajes</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            {/* Dropdown para Ventas */}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Ventas
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem href="/oficinas">Oficinas</DropdownItem>
                <DropdownItem href="/ventas">Ventas</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
        <LogOut />
      </Navbar>
    </div>
  );
}

export default NavComponent;
