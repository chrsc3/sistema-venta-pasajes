/* eslint-disable react/prop-types */
import { Table, Button } from "reactstrap";
import ModalForm from "./Modal";
import oficinaService from "../../services/oficinas";

function DataTable(props) {
  const deleteItem = (id) => {
    let confirmDelete = window.confirm("Delete item forever?");
    if (confirmDelete) {
      oficinaService
        .remove(id)
        .then(() => {
          props.deleteItemFromState(id);
        })
        .catch((error) => alert(`Error deleting item: ${error}`));
    }
  };

  const items = props.items.map((item) => {
    return (
      <tr key={item.idOficina}>
        <th scope="row">{item.idOficina}</th>
        <td>{item.nombre}</td>
        <td>{item.ciudad}</td>
        <td>{item.direccion}</td>
        <td>{item.telefono}</td>
        <td>{item.estado}</td>
        <td>
          <div style={{ width: "110px" }}>
            <ModalForm
              buttonLabel="Editar"
              item={item}
              updateState={props.updateState}
            />{" "}
            <Button color="danger" onClick={() => deleteItem(item.idOficina)}>
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
          <th>Ciudad</th>
          <th>Direccion</th>
          <th>Telefono</th>
          <th>Estado</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{items}</tbody>
    </Table>
  );
}

export default DataTable;
