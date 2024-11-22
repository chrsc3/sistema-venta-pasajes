/* eslint-disable no-unused-vars */
import "./viajes.css";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import DataTable from "./Lista";
import viajeService from "../../services/viajes";

function Viajes(props) {
  const [viajes, setViajes] = useState([]);

  const getItems = () => {
    viajeService
      .getAll()
      .then((response) => {
        setViajes(response);
      })
      .catch((error) => {
        alert("Error al obtener viajes", error);
      });
  };

  const deleteItemFromState = (id) => {
    console.log(id);
    const updatedItems = viajes.filter((viaje) => viaje.idViaje !== id);
    setViajes(updatedItems);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <Container className="viajes">
      <Row>
        <Col>
          <h1 style={{ margin: "20px 0" }}>Reportes de Viajes</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable items={viajes} deleteItemFromState={deleteItemFromState} />
        </Col>
      </Row>
    </Container>
  );
}

export default Viajes;
