/* eslint-disable no-unused-vars */
import "./viajes.css";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import DataTable from "./Lista";
import viajeService from "../../services/viajes";
import { CSVLink } from "react-csv";

function Viajes(props) {
  const [viajes, setViajes] = useState([]);
  const [loading, setLoading] = useState(true);

  const getItems = () => {
    setLoading(true);
    viajeService
      .getAll()
      .then((response) => {
        setViajes(response);
      })
      .catch((error) => {
        console.error("Error al obtener viajes:", error);
        alert("Error al obtener viajes");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteItemFromState = (id) => {
    console.log(id);
    const updatedItems = viajes.filter((viaje) => viaje.idViaje !== id);
    setViajes(updatedItems);
  };

  useEffect(() => {
    getItems();
  }, []);

  // Preparar datos para CSV
  const csvData = viajes.map((viaje) => ({
    ID: viaje.idViaje,
    Origen: viaje.origen,
    Destino: viaje.destino,
    "Fecha Salida": viaje.fechaSalida,
    "Fecha Llegada": viaje.fechaLlegada,
    Precio: viaje.precio,
    "Boletos Vendidos": viaje.Boletos?.length || 0,
  }));

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="page-header">
        <h1>
          <i className="fas fa-chart-line mr-3"></i>
          Reportes de Viajes
        </h1>
        <p className="page-header-subtitle">
          Consulta información detallada de los viajes realizados
        </p>
      </div>

      {/* Acciones */}
      {viajes.length > 0 && (
        <Card className="page-actions">
          <CardBody>
            <Row className="align-items-center">
              <Col>
                <CSVLink
                  data={csvData}
                  filename={`reporte-viajes_${
                    new Date().toISOString().split("T")[0]
                  }.csv`}
                  className="btn btn-success"
                >
                  <i className="fas fa-file-csv mr-2"></i>
                  Exportar Reporte
                </CSVLink>
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}

      {/* Contenido */}
      <div className="content-card">
        <div className="content-card-body">
          {viajes.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-chart-line"></i>
              <h4>No hay viajes registrados</h4>
              <p>Cuando se registren viajes, podrás ver los reportes aquí</p>
            </div>
          ) : (
            <DataTable
              items={viajes}
              deleteItemFromState={deleteItemFromState}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Viajes;
