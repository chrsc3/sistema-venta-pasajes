/* eslint-disable no-unused-vars */
import "./choferes.css";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import ModalForm from "./Modal";
import DataTable from "./Lista";
import choferService from "../../services/choferes";

function Choferes(props) {
  const [choferes, setChoferes] = useState([]);

  const getItems = () => {
    choferService
      .getAll()
      .then((response) => {
        setChoferes(response);
      })
      .catch((error) => {
        alert("Error al obtener choferes", error);
      });
  };

  const addItemToState = (chofer) => {
    setChoferes(choferes.concat(chofer));
  };

  const updateState = (chofer) => {
    const itemIndex = choferes.findIndex(
      (data) => data.idChofer === chofer.idChofer
    );
    const newArray = [
      ...choferes.slice(0, itemIndex),
      chofer,
      ...choferes.slice(itemIndex + 1),
    ];
    setChoferes(newArray);
  };

  const deleteItemFromState = (id) => {
    console.log(id);
    const updatedItems = choferes.filter((chofer) => chofer.idChofer !== id);
    setChoferes(updatedItems);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <Container className="choferes">
      <Row>
        <Col>
          <h1 style={{ margin: "20px 0" }}>Choferes</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable
            items={choferes}
            updateState={updateState}
            deleteItemFromState={deleteItemFromState}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <ModalForm
            buttonLabel="Añadir Chofer"
            addItemToState={addItemToState}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Choferes;
