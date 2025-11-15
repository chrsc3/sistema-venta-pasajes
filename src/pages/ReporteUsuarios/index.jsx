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
import exportTablePdf from "../../utils/exportTablePdf";

function ReporteUsuarios(props) {
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
      .getReporteUsuarios(fechaInicio, fechaFin)
      .then((response) => {
        setItems(response);
        if (response.length === 0) {
          setError(
            "No se encontraron registros en el rango de fechas seleccionado"
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener reporte de usuarios:", error);
        setError("Error al obtener el reporte de usuarios");
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
  const totalUsuarios = items.length;
  const usuariosActivos = items.filter((u) => u.activo).length;

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="page-header">
        <h1>
          <i className="fas fa-user-chart mr-3"></i>
          Reporte de Usuarios
        </h1>
        <p className="page-header-subtitle">
          Consulta la actividad y registro de usuarios por período
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
          <Col md={6}>
            <Card className="stats-card primary">
              <CardBody>
                <Row className="align-items-center">
                  <Col>
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Total de Usuarios
                    </div>
                    <div className="h5 mb-0 font-weight-bold">
                      {totalUsuarios}
                    </div>
                  </Col>
                  <Col xs="auto">
                    <i className="fas fa-users fa-2x text-gray-300"></i>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="stats-card success">
              <CardBody>
                <Row className="align-items-center">
                  <Col>
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Usuarios Activos
                    </div>
                    <div className="h5 mb-0 font-weight-bold">
                      {usuariosActivos}
                    </div>
                  </Col>
                  <Col xs="auto">
                    <i className="fas fa-user-check fa-2x text-gray-300"></i>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* Botones de Exportar */}
      {items.length > 0 && (
        <Card className="mb-3">
          <CardBody>
            <div className="d-flex flex-wrap gap-2">
              <CSVLink
                data={items}
                filename={`reporte-usuarios_${fechaInicio}_${fechaFin}.csv`}
                className="btn btn-success mr-2"
              >
                <i className="fas fa-file-csv mr-2"></i>
                Exportar CSV
              </CSVLink>
              <Button
                color="danger"
                onClick={() => {
                  const columns = [
                    { header: "ID", field: "idUsuario", width: 50 },
                    {
                      header: "Nombre",
                      mapper: (r) =>
                        `${r.nombre || ""} ${r.apellido || ""}`.trim(),
                    },
                    { header: "Usuario", field: "user" },
                    {
                      header: "Boletos Vendidos",
                      field: "cantidadBoletos",
                      width: 80,
                    },
                    {
                      header: "Total Ventas",
                      mapper: (r) =>
                        `Bs. ${Number(r.totalVentas || 0).toFixed(2)}`,
                      width: 80,
                    },
                    { header: "Estado", field: "estado", width: 60 },
                  ];
                  exportTablePdf({
                    title: "Reporte de Usuarios",
                    subtitle: `Período: ${fechaInicio} a ${fechaFin}`,
                    columns,
                    rows: items,
                    fileName: `reporte-usuarios_${fechaInicio}_${fechaFin}.pdf`,
                    orientation: "landscape",
                  });
                }}
              >
                <i className="fas fa-file-pdf mr-2"></i>
                Exportar PDF
              </Button>
            </div>
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
                Elige la fecha de inicio y fin para generar el reporte de
                usuarios
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
              <h4>No hay registros en este período</h4>
              <p>
                No se encontraron usuarios registrados entre las fechas
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

export default ReporteUsuarios;
