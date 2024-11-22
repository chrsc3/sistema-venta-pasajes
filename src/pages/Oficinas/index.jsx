/* eslint-disable no-unused-vars */
import "./oficinas.css";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import ModalForm from "./Modal";
import DataTable from "./Lista";
import oficinaService from "../../services/oficinas";

function Oficinas(props) {
  const [oficinas, setOficinas] = useState([]);

  const getItems = () => {
    oficinaService
      .getAll()
      .then((response) => {
        setOficinas(response);
      })
      .catch((error) => {
        alert("Error al obtener oficinas", error);
      });
  };

  const addItemToState = (oficina) => {
    setOficinas(oficinas.concat(oficina));
  };

  const updateState = (oficina) => {
    const itemIndex = oficinas.findIndex(
      (data) => data.idOficina === oficina.idOficina
    );
    const newArray = [
      ...oficinas.slice(0, itemIndex),
      oficina,
      ...oficinas.slice(itemIndex + 1),
    ];
    setOficinas(newArray);
  };

  const deleteItemFromState = (id) => {
    console.log(id);
    const updatedItems = oficinas.filter((oficina) => oficina.idOficina !== id);
    setOficinas(updatedItems);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <Container className="oficinas">
      <Row>
        <Col>
          <h1 style={{ margin: "20px 0" }}>Oficinas</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable
            items={oficinas}
            updateState={updateState}
            deleteItemFromState={deleteItemFromState}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <ModalForm
            buttonLabel="Añadir Oficina"
            addItemToState={addItemToState}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Oficinas;
