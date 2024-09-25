/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Button, Container, Row, Col } from "reactstrap";

function Ventas(props) {
  const [asientos, setAsientos] = useState([
    { id: 1, estado: "libre" },
    { id: 2, estado: "vendido" },
    { id: 3, estado: "reservado" },
    { id: 4, estado: "libre" },
    { id: 5, estado: "vendido" },
    { id: 6, estado: "reservado" },
    { id: 7, estado: "libre" },
    { id: 8, estado: "vendido" },
    { id: 9, estado: "reservado" },
    { id: 10, estado: "libre" },
    { id: 11, estado: "vendido" },
    { id: 12, estado: "reservado" },
    { id: 13, estado: "libre" },
    { id: 14, estado: "vendido" },
    { id: 15, estado: "reservado" },
    { id: 16, estado: "libre" },
    { id: 17, estado: "vendido" },
    { id: 18, estado: "reservado" },
    { id: 19, estado: "libre" },
    { id: 20, estado: "vendido" },
    { id: 21, estado: "reservado" },
    { id: 22, estado: "libre" },
    { id: 23, estado: "vendido" },
    { id: 24, estado: "reservado" },
    { id: 25, estado: "libre" },
    { id: 26, estado: "vendido" },
    { id: 27, estado: "reservado" },
    { id: 28, estado: "libre" },
    { id: 29, estado: "vendido" },
    { id: 30, estado: "reservado" },
    { id: 31, estado: "libre" },
    { id: 32, estado: "vendido" },
    { id: 33, estado: "reservado" },
    { id: 34, estado: "libre" },
    { id: 35, estado: "vendido" },
    { id: 36, estado: "reservado" },
    { id: 37, estado: "libre" },
    { id: 38, estado: "vendido" },
    { id: 39, estado: "reservado" },
    { id: 40, estado: "libre" },
    { id: 41, estado: "vendido" },
    { id: 42, estado: "reservado" },
    { id: 43, estado: "libre" },
  ]);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);

  const seleccionarAsiento = (id) => {
    // Verifica si el asiento ya está seleccionado
    if (!asientosSeleccionados.includes(id)) {
      // Añade el asiento a la lista de seleccionados
      setAsientosSeleccionados([...asientosSeleccionados, id]);

      // Actualiza el estado del asiento a 'seleccionado'
      setAsientos((prevAsientos) =>
        prevAsientos.map((asiento) =>
          asiento.id === id ? { ...asiento, estado: "seleccionado" } : asiento
        )
      );
    } else {
      // Si ya estaba seleccionado, lo deseleccionamos
      setAsientosSeleccionados(
        asientosSeleccionados.filter((asientoId) => asientoId !== id)
      );

      // Cambiamos el estado del asiento de vuelta a 'libre'
      setAsientos((prevAsientos) =>
        prevAsientos.map((asiento) =>
          asiento.id === id ? { ...asiento, estado: "libre" } : asiento
        )
      );
    }
  };

  const renderAsientos = () => {
    return asientos.map((asiento, index) => (
      <Button
        key={index}
        color={
          asiento.estado === "libre"
            ? "success"
            : asiento.estado === "reservado"
            ? "warning"
            : "danger"
        }
        disabled={asiento.estado !== "libre"} // Sólo se pueden seleccionar los asientos libres
        onClick={() => seleccionarAsiento(asiento.id)}
        style={{ margin: "5px" }}
      >
        {asiento.id}
      </Button>
    ));
  };
  const mostrarAsientosSeleccionados = () => {
    return (
      <div>
        <h5>Asientos Seleccionados:</h5>
        <ul>
          {asientosSeleccionados.map((id) => (
            <li key={id}>Asiento {id}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Container className="usuarios">
      <div>
        <h3>Selecciona tus asientos</h3>
        <div>{renderAsientos()}</div>
        <div>{mostrarAsientosSeleccionados()}</div>
      </div>
    </Container>
  );
}

export default Ventas;
