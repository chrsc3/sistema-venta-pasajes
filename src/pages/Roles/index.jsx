/* eslint-disable no-unused-vars */
import "./roles.css";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import ModalForm from "./Modal";
import DataTable from "./Lista";
import rolesService from "../../services/roles";

function Roles(props) {
  const [roles, setRoles] = useState([]);

  const getItems = () => {
    rolesService
      .getAll()
      .then((response) => {
        setRoles(response);
      })
      .catch((error) => {
        alert("Error al obtener roles", error);
      });
  };

  const addItemToState = (rol) => {
    getItems();
  };

  const updateState = (rol) => {
    getItems();
  };

  const deleteItemFromState = (id) => {
    console.log(id);
    const updatedItems = roles.filter((rol) => rol.idRol !== id);
    setRoles(updatedItems);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <Container className="roles">
      <Row>
        <Col>
          <h1 style={{ margin: "20px 0" }}>CRUD Roles</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable
            items={roles}
            updateState={updateState}
            deleteItemFromState={deleteItemFromState}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <ModalForm buttonLabel="Añadir Rol" addItemToState={addItemToState} />
        </Col>
      </Row>
    </Container>
  );
}

export default Roles;
