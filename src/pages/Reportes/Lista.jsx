/* eslint-disable react/prop-types */
import { Table, Button } from "reactstrap";
import ModalForm from "./Modal";
import viajeService from "../../services/viajes";

import { useNavigate } from "react-router-dom";

function DataTable(props) {
  const navigate = useNavigate();
  function navigateToVentas(idViaje) {
    navigate(`/ventas/${idViaje}`);
  }

  const deleteItem = (id) => {
    let confirmDelete = window.confirm("Delete item forever?");
    if (confirmDelete) {
      viajeService
        .remove(id)
        .then(() => {
          props.deleteItemFromState(id);
        })
        .catch((error) => alert(`Error deleting item: ${error}`));
    }
  };

  const items = props.items.map((item) => {
    return (
      <tr key={item.idViaje}>
        <th scope="row">{item.idViaje}</th>
        <td>{item.origen}</td>
        <td>{item.destino}</td>
        <td>{item.fechaViaje.fecha}</td>
        <td>{item.estado}</td>
        <td>{item.Buses_idBus}</td>
        <td>{item.Oficinas_idOficina}</td>
        <td>
          <div style={{ width: "110px" }}>
            <ModalForm
              buttonLabel="Editar"
              item={item}
              updateState={props.updateState}
            />{" "}
            <Button color="danger" onClick={() => deleteItem(item.idViaje)}>
              Eliminar
            </Button>
            <Button
              color="primary"
              onClick={() => navigateToVentas(item.idViaje)}
            >
              Vender
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
          <th>Origen</th>
          <th>Destino</th>
          <th>Fecha Viaje</th>
          <th>Estado</th>
          <th>Bus ID</th>
          <th>Oficina ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{items}</tbody>
    </Table>
  );
}

export default DataTable;
