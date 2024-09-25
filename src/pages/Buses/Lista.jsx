/* eslint-disable react/prop-types */
import { Table, Button } from "reactstrap";
import ModalForm from "./Modal";
import busService from "../../services/buses";
function DataTable(props) {
  const deleteItem = (id) => {
    let confirmDelete = window.confirm("Delete item forever?");
    if (confirmDelete) {
      busService
        .remove(id)
        .then(() => {
          props.deleteItemFromState(id);
        })
        .catch((error) => alert(`Error deleting item: ${error}`));
    }
  };

  const items = props.items.map((item) => {
    return (
      <tr key={item.idBus}>
        <th scope="row">{item.idBus}</th>
        <td>{item.marca}</td>
        <td>{item.placa}</td>
        <td>{item.tipo}</td>
        <td>{item.estado}</td>
        <td>
          <div style={{ width: "110px" }}>
            <ModalForm
              buttonLabel="Editar"
              item={item}
              updateState={props.updateState}
            />{" "}
            <Button color="danger" onClick={() => deleteItem(item.IdBus)}>
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
          <th>Marca</th>
          <th>Placa</th>
          <th>Tipo</th>
          <th>Estado</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{items}</tbody>
    </Table>
  );
}

export default DataTable;
