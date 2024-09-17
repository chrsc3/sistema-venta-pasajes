/* eslint-disable react/prop-types */
import { Table, Button } from "reactstrap";
import ModalForm from "./Modal";
import choferService from "../../services/choferes";
function DataTable(props) {
  const deleteItem = (id) => {
    let confirmDelete = window.confirm("Delete item forever?");
    if (confirmDelete) {
      choferService
        .remove(id)
        .then(() => {
          props.deleteItemFromState(id);
        })
        .catch((error) => alert(`Error deleting item: ${error}`));
    }
  };

  const items = props.items.map((item) => {
    return (
      <tr key={item.idChofer}>
        <th scope="row">{item.idChofer}</th>
        <td>{item.nombre}</td>
        <td>{item.telefono}</td>
        <td>{item.numLicencia}</td>
        <td>
          <div style={{ width: "110px" }}>
            <ModalForm
              buttonLabel="Editar"
              item={item}
              updateState={props.updateState}
            />{" "}
            <Button color="danger" onClick={() => deleteItem(item.idChofer)}>
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
          <th>Telefono</th>
          <th>Licencia</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{items}</tbody>
    </Table>
  );
}

export default DataTable;
