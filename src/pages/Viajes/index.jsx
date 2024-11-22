/* eslint-disable no-unused-vars */
import "./viajes.css";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import ModalForm from "./Modal";
import DataTable from "./Lista";
import viajeService from "../../services/viajes";
import busService from "../../services/buses";

function Viajes(props) {
  const [viajes, setViajes] = useState([]);
  const [buses, setBuses] = useState([]);

  const getItems = () => {
    viajeService
      .getAll()
      .then((response) => {
        setViajes(response);
      })
      .catch((error) => {
        alert("Error al obtener viajes", error);
      });
    busService.getAll().then((response) => {
      setBuses(response);
    });
  };

  const addItemToState = (viaje) => {
    setViajes(viajes.concat(viaje));
  };

  const updateState = (viaje) => {
    const itemIndex = viajes.findIndex(
      (data) => data.idViaje === viaje.idViaje
    );
    const newArray = [
      ...viajes.slice(0, itemIndex),
      viaje,
      ...viajes.slice(itemIndex + 1),
    ];
    setViajes(newArray);
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
          <h1 style={{ margin: "20px 0" }}>Viajes</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable
            items={viajes}
            buses={buses}
            updateState={updateState}
            deleteItemFromState={deleteItemFromState}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <ModalForm
            buttonLabel="Añadir Viaje"
            addItemToState={addItemToState}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Viajes;
