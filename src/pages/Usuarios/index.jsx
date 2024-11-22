/* eslint-disable no-unused-vars */
import "./usuarios.css";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import ModalForm from "./Modal";
import DataTable from "./Lista";
import userService from "../../services/user";

import { CSVLink } from "react-csv";

function Usuarios(props) {
  const [usuarios, setUsuarios] = useState([]);

  const getItems = () => {
    userService
      .getAll()
      .then((response) => {
        setUsuarios(response);
      })
      .catch((error) => {
        alert("Error al obtener usuarios", error);
      });
  };

  const addItemToState = (usuario) => {
    setUsuarios(usuarios.concat(usuario));
  };

  const updateState = (usuario) => {
    const itemIndex = usuarios.findIndex(
      (data) => data.idUsuario === usuario.idUsuario
    );
    const newArray = [
      ...usuarios.slice(0, itemIndex),
      usuario,
      ...usuarios.slice(itemIndex + 1),
    ];
    setUsuarios(newArray);
  };

  const deleteItemFromState = (id) => {
    console.log(id);
    const updatedItems = usuarios.filter((usuario) => usuario.idUsuario !== id);
    setUsuarios(updatedItems);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <Container className="usuarios">
      <Row>
        <Col>
          <h1 style={{ margin: "20px 0" }}>Usuarios</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable
            items={usuarios}
            updateState={updateState}
            deleteItemFromState={deleteItemFromState}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <ModalForm
            buttonLabel="Añadir Usuario"
            addItemToState={addItemToState}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Usuarios;
