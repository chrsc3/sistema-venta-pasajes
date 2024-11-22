/* eslint-disable react/prop-types */
import { Table, Button } from "reactstrap";
import boletosService from "../../services/boletos";
import PrintBoleto from "../../components/printBoleto"; // Asegúrate de que la ruta sea correcta
import { useEffect, useState } from "react";
import PrintListaBoletos from "../../components/printListaBoletos"; // Asegúrate de que la ruta sea correcta

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
    if (!props.viaje) {
      return;
    } else {
      boletosService
        .getOne(props.viaje.idViaje)
        .then((boletos) => {
          setBoletos(boletos);
        })
        .catch((error) => {
          alert("Error al obtener boletos", error);
        });
    }
  }, [props.viaje, props.boletoRealizado]);

  const items = boletos.map((boleto) => {
    return (
      <tr key={boleto.idBoleto}>
        <th scope="row">{boleto.idBoleto}</th>
        <td>{boleto.nombre}</td>
        <td>{boleto.ci}</td>
        <td>{boleto.fecha.fecha}</td>
        <td>{boleto.total}</td>
        <td>
          <div style={{ width: "110px" }}>
            <Button color="danger" onClick={() => deleteItem(boleto.idBoleto)}>
              Devolucion
            </Button>
            <PrintBoleto boleto={boleto} />{" "}
            {/* Asegúrate de que la ruta sea correcta */}
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <PrintListaBoletos
        detalleBoletos={boletos
          .map((boleto) => {
            return boleto.detalle_boletos.map((detalle) => ({
              idDetalle_Boleto: boleto.idDetalle_Boleto,
              nombre: detalle.nombre,
              ci: detalle.ci,
            }));
          })
          .flat()}
      />
      <Table responsive hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Pasajero</th>
            <th>CI</th>
            <th>Fecha Viaje</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </Table>
    </div>
  );
}

export default ListaBoletos;
