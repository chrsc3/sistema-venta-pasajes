/* eslint-disable react/prop-types */
import { Table, Button, Badge } from "reactstrap";
import ModalForm from "./Modal";
import rolService from "../../services/roles";

function DataTable(props) {
  const deleteItem = (id) => {
    let confirmDelete = window.confirm("Delete item forever?");
    if (confirmDelete) {
      rolService
        .remove(id)
        .then(() => {
          props.deleteItemFromState(id);
        })
        .catch((error) => {
          console.log(error);
          alert(`Error deleting item: ${error.response.data.error}`);
        });
    }
  };

  const items = props.items.map((item) => {
    return (
      <tr key={item.idRol}>
        <th scope="row">{item.idRol}</th>
        <td>{item.nombre}</td>
        <td>
          {item.roles_has_permisos.map((item, index) => {
            return (
              <Badge color="success" style={{ margin: "5px" }} key={index}>
                {item.permiso.nombre}
              </Badge>
            );
          })}
        </td>
        <td>
          <div style={{ width: "110px" }}>
            <ModalForm
              buttonLabel="Editar"
              item={item}
              updateState={props.updateState}
            />{" "}
            <Button color="danger" onClick={() => deleteItem(item.idRol)}>
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
          <th>Permisos</th>
        </tr>
      </thead>
      <tbody>{items}</tbody>
    </Table>
  );
}

export default DataTable;
