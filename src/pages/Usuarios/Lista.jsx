/* eslint-disable react/prop-types */
import { Table, Button } from "reactstrap";
import ModalForm from "./Modal";
import userService from "../../services/user";
import rolesService from "../../services/roles";
import { useEffect, useState } from "react";
function DataTable(props) {
  const [roles, setRoles] = useState([]);
  const deleteItem = (id) => {
    let confirmDelete = window.confirm("Delete item forever?");
    if (confirmDelete) {
      userService
        .remove(id)
        .then(() => {
          props.deleteItemFromState(id);
        })
        .catch((error) => alert(`Error deleting item: ${error}`));
    }
  };
  useEffect(() => {
    rolesService
      .getAll()
      .then((response) => {
        setRoles(response);
      })
      .catch((error) => {
        alert("Error al obtener roles", error);
      });
  }, []);

  const items = props.items.map((item) => {
    return (
      <tr key={item.idUsuario}>
        <th scope="row">{item.idUsuario}</th>
        <td>{item.nombre}</td>
        <td>{item.apellido}</td>
        <td>{item.telefono}</td>
        <td>{item.direccion}</td>
        <td>{item.user}</td>
        <td>
          {roles.map((rol) => {
            return rol.idRol === item.Roles_idRol ? rol.nombre : "";
          })}
        </td>
        <td>
          <div style={{ width: "110px" }}>
            <ModalForm
              buttonLabel="Editar"
              item={item}
              updateState={props.updateState}
            />{" "}
            <Button color="danger" onClick={() => deleteItem(item.idUsuario)}>
              Eliminar
            </Button>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Telefono</th>
          <th>Direccion</th>
          <th>Usuario</th>
          <th>Rol</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{items}</tbody>
    </Table>
  );
}

export default DataTable;
