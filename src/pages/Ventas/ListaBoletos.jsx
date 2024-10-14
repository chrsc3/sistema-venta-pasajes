/* eslint-disable react/prop-types */
import { Table, Button } from "reactstrap";
import ModalForm from "./Modal";
import boletosService from "../../services/boletos";
import PrintBoleto from "../../components/printBoleto"; // Asegúrate de que la ruta sea correcta
import { useEffect, useState } from "react";

function ListaBoletos(props) {
  const [boletos, setBoletos] = useState([]);

  const deleteItem = (id) => {
    let confirmDelete = window.confirm("Delete item forever?");
    if (confirmDelete) {
      boletosService
        .remove(id)
        .then(() => {
          props.deleteItemFromState(id);
        })
        .catch((error) => alert(`Error deleting item: ${error}`));
    }
  };

  useEffect(() => {
    boletosService
      .getAll()
      .then((response) => {
        setBoletos(response);
      })
      .catch((error) => {
        alert("Error al obtener boletos", error);
      });
  }, []);

  const items = boletos.map((boleto) => {
    return (
      <tr key={boleto.idBoleto}>
        <th scope="row">{boleto.idBoleto}</th>
        <td>{boleto.nombre}</td>
        <td>{boleto.fecha.fecha}</td>
        <td>{boleto.origen}</td>
        <td>{boleto.destino}</td>
        <td>{boleto.total}</td>
        <td>
          <div style={{ width: "110px" }}>
            <ModalForm
              buttonLabel="Editar"
              item={boleto}
              updateState={props.updateState}
            />{" "}
            <Button color="danger" onClick={() => deleteItem(boleto.idBoleto)}>
              Eliminar
            </Button>
            <PrintBoleto boleto={boleto} />{" "}
            {/* Asegúrate de que la ruta sea correcta */}
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
          <th>Nombre Pasajero</th>
          <th>Fecha Viaje</th>
          <th>Origen</th>
          <th>Destino</th>
          <th>Precio</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{items}</tbody>
    </Table>
  );
}

export default ListaBoletos;
