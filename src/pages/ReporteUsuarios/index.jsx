/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import reportesService from "../../services/reportes";
import Lista from "./Lista";
import { CSVLink } from "react-csv";

function ReporteUsuarios(props) {
  const [items, setItems] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const getItems = () => {
    reportesService
      .getReporteUsuarios(fechaInicio, fechaFin)
      .then((response) => {
        setItems(response);
      })
      .catch((error) => {
        alert("Error al obtener reporte de usuarios", error);
      });
  };

  useEffect(() => {
    if (fechaInicio === "" || fechaFin === "") {
      return;
    }
    getItems();
  }, [fechaFin, fechaInicio]);

  return (
    <Container className="reportes">
      <Row>
        <Col>
          <h1 style={{ margin: "20px 0" }}>Reportes de Usuarios</h1>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <label htmlFor="fechaInicio">Fecha Inicio:</label>
          <input
            type="date"
            id="fechaInicio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="form-control"
          />
        </Col>
        <Col md={6}>
          <label htmlFor="fechaFin">Fecha Fin:</label>
          <input
            type="date"
            id="fechaFin"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="form-control"
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <Lista items={items} />
        </Col>
      </Row>

      <Row>
        <Col>
          <CSVLink data={items} filename={"reporte-usuarios.csv"}>
            Exportar CSV
          </CSVLink>
        </Col>
      </Row>
    </Container>
  );
}

export default ReporteUsuarios;
