import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import viajesService from "../../services/viajes";
const VentasNav = () => {
  const [viajes, setViajes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const navigate = useNavigate();
  function navigateToVentas(idViaje) {
    navigate(`/ventas/${idViaje}`);
  }

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handleSelectTrip = (trip) => {
    setSelectedTrip(trip);
    navigateToVentas(`${trip.idViaje}`);
  };
  useEffect(() => {
    viajesService.getAll().then((viajes) => {
      setViajes(viajes);
    });
  }, []);
  return (
    <Container>
      <Row>
        <Col>
          <h1>Dashboard de Ventas</h1>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>
              {selectedTrip ? selectedTrip.name : "Selecciona un viaje"}
            </DropdownToggle>
            <DropdownMenu>
              {viajes.map((trip) => (
                <DropdownItem
                  key={trip.idViaje}
                  onClick={() => handleSelectTrip(trip)}
                >
                  {trip.origen} a {trip.destino} - {trip.fechaViaje.fecha}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  );
};

export default VentasNav;
