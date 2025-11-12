/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import reportesService from "../../services/reportes";
import Lista from "./Lista";
import { CSVLink } from "react-csv";

function ReporteViajes(props) {
  const [items, setItems] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getItems = () => {
    if (!fechaInicio || !fechaFin) {
      setError("Por favor selecciona ambas fechas");
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      setError("La fecha de inicio no puede ser mayor a la fecha fin");
      return;
    }

    setLoading(true);
    setError("");
    reportesService
      .getReporteViajes(fechaInicio, fechaFin)
      .then((response) => {
        setItems(response);
        if (response.length === 0) {
          setError(
            "No se encontraron viajes en el rango de fechas seleccionado"
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener reporte de viajes:", error);
        setError("Error al obtener el reporte de viajes");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      getItems();
    }
  }, [fechaFin, fechaInicio]);

  // Calcular estadísticas
  const totalViajes = items.length;
  const totalPasajeros = items.reduce(
    (sum, item) => sum + (parseInt(item.totalPasajeros) || 0),
    0
  );
  const totalIngresos = items.reduce(
    (sum, item) => sum + (parseFloat(item.totalIngresos) || 0),
    0
  );

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="page-header">
        <h1>
          <i className="fas fa-route mr-3"></i>
          Reporte de Viajes
        </h1>
        <p className="page-header-subtitle">
          Consulta información detallada de viajes realizados por período
        </p>
      </div>

      {/* Filtros de Fecha */}
      <Card className="page-actions">
        <CardBody>
          <Row>
            <Col md={5}>
              <FormGroup>
                <Label for="fechaInicio">
                  <i className="fas fa-calendar-alt mr-2"></i>
                  Fecha Inicio:
                </Label>
                <Input
                  type="date"
                  id="fechaInicio"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={5}>
              <FormGroup>
                <Label for="fechaFin">
                  <i className="fas fa-calendar-check mr-2"></i>
                  Fecha Fin:
                </Label>
                <Input
                  type="date"
                  id="fechaFin"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button
                color="primary"
                onClick={getItems}
                disabled={loading}
                block
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                    Cargando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search mr-2"></i>
                    Consultar
                  </>
                )}
              </Button>
            </Col>
          </Row>

          {error && (
            <Alert color="warning" className="mt-3 mb-0">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {error}
            </Alert>
          )}
        </CardBody>
      </Card>

      {/* Estadísticas */}
      {items.length > 0 && (
        <Row className="mb-4">
          <Col md={4}>
            <Card className="stats-card primary">
              <CardBody>
                <Row className="align-items-center">
                  <Col>
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Total de Viajes
                    </div>
                    <div className="h5 mb-0 font-weight-bold">
                      {totalViajes}
                    </div>
                  </Col>
                  <Col xs="auto">
                    <i className="fas fa-bus fa-2x text-gray-300"></i>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stats-card info">
              <CardBody>
                <Row className="align-items-center">
                  <Col>
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Total Pasajeros
                    </div>
                    <div className="h5 mb-0 font-weight-bold">
                      {totalPasajeros}
                    </div>
                  </Col>
                  <Col xs="auto">
                    <i className="fas fa-users fa-2x text-gray-300"></i>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stats-card success">
              <CardBody>
                <Row className="align-items-center">
                  <Col>
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Ingresos Totales
                    </div>
                    <div className="h5 mb-0 font-weight-bold">
                      Bs. {totalIngresos.toFixed(2)}
                    </div>
                  </Col>
                  <Col xs="auto">
                    <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Botón de Exportar */}
      {items.length > 0 && (
        <Card className="mb-3">
          <CardBody>
            <CSVLink
              data={items}
              filename={`reporte-viajes_${fechaInicio}_${fechaFin}.csv`}
              className="btn btn-success"
            >
              <i className="fas fa-file-csv mr-2"></i>
              Exportar Reporte CSV
            </CSVLink>
          </CardBody>
        </Card>
      )}

      {/* Tabla de Resultados */}
      <div className="content-card">
        <div className="content-card-body">
          {!fechaInicio || !fechaFin ? (
            <div className="empty-state">
              <i className="fas fa-calendar-alt"></i>
              <h4>Selecciona un rango de fechas</h4>
              <p>
                Elige la fecha de inicio y fin para generar el reporte de viajes
              </p>
            </div>
          ) : loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Cargando...</span>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <h4>No hay viajes en este período</h4>
              <p>
                No se encontraron viajes realizados entre las fechas
                seleccionadas
              </p>
            </div>
          ) : (
            <Lista items={items} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ReporteViajes;
