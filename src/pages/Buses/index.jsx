/* eslint-disable no-unused-vars */
import "./buses.css";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import ModalForm from "./Modal";
import DataTable from "./Lista";
import busService from "../../services/buses";

import { CSVLink } from "react-csv";

function Buses(props) {
  const [buses, setBuses] = useState([]);

  const getItems = () => {
    busService
      .getAll()
      .then((response) => {
        setBuses(response);
      })
      .catch((error) => {
        alert("Error al obtener buses", error);
      });
  };

  const addItemToState = (bus) => {
    setBuses(buses.concat(bus));
  };

  const updateState = (bus) => {
    const itemIndex = buses.findIndex((data) => data.idBus === bus.idBus);
    const newArray = [
      ...buses.slice(0, itemIndex),
      bus,
      ...buses.slice(itemIndex + 1),
    ];
    setBuses(newArray);
  };

  const deleteItemFromState = (id) => {
    console.log(id);
    const updatedItems = buses.filter((bus) => bus.idBus !== id);
    setBuses(updatedItems);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <Container className="buses">
      <Row>
        <Col>
          <h1 style={{ margin: "20px 0" }}>Buses</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable
            items={buses}
            updateState={updateState}
            deleteItemFromState={deleteItemFromState}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <ModalForm buttonLabel="Añadir Bus" addItemToState={addItemToState} />
        </Col>
      </Row>
    </Container>
  );
}

export default Buses;
